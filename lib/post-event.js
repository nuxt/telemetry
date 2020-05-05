import fetch from 'node-fetch'
import consola from 'consola'
import { hash } from './utils/hash'
import { isTrue } from './utils/is-true'

function getUserAgent({ options }) {
  try {
    const { name, version } = require(`${
      options ? options.rootDir : process.cwd()
    }/package.json`)
    return `${hash(name)}:${hash(version)}`
  } catch (err) {
    return 'Nuxt Telemetry'
  }
}

export async function postEvent({ body }, { options }) {
  const url =
    (options['@nuxt/telemetry'] && options['@nuxt/telemetry'].url) ||
    'http://localhost:8888/save'

  if (isTrue(process.env.NUXT_TELEMETRY_DEBUG)) {
    // Debug only
    consola.info(JSON.stringify(body, null, 1))
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
      if (!res.ok) {
        throw new Error(res.statusText)
      }
    } catch (err) {
      return null
    }
  }
}
