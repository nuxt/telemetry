import type { EventFactory } from '../types'

interface ExportEvent {
  name: 'generate'
  isExport: boolean
  routesCount: number
  duration: {
    generate: number
  }
}

export const generate = <EventFactory<ExportEvent>> function generate({ nuxt }, payload) {
  return {
    name: 'generate',
    // @ts-expect-error Legacy type from Nuxt 2
    isExport: !!nuxt.options._export,
    routesCount: payload.routesCount,
    duration: {
      generate: payload.duration.generate,
    },
  }
}
