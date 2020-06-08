import { EventFactory } from '../types'

export interface CommandEvent {
  name: 'command'
  command: string
}

export const command = <EventFactory<CommandEvent>> function ({ nuxt }) {
  let command = 'unknown'

  const flagMap = {
    dev: 'dev',
    _generate: 'generate',
    _export: 'export',
    _build: 'build',
    _serve: 'serve',
    _start: 'start'
  }

  for (const flag in flagMap) {
    if (nuxt.options[flag]) {
      command = flagMap[flag]
      break
    }
  }

  return {
    name: 'command',
    command
  }
}
