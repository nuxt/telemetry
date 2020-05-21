import { NuxtOptions, GitData } from '../types'

interface Event {
  eventName: string
  options: NuxtOptions
  git: GitData
  packageManager: string
  projectSession: string
}

interface ProjectEvent {
  name: string
  payload: {
    type: string
    isSsr: boolean
    target: string
    isTypescriptBuild: boolean
    isTypescriptRuntime: boolean
    isProgrammatic: boolean
    packageManager: string
    projectSession: string
  }
}

export function projectEvent({
  eventName,
  options,
  git,
  packageManager,
  projectSession
}: Event): ProjectEvent {
  return {
    name: eventName,
    payload: {
      type: git.url ? 'GIT' : 'LOCAL',
      isSsr: options.mode === 'universal' || options.ssr === true,
      target: options._generate ? 'static' : 'server',
      isTypescriptBuild: options.extensions.includes('ts'), // TODO: check
      isTypescriptRuntime: process.argv[1].includes('nuxt-ts'), // TODO: check if working
      isProgrammatic: !options._cli,
      packageManager,
      projectSession
    }
  }
}
