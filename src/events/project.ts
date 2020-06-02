import { EventFactory } from '../types'

export interface ProjectEvent {
  name: 'project',
  type: 'git' | 'local'
  isSsr: boolean
  target: string
  packageManager: string
}

export const project = <EventFactory<ProjectEvent>> function (context) {
  const { options } = context.nuxt
  return {
    name: 'project',
    type: context.git.url ? 'git' : 'local',
    isSsr: options.mode === 'universal' || options.ssr === true,
    target: options._generate ? 'static' : 'server',
    packageManager: context.packageManager
  }
}
