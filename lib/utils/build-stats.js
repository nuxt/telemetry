export function getStats(stats) {
  const duration = stats.endTime - stats.startTime

  return {
    duration,
    size: 0, // TODO: bundle size
    fullHash: stats.compilation.fullHash
  }
}
