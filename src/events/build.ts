import ci from 'ci-info' // TODO: Why need it
import { NuxtOptions, Stats } from '../types'

interface Event {
  eventName: string
  options: NuxtOptions
}

interface Data {
  duration: {
    build: number
  }
  stats: Stats
}

interface BuildEvent {
  name: string
  payload: {
    isSuccess: boolean
    isDev: boolean
    isCI: boolean
    duration: object
    size: object
  }
}

export function buildEvent (
  { eventName, options }: Event,
  data: Data
): BuildEvent {
  const duration = { build: data.duration.build }
  const size: object = {}
  let isSuccess = true

  for (const [name, stat] of Object.entries(data.stats)) {
    duration[name] = stat.duration
    size[name] = stat.size
    if (!stat.success) {
      isSuccess = false
    }
  }

  return {
    name: eventName,
    payload: {
      isSuccess,
      isDev: options.dev || false,
      isCI: ci.isCI,
      duration,
      size // TODO, it's empty
    }
  }
}
