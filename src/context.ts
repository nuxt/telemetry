import os from 'os'
import gitUrlParse from 'git-url-parse'
import parseGitConfig from 'parse-git-config'
import isDocker from 'is-docker'
import ci from 'ci-info'
import { Context, Nuxt, GitData, TelemetryOptions } from './types'
import { detectPackageManager } from './utils/detect-package-manager'
import { hash } from './utils/hash'

export async function createContext (nuxt: Nuxt, options: TelemetryOptions): Promise<Context> {
  const rootDir = nuxt.options.rootDir || process.cwd()
  const git = await getGit(rootDir)
  const packageManager = await detectPackageManager(rootDir)

  const { seed } = options
  const projectHash = await getProjectHash(rootDir, git, seed)
  const projectSession = getProjectSession(projectHash, seed)

  const nuxtVersion = ((nuxt.constructor as any).version || '').replace('v', '')
  const nodeVersion = process.version.replace('v', '')
  const isEdge = nuxtVersion.includes('-')

  return {
    nuxt,
    seed,
    git,
    projectHash,
    projectSession,
    nuxtVersion,
    isEdge,
    cli: getCLI(),
    nodeVersion,
    os: os.type().toLocaleLowerCase(),
    environment: getEnv(),
    packageManager,
    concent: options.consent
  }
}

function getEnv (): Context['environment'] {
  if (process.env.CODESANDBOX_SSE) {
    return 'CSB'
  }

  if (ci.isCI) {
    return ci.name
  }

  if (isDocker()) {
    return 'Docker'
  }

  return 'unknown'
}

function getCLI () {
  const entry = require.main.filename

  const knownCLIs = {
    'nuxt-ts.js': 'nuxt-ts',
    'nuxt-start.js': 'nuxt-start',
    'nuxt.js': 'nuxt'
  }

  for (const key in knownCLIs) {
    if (entry.includes(key)) {
      const edge = entry.includes('-edge') ? '-edge' : ''
      return knownCLIs[key] + edge
    }
  }
  return 'programmatic'
}

function getProjectSession (projectHash: string, sessionId: string) {
  return hash(`${projectHash}#${sessionId}`)
}

function getProjectHash (rootDir: string, git?: GitData, seed?: string) {
  let id

  if (git && git.url) {
    id = `${git.source}#${git.owner}#${git.name}`
  } else {
    id = `${rootDir}#${seed}`
  }

  return hash(id)
}

async function getGitRemote (rootDir: string): Promise<string | null> {
  try {
    const parsed = await parseGitConfig({ cwd: rootDir })
    if (parsed) {
      const gitRemote = parsed['remote "origin"'].url
      return gitRemote
    }
    return null
  } catch (err) {
    return null
  }
}

async function getGit (rootDir: string): Promise<GitData | undefined> {
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
    name: meta.name
  }
}
