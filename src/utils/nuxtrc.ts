import { updateUser } from 'rc9'

export const RC_FILENAME = '.nuxtrc'

export function updateUserNuxtRc(key: string, val: string | number | boolean) {
  updateUser({ [key]: val }, RC_FILENAME)
}
