import type { EventFactory } from '../types'

interface CommandEvent {
  name: 'command'
  command: string
}

export const command = <EventFactory<CommandEvent>> function ({ nuxt }) {
  let command = process.argv[2] || 'unknown'

  const flagMap = {
    dev: 'dev',
    _generate: 'generate',
    _export: 'export',
    _build: 'build',
    _serve: 'serve',
    _start: 'start',
  } as const

  for (const _flag in flagMap) {
    // TODO: remove legacy nuxt 2 flags _export and _serve
    const flag = _flag as Exclude<keyof typeof flagMap, '_export' | '_serve'>
    // @ts-expect-error no _generate?
    if (nuxt.options[flag]) {
      command = flagMap[flag]
      break
    }
  }

  return {
    name: 'command',
    command,
  }
}
