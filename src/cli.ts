import { resolve } from 'path'
import { existsSync } from 'fs'
import arg from 'arg'
import destr from 'destr'
import * as rc from 'rc9'
import defu from 'defu'
import c from 'chalk'
import consola from 'consola'

export const usage = 'nuxt telemetry `status`|`enable`|`disable` [`-g`,`--global`] [`dir`]'
const RC_FILENAME = '.nuxtrc'

function _run () {
  const args = arg({
    '--global': Boolean,
    '-g': '--global'
  })
  const [command, _dir = '.'] = args._
  const dir = resolve(process.cwd(), _dir)
  const global = args['--global']

  if (!global && !existsSync(resolve(dir, 'nuxt.config.js')) &&
    !existsSync(resolve(dir, 'nuxt.config.ts'))) {
    consola.error('It seems you are not in a nuxt project!')
    consola.info('You can try with providing dir or using `-g`')
    showUsage()
  }

  switch (command) {
    case 'enable':
      setRC('telemetry.enabled', true)
      consola.success('Nuxt telemetry enabled for', global ? 'user' : dir)
      consola.info('You can disable telemetry with `npx nuxt telemetry disable ' + (global ? '-g' : _dir))
      return
    case 'disable':
      setRC('telemetry.enabled', false)
      consola.success('Nuxt telemetry disabled for', global ? 'user' : dir)
      consola.info('You can enable telemetry with `npx nuxt telemetry enable ' + (global ? '-g' : _dir) + '`')
      return
    case 'status':
      showStatus()
      return
    default:
      showUsage()
  }

  function showStatus () {
    const nuxtrc = defu(
      global ? {} : rc.read({ name: RC_FILENAME, dir }),
      rc.readUser(RC_FILENAME)
    )
    const env = destr(process.env.NUXT_TELEMETRY_DISABLED)
    const status = ((nuxtrc.telemetry && nuxtrc.telemetry.enabled === false) || env) ? c.yellow('disabled') : c.green('enabled')
    consola.info('Nuxt telemetry is ' + status, global ? 'on machine' : 'on current project')
  }

  function showUsage () {
    consola.info(`Usage: ${usage}`)
    process.exit(0)
  }

  function setRC (key, val) {
    const update = { [key]: val }
    if (global) {
      rc.updateUser(update, RC_FILENAME)
    } else {
      rc.update(update, { name: RC_FILENAME, dir })
    }
  }
}

export function run () {
  try {
    _run()
  } catch (err) {
    consola.fatal(err)
    process.exit(1)
  }
}

if (!module.parent) {
  run()
}
