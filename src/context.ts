import os from 'node:os'
import { execSync } from 'node:child_process'
import gitUrlParse from 'git-url-parse'
import { getNuxtVersion, isNuxt3 } from '@nuxt/kit'
import isDocker from 'is-docker'
import { provider } from 'std-env'
import type { Nuxt } from '@nuxt/schema'
import { detect } from 'package-manager-detector'
import type { Context, GitData, TelemetryOptions } from './types'
import { hash } from './utils/hash'

export async function createContext(nuxt: Nuxt, options: Required<TelemetryOptions>): Promise<Context> {
  const rootDir = nuxt.options.rootDir || process.cwd()
  const git = await getGit(rootDir)
  const packageManager = await detect({ cwd: rootDir })

  const { seed } = options
  const projectHash = await getProjectHash(rootDir, git, seed)
  const projectSession = getProjectSession(projectHash, seed)

  const nuxtVersion = getNuxtVersion(nuxt)
  const nuxtMajorVersion = isNuxt3(nuxt) ? 3 : 2
  const nodeVersion = process.version.replace('v', '')
  const isEdge = nuxtVersion.includes('edge')

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
    packageManager: packageManager?.name || 'unknown',
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
  const entry = process.argv[1]

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

async function getGit(rootDir: string): Promise<GitData | undefined> {
  const gitRemote = await getGitRemote(rootDir)

  if (!gitRemote) {
    return
  }

  const meta = gitUrlParse(gitRemote)
  const url = meta.toString('https')

  return {
    url,
    gitRemote,
    source: meta.source,
    owner: meta.owner,
    name: meta.name,
  }
}
