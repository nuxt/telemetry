import type { EventFactory } from '../types'

export interface BuildEvent {
  name: 'build'
  isSuccess: boolean
  isDev: boolean
  duration: object
  // size: object
}

export const build = <EventFactory<BuildEvent>> function ({ nuxt }, payload) {
  const duration = { build: payload.duration.build }
  // const size = {}
  let isSuccess = true

  for (const [name, stat] of Object.entries<any>(payload.stats)) {
    // @ts-expect-error TODO: add types for payload
    duration[name] = stat.duration
    // size[name] = stat.size
    if (!stat.success) {
      isSuccess = false
    }
  }

  return {
    name: 'build',
    isSuccess,
    isDev: nuxt.options.dev || false,
    duration,
    // size
  }
}
