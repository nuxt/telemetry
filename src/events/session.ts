import type { EventFactory } from '../types'

interface SessionEvent {
  name: 'session'
  id: string
}

export const session = <EventFactory<SessionEvent>> function ({ seed }) {
  return {
    name: 'session',
    id: seed,
  }
}
