import { Nuxt, NuxtOptions, Stats } from '../types'

interface Event {
  eventName: string
  options: NuxtOptions
  nuxt: Nuxt
}

interface Data {
  routesCount: number
  stats: Stats
}

interface SSGEvent {
  name: string
  payload: {
    isLegacy: boolean
    routesCount: number
    duration: {
      generate: number
    }
  }
}

export function ssgEvent (
  { eventName, options }: Event,
  data: Data
): SSGEvent {
  // console.log(data)

  return {
    name: eventName,
    payload: {
      isLegacy: !!options._generate,
      routesCount: data.routesCount,
      duration: {
        generate: data.stats.server.duration
      }
    }
  }
}
