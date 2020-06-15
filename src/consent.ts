import consola from 'consola'
import inquirer from 'inquirer'
import c from 'chalk'
import { updateUserNuxtRc } from './utils/nuxtrc'
import { TelemetryOptions } from './types'
import { consentVersion } from './meta'

export async function ensureUserConsent (options: TelemetryOptions): Promise<boolean> {
  if (options.consent >= consentVersion) {
    return true
  }

  console.log('options.consent', options.consent)
  if (options.consent === false) {
    return false
  }

  consola.info(`${c.green('NuxtJS')} collects completely anonymous data about usage.
  This will help us improving Nuxt developer experience over the time.
  To disable telemetry, run ${c.yellow('npx nuxt telemetry disable')}
  Read more on ${c.cyan.underline('https://git.io/nuxt-telemetry')}`)
  await new Promise(resolve => setTimeout(resolve, 3000))

  updateUserNuxtRc('telemetry.consent', consentVersion)

  // Disable sending events on first run to let user opt-out
  return false
}
