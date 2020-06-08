import { createHash } from 'crypto'

export function hash (str: string): string {
  return createHash('sha256').update(str).digest('hex').substr(0, 16)
}
