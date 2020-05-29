import os from 'os'
import gitUrlParse from 'git-url-parse'
import parseGitConfig from 'parse-git-config'
import isDocker from 'is-docker'
import ci from 'ci-info'
import { Nuxt, Context, GitData } from '../types'
import { detectPackageManager } from './detect-package-manager'
import { hash } from './hash'

export async function createContext (nuxt: Nuxt): Promise<Context> {
  const rootDir = nuxt.options.rootDir || process.cwd()
  const git = await getGit(rootDir)
  const packageManager = await detectPackageManager(rootDir)

  const sessionId = await nuxt.options.telemetry.seed
  const projectId = await getProjectId(rootDir, git, sessionId)
  const projectSession = getProjectSession(projectId, sessionId)

  // @ts-ignore
  const nuxtVersion = (nuxt.constructor.version || '').replace('v', '')

  return {
    nuxt,
    options: nuxt.options,
    rootDir,
    git,
    sessionId, // hash(seed)
    projectId, // hash(git upstream || path, seed)
    projectSession, // hash(projectId, sessionId)
    nuxtVersion,
    cli: getCLI(),
    nodeVersion: process.version.replace('v', ''),
    os: os.type(),
    environment: getEnv(),
    packageManager
  }
}

const eventContextkeys = [
  'nuxtVersion',
  'nodeVersion',
  'cli',
  'os',
  'environment'
]

export function getEventContext (context: Context): Context {
  const eventContext: Context = {}
  for (const key of eventContextkeys) {
    eventContext[key] = context[key]
  }
  return eventContext
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

function getProjectSession (projectId: string, sessionId: string) {
  return hash(`${projectId}#${sessionId}`)
}

function getProjectId (rootDir: string, git?: GitData, seed?: string) {
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
