import { version } from '../meta'
import type { Event } from '../types'

interface EventBody {
  timestamp: number
  context: object
  events: Array<Event>
}

/** Telemetry runs inside the build, so never let a slow endpoint hold the process open. */
const TIMEOUT_MS = 5000

export async function postEvent(endpoint: string, body: EventBody): Promise<void> {
  const res = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Nuxt Telemetry ' + version,
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`)
  }
}
