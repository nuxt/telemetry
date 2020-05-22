import { Stats } from '../types'

export function getStats (stats: Stats) {
  const duration = stats.endTime - stats.startTime

  return {
    duration,
    success: stats.compilation.errors.length === 0,
    size: 0, // TODO: bundle size
    fullHash: stats.compilation.fullHash
  }
}
