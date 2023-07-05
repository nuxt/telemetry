import c from 'chalk'
import { consola } from 'consola'
import { isMinimal } from 'std-env'
import isDocker from 'is-docker'
import { updateUserNuxtRc } from './utils/nuxtrc'
import { TelemetryOptions } from './types'
import { consentVersion } from './meta'

export async function ensureUserconsent (options: TelemetryOptions): Promise<boolean> {
  if (options.consent >= consentVersion) {
    return true
  }

  if (isMinimal || process.env.CODESANDBOX_SSE || process.env.NEXT_TELEMETRY_DISABLED /* stackblitz */ || isDocker()) {
    return false
  }

  consola.restoreAll()
  process.stdout.write('\n')
  consola.info(`${c.green('Nuxt')} collects completely anonymous data about usage.
  This will help us improve Nuxt developer experience over time.
  Read more on ${c.cyan.underline('https://github.com/nuxt/telemetry')}\n`)

  const accepted = await consola.prompt('Are you interested in participating?', {
    type: 'confirm'
  })
  process.stdout.write('\n')
  consola.wrapAll()

  if (accepted) {
    updateUserNuxtRc('telemetry.consent', consentVersion)
    updateUserNuxtRc('telemetry.enabled', true)
    return true
  }

  updateUserNuxtRc('telemetry.enabled', false)
  return false
}
