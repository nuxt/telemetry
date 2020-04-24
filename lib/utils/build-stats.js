export function getStats(stats) {
  const duration = stats.endTime - stats.startTime

  // TODO: bundle size

  return {
    duration,
    size: 0,
    fullHash: stats.compilation.fullHash
  }
}
