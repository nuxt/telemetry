import consola from 'consola'
import inquirer from 'inquirer'
import c from 'chalk'
// @ts-ignore
import { consentVersion } from '../package.json'
import { updateUserNuxtRc } from './utils/nuxtrc'
import { TelemetryOptions } from './types'

export async function ensureUserConsent (options: TelemetryOptions): Promise<boolean> {
  if (options.consent === false) {
    return false
  }

  if (options.consent >= consentVersion) {
    return true
  }

  consola.info(`
${c.green('NuxtJS')} collects completely anonymous data about usage.
  This will help us improving developer experience over the time.
  Read more: ${c.cyan.underline('https://git.io/nuxt-telemetry')}
`.trim())

  if (!process.stdout.isTTY) {
    consola.warn('Telemetry is disabled because running in non interactive CLI. Please use `nuxt telemetry [enable|disable] [-g] [dir]` to hide this message.')
    return false
  }

  const { accept } = await inquirer.prompt({
    type: 'confirm',
    name: 'accept',
    message: 'Are you interested in participation?'
  })

  if (accept) {
    consola.success('Thanks for opting-in! You can opt-out anytime using `nuxt telemetry disable -g`')
    updateUserNuxtRc('telemetry.consent', consentVersion)
    return true
  }

  consola.success('Telemetry disabled. If you changed you mind, can always opt-in using `nuxt telemetry enable -g`')
  updateUserNuxtRc('telemetry.consent', false)
  return false
}
