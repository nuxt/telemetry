import { NuxtOptions } from '../types'

interface Event {
  eventName: string
  options: NuxtOptions
  projectSession: string
  projectId: string
}

interface CliCommandEvent {
  name: string
  payload: {
    projectSession: string
    projectId: string
    name: string
  }
}

export function cliCommandEvent ({
  eventName,
  options,
  projectSession,
  projectId
}: Event): CliCommandEvent {
  let cliCommand = 'UNKNOWN' // It is probably an external nuxt command

  if (options.dev) {
    cliCommand = 'DEV'
  } else if (options._generate) {
    cliCommand = 'GENERATE'
  } else if (options._build) {
    cliCommand = 'BUILD'
  } else if (options._export) {
    cliCommand = 'EXPORT'
  } else if (options._serve) {
    cliCommand = 'SERVE'
  } else if (options._start) {
    cliCommand = 'START'
  }

  return {
    name: eventName,
    payload: {
      projectSession,
      projectId,
      name: cliCommand
      // arguments: 'null', // TODO: Discuss
      // TODO: Needs adding a flags to nuxt-cli
      // duration: {
      //   boot: false,
      //   total: false
      // }
    }
  }
}
