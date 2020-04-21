import { createHash } from 'crypto'

export function hash(str) {
  return createHash('sha256').update(str).digest('hex')
}
