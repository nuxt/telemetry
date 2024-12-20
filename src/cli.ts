import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'

import { resolve } from 'pathe'
import { destr } from 'destr'
import * as rc from 'rc9'
import { colors as c } from 'consola/utils'
import { consola } from 'consola'
import { createJiti } from 'jiti'
import { isTest } from 'std-env'
import { parse as parseDotenv } from 'dotenv'
import { createMain, defineCommand } from 'citty'

import { consentVersion } from './meta'
import { ensureUserconsent } from './consent'

const RC_FILENAME = '.nuxtrc'

const sharedArgs = {
  global: {
    type: 'boolean',
    alias: 'g',
    description: 'Apply globally',
  },
  dir: {
    type: 'positional',
    default: '.',
  },
} as const

const cli = createMain({
  meta: {
    name: 'nuxt-telemetry',
  },
  subCommands: {
    status: defineCommand({
      meta: {
        description: 'Show telemetry status',
      },
      args: sharedArgs,
      async run({ args }) {
        ensureNuxtProject(args)
        const dir = resolve(args.dir)
        await showStatus(dir, args.global)
      },
    }),
    enable: defineCommand({
      meta: {
        description: 'Enable telemetry',
      },
      args: sharedArgs,
      async run({ args }) {
        ensureNuxtProject(args)
        const dir = resolve(args.dir)
        setRC(dir, 'telemetry.enabled', true, args.global)
        setRC(dir, 'telemetry.consent', consentVersion, args.global)
        await showStatus(dir, args.global)
        consola.info('You can disable telemetry with `npx nuxt-telemetry disable' + (args.global ? ' --global' : (args.dir ? ' ' + args.dir : '')) + '`')
      },
    }),
    disable: defineCommand({
      meta: {
        description: 'Disable telemetry',
      },
      args: sharedArgs,
      async run({ args }) {
        ensureNuxtProject(args)
        const dir = resolve(args.dir)
        setRC(dir, 'telemetry.enabled', false, args.global)
        setRC(dir, 'telemetry.consent', 0, args.global)
        await showStatus(dir, args.global)
        consola.info('You can enable telemetry with `npx nuxt-telemetry enable' + (args.global ? ' --global' : (args.dir ? ' ' + args.dir : '')) + '`')
      },
    }),
    consent: defineCommand({
      meta: {
        description: 'Prompt for user consent',
      },
      args: sharedArgs,
      async run({ args }) {
        ensureNuxtProject(args)
        const dir = resolve(args.dir)
        const accepted = await ensureUserconsent({} as any)
        if (accepted && !args.global) {
          setRC(dir, 'telemetry.enabled', true, args.global)
          setRC(dir, 'telemetry.consent', consentVersion, args.global)
        }
        await showStatus(dir, args.global)
      },
    }),
  },
})

async function _checkDisabled(dir: string): Promise<string | false | undefined> {
  if (isTest) {
    return 'because you are running in a test environment'
  }

  if (destr(process.env.NUXT_TELEMETRY_DISABLED)) {
    return 'by the `NUXT_TELEMETRY_DISABLED` environment variable'
  }

  const dotenvFile = resolve(dir, '.env')
  if (existsSync(dotenvFile)) {
    const _env = parseDotenv(readFileSync(dotenvFile))
    if (destr(_env.NUXT_TELEMETRY_DISABLED)) {
      return 'by the `NUXT_TELEMETRY_DISABLED` environment variable set in ' + dotenvFile
    }
  }

  const disabledByConf = (conf: any) => conf.telemetry === false
    || (conf.telemetry && conf.telemetry.enabled === false)

  try {
    const configPath = resolveNuxtConfigPath(dir)
    if (configPath && disabledByConf(createJiti(dir).import(configPath, { default: true }))) {
      return 'by ' + configPath
    }
  }
  catch {
    // Ignore if we do not have `nuxt.config`
  }

  if (disabledByConf(rc.read({ name: RC_FILENAME, dir }))) {
    return 'by ' + resolve(dir, RC_FILENAME)
  }

  if (disabledByConf(rc.readUser({ name: RC_FILENAME }))) {
    return 'by ' + resolve(homedir(), RC_FILENAME)
  }
}

async function showStatus(dir: string, global: boolean) {
  const disabled = await _checkDisabled(dir)
  if (disabled) {
    consola.info(`Nuxt telemetry is ${c.yellow('disabled')} ${disabled}.`)
  }
  else {
    consola.info(`Nuxt telemetry is ${c.green('enabled')}`, global ? 'on your machine.' : 'in the current project.')
  }
}

function setRC(dir: string, key: any, val: any, global: boolean) {
  const update = { [key]: val }
  if (global) {
    rc.updateUser(update, RC_FILENAME)
  }
  else {
    rc.update(update, { name: RC_FILENAME, dir })
  }
}

function resolveNuxtConfigPath(dir: string) {
  const jiti = createJiti(dir)
  return jiti.esmResolve('./nuxt.config', { try: true }) || jiti.esmResolve('./.config/nuxt', { try: true })
}

function ensureNuxtProject(args: { global: boolean, dir: string }) {
  if (args.global) {
    return
  }
  const dir = resolve(args.dir)
  if (!resolveNuxtConfigPath(dir)) {
    consola.error('You are not in a Nuxt project.')
    consola.info('You can try specifying a directory or by using the `--global` flag to configure telemetry for your machine.')
    process.exit()
  }
}

cli()
