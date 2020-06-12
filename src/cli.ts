import { resolve } from 'path'
import { existsSync } from 'fs'
import arg from 'arg'
import * as rc from 'rc9'
import consola from 'consola'
import { consentVersion } from './meta'

export const usage = 'nuxt telemetry enable|disable [-g,--global] [dir]'

function _run () {
  const args = arg({
    '--global': Boolean,
    '-g': '--global'
  })

  const [command, _dir] = args._
  const dir = resolve(process.cwd(), _dir || '.')
  const global = args['--global']

  if (!global && !existsSync(resolve(dir, 'nuxt.config.js')) &&
    !existsSync(resolve(dir, 'nuxt.config.ts'))) {
    consola.error(`It seems you are not in a nuxt project (no nuxt.config found at ${dir})`)
    showUsage()
  }

  switch (command) {
    case 'enable':
      setRC('telemetry.consent', consentVersion)
      consola.success('Nuxt telemetry enabled for', global ? 'user' : dir)
      consola.info('You can disable telemetry with `nuxt telemetry disable ' + (global ? '-g' : _dir))
      return
    case 'disable':
      setRC('telemetry.consent', false)
      consola.success('Nuxt telemetry disabled for', global ? 'user' : dir)
      consola.info('You can enable telemetry with `nuxt telemetry enable ' + (global ? '-g' : _dir) + '`')
      return
    default:
      showUsage()
  }

  function showUsage () {
    consola.info(`Usage: ${usage}\n`)
    process.exit(1)
  }

  function setRC (key, val) {
    const update = { [key]: val }
    if (global) {
      rc.updateUser(update, '.nuxtrc')
    } else {
      rc.update(update, { name: '.nuxtrc', dir })
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
