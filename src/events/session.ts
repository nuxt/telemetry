import { EventFactory } from '../types'

export interface SessionEvent {
  name: 'session'
    id: string
}

export const session = <EventFactory<SessionEvent>> function ({ seed }) {
  return {
    name: 'session',
    id: seed
  }
}
