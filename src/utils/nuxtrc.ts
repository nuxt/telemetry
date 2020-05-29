import { updateUser } from 'rc9'

export function updateUserNuxtRc (key, val) {
  updateUser({ [key]: val }, '.nuxtrc')
}
