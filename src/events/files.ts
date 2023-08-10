import { resolve } from 'pathe'
import fs from 'fs-extra'
import { EventFactory } from '../types'

export interface FilesEvent {
  name: 'files',
  nuxtIgnore: boolean,
  nuxtRc: boolean,
  appConfig: boolean,
}

export const files = <EventFactory<FilesEvent>> async function (context) {
  const { options } = context.nuxt

  const nuxtIgnore = await fs.pathExists(resolve(options.rootDir, '.nuxtignore'))
  const nuxtRc = await fs.pathExists(resolve(options.rootDir, '.nuxtrc'))
  const appConfig = await fs.pathExists(resolve(options.rootDir, 'app.config.ts'))

  return {
    name: 'files',
    nuxtIgnore,
    nuxtRc,
    appConfig
  }
}
