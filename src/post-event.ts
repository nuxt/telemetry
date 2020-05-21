import fetch from 'node-fetch'
import consola from 'consola'
import { hash } from './utils/hash'
import { isTrue } from './utils/is-true'
import { NuxtOptions, Event, Context } from './types'

const logger = consola.withScope('@nuxt/telemetry')

interface Body {
  createdAt: Date
  context: Context
  events: Array<Event>
}

function getUserAgent({ options }: { options: NuxtOptions }) {
  try {
    const { name, version } = require(`${
      options ? options.rootDir : process.cwd()
    }/package.json`)
    return `${hash(name)}:${hash(version)}`
  } catch (err) {
    return 'Nuxt Telemetry'
  }
}

export async function postEvent(
  { body }: { body: Body },
  { options }: { options: NuxtOptions }
): Promise<null | void> {
  const url =
    (options.telemetry && options.telemetry.url) ||
    'https://telemetry.nuxtjs.com'
  const { NUXT_TELEMETRY_DEBUG } = process.env

  if (isTrue(NUXT_TELEMETRY_DEBUG)) {
    // Debug only
    logger.info(JSON.stringify(body, null, 1))
  } else {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'content-type': 'application/json',
          'user-agent': getUserAgent({ options })
        },
        // Important: should be less than 5 seconds for prod
        timeout: 4000
      })
      console.log(res)
      if (!res.ok) {
        throw new Error(res.statusText)
      }
    } catch (err) {
      console.log(err)
      return null
    }
  }
}
