import retry from 'async-retry'
import fetch from 'node-fetch'
import { hash } from './utils/hash'
// const telemetryUrl = 'http://localhost:9000/.netlify/functions/save'

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

  try {
    await retry(
      async () => {
        // if anything throws, we retry 3 times
        const res = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
            'user-agent': getUserAgent({ options })
          },
          timeout: 5000
        })

        if (!res.ok) {
          throw new Error(res.statusText)
        }
      },
      {
        retries: 3,
        minTimeout: 500
      }
    )
  } catch (err) {
    return null
  }
}
