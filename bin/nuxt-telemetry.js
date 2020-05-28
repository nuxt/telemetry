#!/usr/bin/env node

const path = require('path')
const arg = require('arg')
const rc = require('rc9')
const consola = require('consola')
const { consentVersion } = require('../package.json')

const args = arg({
  '--disable': Boolean,
  '--enable': Boolean,
  '--global': Boolean,
  '-g': '--global'
})

const rootDir = path.resolve(process.cwd(), args._[0] || '.')
const global = args['--global']

if (args['--enable']) {
  setRC('telemetry.consent', consentVersion, global)
  consola.success('Nuxt telemetry enabled for', global ? 'user' : rootDir)
  consola.info('You can disable it `nuxt telemetry --disable`')
  return
}

if (args['--disable']) {
  setRC('telemetry.consent', false, global)
  consola.success('Nuxt telemetry disabled for', global ? 'user' : rootDir)
  consola.info('You can enable it back with `nuxt telemetry --enable`')
  return
}

consola.info('Usage:', process.argv0, '--enable|--disable [-g] [rootDir]')

function setRC (key, val, global) {
  const update = { [key]: val }
  if (global) {
    rc.updateUser(update, '.nuxtrc')
  } else {
    rc.update(update, { name: '.nuxtrc', dir: rootDir })
  }
}
