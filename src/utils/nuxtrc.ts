import { updateUserConfig } from 'rc9'

export function updateUserNuxtRc(key: string, val: string | number | boolean) {
  updateUserConfig({ [key]: val }, '.nuxtrc')
}
