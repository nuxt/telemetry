import os from 'node:os'
import { existsSync, readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { getNuxtVersion, isNuxtMajorVersion } from '@nuxt/kit'
import { provider, detectAgent, isAgent } from 'std-env'
import type { Nuxt } from '@nuxt/schema'
import type { Context, GitData, TelemetryOptions } from './types'
import { hash } from './utils/hash'
import { isDocker } from './utils/is-docker'

function getNuxtMajorVersion(nuxt: Nuxt) {
  for (let i = 2; i < 10; i++) {
    if (isNuxtMajorVersion(i as 2 | 3 | 4, nuxt)) {
      return i
    }
  }
  return 2
}

export async function createContext(nuxt: Nuxt, options: Required<TelemetryOptions>): Promise<Context> {
  const rootDir = nuxt.options.workspaceDir || nuxt.options.rootDir || process.cwd()
  const git = await getGit(rootDir)
  const packageManager = detectPackageManager(rootDir)

  const { seed } = options
  const projectHash = getProjectHash(rootDir, git, seed)
  const projectSession = getProjectSession(projectHash, seed)

  const nuxtVersion = getNuxtVersion(nuxt)
  const nuxtMajorVersion = getNuxtMajorVersion(nuxt)
  const nodeVersion = process.version.replace('v', '')
  const isEdge = nuxtVersion.includes('edge')
  const agent = detectAgent()

  return {
    nuxt,
    seed,
    git,
    projectHash,
    projectSession,
    nuxtVersion,
    nuxtMajorVersion,
    isEdge,
    cli: getCLI(),
    nodeVersion,
    os: os.type().toLocaleLowerCase(),
    environment: getEnv(),
    packageManager: packageManager || 'unknown',
    isAgent: isAgent,
    agentName: agent.name || null,
    concent: options.consent,
  }
}

function getEnv(): Context['environment'] {
  if (provider) {
    return provider
  }

  if (isDocker()) {
    return 'Docker'
  }

  return 'unknown'
}

function getCLI() {
  const entry = process.argv[1] ?? ''

  const knownCLIs = {
    'nuxt-ts.js': 'nuxt-ts',
    'nuxt-start.js': 'nuxt-start',
    'nuxt.js': 'nuxt',
    'nuxi': 'nuxi',
  }

  for (const _key in knownCLIs) {
    const key = _key as keyof typeof knownCLIs
    if (entry.includes(key)) {
      const edge = entry.includes('-edge') ? '-edge' : (entry.includes('-nightly') ? '-nightly' : '')
      return knownCLIs[key] + edge
    }
  }
  return 'programmatic'
}

function getProjectSession(projectHash: string, sessionId: string) {
  return hash(`${projectHash}#${sessionId}`)
}

function getProjectHash(rootDir: string, git?: GitData, seed?: string) {
  let id

  if (git && git.url) {
    id = `${git.source}#${git.owner}#${git.name}`
  }
  else {
    id = `${rootDir}#${seed}`
  }

  return hash(id)
}

async function getGitRemote(cwd: string): Promise<string | null> {
  let gitRemoteUrl = null

  try {
    gitRemoteUrl = execSync('git config --get remote.origin.url  ', { encoding: 'utf8', cwd }).trim() || null
  }
  catch {
    /* ignore */
  }

  return gitRemoteUrl
}

function detectPackageManager(rootDir: string): string {
  // Check lockfiles first (most reliable signal)
  const lockFiles: Record<string, string> = {
    'bun.lockb': 'bun',
    'bun.lock': 'bun',
    'deno.lock': 'deno',
    'pnpm-lock.yaml': 'pnpm',
    'pnpm-workspace.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'package-lock.json': 'npm',
    'npm-shrinkwrap.json': 'npm',
  }
  for (const [file, manager] of Object.entries(lockFiles)) {
    if (existsSync(`${rootDir}/${file}`)) {
      return manager
    }
  }

  // Fall back to packageManager field in package.json (Corepack standard)
  try {
    const pkgJson = JSON.parse(readFileSync(`${rootDir}/package.json`, 'utf8'))
    if (typeof pkgJson.packageManager === 'string') {
      const name = pkgJson.packageManager.split('@')[0]
      if (name) return name
    }
  }
  catch {
    // ignore
  }

  return 'unknown'
}

function parseGitUrl(gitUrl: string): { source: string, owner: string, name: string } | null {
  // Normalize SSH URLs: git@github.com:owner/repo.git -> github.com/owner/repo
  const normalized = gitUrl.trim()

  // Handle SSH format: git@host:owner/repo.git
  const sshMatch = normalized.match(/^[\w-]+@([^:]+):(.+?)(?:\.git)?$/)
  if (sshMatch) {
    const source = sshMatch[1]!
    const path = sshMatch[2]!
    const parts = path.split('/')
    if (parts.length >= 2) {
      return { source, owner: parts.slice(0, -1).join('/'), name: parts.at(-1)! }
    }
  }

  // Handle HTTPS/Git protocol: https://github.com/owner/repo.git or git://...
  try {
    const url = new URL(normalized)
    const pathname = url.pathname.replace(/\.git$/, '').replace(/^\//, '')
    const parts = pathname.split('/')
    if (parts.length >= 2) {
      return { source: url.hostname, owner: parts.slice(0, -1).join('/'), name: parts.at(-1)! }
    }
  }
  catch {
    // Not a valid URL
  }

  return null
}

async function getGit(rootDir: string): Promise<GitData | undefined> {
  const gitRemote = await getGitRemote(rootDir)

  if (!gitRemote) {
    return
  }

  const meta = parseGitUrl(gitRemote)
  if (!meta) {
    return
  }

  return {
    url: `https://${meta.source}/${meta.owner}/${meta.name}`,
    gitRemote,
    source: meta.source,
    owner: meta.owner,
    name: meta.name,
  }
}
