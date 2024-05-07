import { updateUser } from 'rc9'

export function updateUserNuxtRc(key: string, val: string | number | boolean) {
  updateUser({ [key]: val }, '.nuxtrc')
}
