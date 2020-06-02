import fetch from 'node-fetch'
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
    },
    timeout: 4000 // Important: should be less than 5 seconds for prod
  })

  if (!res.ok) {
    throw new Error(res.statusText)
  }
}
