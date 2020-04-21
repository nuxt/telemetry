import { resolve } from 'path'

export const rootDir = resolve(__dirname, '..')
export const buildDir = resolve(__dirname, '.nuxt')
export const srcDir = __dirname
export const modules = [{ handler: require('../') }]
