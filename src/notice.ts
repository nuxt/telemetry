import c from 'chalk'
import ora from 'ora'
import { updateUserNuxtRc } from './utils/nuxtrc'
import { TelemetryOptions } from './types'
import { noticeVersion } from './meta'

export async function ensureUserNotice (options: TelemetryOptions): Promise<boolean> {
  if (options.notice >= noticeVersion) {
    return true
  }

  if (options.notice === false) {
    return false
  }

  const message = `${c.green('NuxtJS')} collects completely anonymous data about usage.
  This will help us improving Nuxt developer experience over the time.
  To disable telemetry, run ${c.yellow('npx nuxt telemetry disable')}
  Read more on ${c.cyan.underline('https://git.io/nuxt-telemetry')}`

  const spinner = ora(message).start()

  await new Promise(resolve => setTimeout(() => {
    spinner.succeed()
    resolve()
  }, 3000))

  updateUserNuxtRc('telemetry.notice', noticeVersion)

  // Disable sending events on first run to let user opt-out
  return false
}
