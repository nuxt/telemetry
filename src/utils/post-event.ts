import { fetch } from 'ofetch'
import { version } from '../meta'
import { Event } from '../types'

interface EventBody {
  timestamp: number
  context: object
  events: Array<Event>
}

export async function postEvent (endpoint: string, body: EventBody): Promise<void> {
  const res = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Nuxt Telemetry ' + version
    }
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }
}
