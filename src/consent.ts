import c from 'chalk'
import inquirer from 'inquirer'
import consola from 'consola'
import stdEnv from 'std-env'
import isDocker from 'is-docker'
import { updateUserNuxtRc } from './utils/nuxtrc'
import { TelemetryOptions } from './types'
import { consentVersion } from './meta'

export async function ensureUserconsent (options: TelemetryOptions): Promise<boolean> {
  if (options.consent >= consentVersion) {
    return true
  }

  if (stdEnv.minimal || process.env.CODESANDBOX_SSE || isDocker()) {
    return false
  }

  process.stdout.write('\n')
  consola.info(`${c.green('NuxtJS')} collects completely anonymous data about usage.
  This will help us improving Nuxt developer experience over the time.
  Read more on ${c.cyan.underline('https://git.io/nuxt-telemetry')}\n`)

  const { accept } = await inquirer.prompt({
    type: 'confirm',
    name: 'accept',
    message: 'Are you interested in participation?'
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
