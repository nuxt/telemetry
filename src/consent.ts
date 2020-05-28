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
${c.green('NuxtJS')} collects completely ${c.bold('anonymous')} and ${c.bold('untrackable')} data about general usage.
  This will help us improving developer experience over the time.
  Read more: ${c.cyan.underline('https://git.io/nuxt-telemetry')}
`.trim())

  if (!process.stdout.isTTY) {
    consola.warn('Telemtry disabled because running in non interactive CLI. Please use `nuxt telemetry -g --enable|--disable to hide this message.')
    return false
  }

  const { accept } = await inquirer.prompt({
    type: 'confirm',
    name: 'accept',
    message: 'Are you intrested in participation?'
  })

  if (accept) {
    consola.success('Thanks for opting-in! You can opt-out anytime using `nuxt telemetry -g --disable`')
    updateUserNuxtRc('telemetry.consent', consentVersion)
    return true
  }

  consola.success('Telemtry disabled. If you changed you mind, can always opt-in using `nuxt telemetry -g --enable`')
  updateUserNuxtRc('telemetry.consent', false)
  return false
}
