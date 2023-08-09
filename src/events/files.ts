import path from 'path'
import fs from 'fs-extra'
import { EventFactory } from '../types'

export interface FilesEvent {
  name: 'files',
  nuxtIgnore: boolean,
  appConfig: boolean
}

export const files = <EventFactory<FilesEvent>> async function (context) {
  const { options } = context.nuxt

  const nuxtIgnore = await fs.pathExists(path.join(options.rootDir, '.nuxtignore'))
  const appConfig = await fs.pathExists(path.join(options.rootDir, 'app.config.ts'))

  const result = {
    name: 'files',
    nuxtIgnore,
    appConfig
  }

  return result
}
