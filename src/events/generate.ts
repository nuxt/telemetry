import { EventFactory } from '../types'

export interface ExportEvent {
  name: 'generate'
  isExport: boolean
  routesCount: number
  duration: {
    generate: number
  }
}

export const generate = <EventFactory<ExportEvent>> function generate ({ nuxt }, payload) {
  return {
    name: 'generate',
    isExport: !!nuxt.options._export,
    routesCount: payload.routesCount,
    duration: {
      generate: payload.duration.generate
    }
  }
}
