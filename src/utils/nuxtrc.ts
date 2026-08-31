import { updateUserConfig } from 'rc9'
import { homedir } from 'node:os'
import { resolve } from 'node:path'
import { mkdirSync } from 'node:fs'

export function updateUserNuxtRc(key: string, val: string | number | boolean) {
  // Uses the same resolving logic as rc9
  const rc9Base = process.env.XDG_CONFIG_HOME || resolve(homedir(), '.config')
  // Make sure the directory exists before rc9 attempt to write there
  mkdirSync(rc9Base, { recursive: true })
  updateUserConfig({ [key]: val }, '.nuxtrc')
}
