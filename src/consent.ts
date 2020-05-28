import consola from 'consola'
import inquirer from 'inquirer'
import c from 'chalk'
import { updateUser } from 'rc9'
import { TelemetryOptions } from './types'

const consent = 1

export async function ensureUserConsent (options: TelemetryOptions): Promise<boolean> {
  if (options.consent === false) {
    return false
  }

  if (options.consent >= consent) {
    return true
  }

  consola.info(`
${c.green('NuxtJS')} collects completely ${c.bold('anonymous')} and ${c.bold('untrackable')} data about general usage.
  This will help us improving developer experience over the time.
  Read more: ${c.cyan.underline('https://git.io/nuxt-telemetry')}
`.trim())

  const { accept } = await inquirer.prompt({
    type: 'confirm',
    name: 'accept',
    message: 'Are you intrested in participation?'
  })

  if (accept) {
    consola.success('Thanks for opting-in! You can opt-out anytime using `nuxt telemetry -g --disable`')
    updateUser({ 'telemetry.consent': consent }, '.nuxtrc')
    return true
  }

  consola.success('Telemtry disabled. If you changed you mind, can always opt-in using `nuxt telemetry -g --enable`')
  updateUser({ 'telemetry.consent': false }, '.nuxtrc')
  return false
}
