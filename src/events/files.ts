import { resolve } from 'pathe'
import { pathExists } from 'fs-extra'
import { resolvePath } from '@nuxt/kit'
import { EventFactory } from '../types'

export interface FilesEvent {
  name: 'files',
  nuxtIgnore: boolean,
  nuxtRc: boolean,
  appConfig: boolean,
}

export const files = <EventFactory<FilesEvent>> async function (context) {
  const { options } = context.nuxt

  const nuxtIgnore = await pathExists(resolve(options.rootDir, '.nuxtignore'))
  const nuxtRc = await pathExists(resolve(options.rootDir, '.nuxtrc'))
  const appConfig = await pathExists(await resolvePath('~/app.config'))

  return {
    name: 'files',
    nuxtIgnore,
    nuxtRc,
    appConfig
  }
}
