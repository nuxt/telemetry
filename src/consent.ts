import c from 'chalk'
import inquirer from 'inquirer'
import consola from 'consola'
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

  process.stdout.write('\n')
  consola.info(`${c.green('Nuxt')} collects completely anonymous data about usage.
  This will help us improve Nuxt developer experience over time.
  Read more on ${c.cyan.underline('https://github.com/nuxt/telemetry')}\n`)

  const { accept } = await inquirer.prompt({
    type: 'confirm',
    name: 'accept',
    message: 'Are you interested in participating?'
  })
  process.stdout.write('\n')

  if (accept) {
    updateUserNuxtRc('telemetry.consent', consentVersion)
    updateUserNuxtRc('telemetry.enabled', true)
    return true
  }

  updateUserNuxtRc('telemetry.enabled', false)
  return false
}
