import fs from 'node:fs'
import { resolve } from 'pathe'
import { resolvePath } from '@nuxt/kit'
import type { EventFactory } from '../types'

export interface FilesEvent {
  name: 'files'
  nuxtIgnore: boolean
  nuxtRc: boolean
  appConfig: boolean
}

export const files = <EventFactory<FilesEvent>> async function (context) {
  const { options } = context.nuxt

  const nuxtIgnore = fs.existsSync(resolve(options.rootDir, '.nuxtignore'))
  const nuxtRc = fs.existsSync(resolve(options.rootDir, '.nuxtrc'))
  const appConfig = fs.existsSync(await resolvePath('~/app.config'))

  return {
    name: 'files',
    nuxtIgnore,
    nuxtRc,
    appConfig,
  }
}
