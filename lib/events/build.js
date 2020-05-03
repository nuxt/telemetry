import ci from 'ci-info' // TODO: Why need it

export function buildEvent({ eventName, options }, data) {
  const duration = { build: data.duration.build }
  const size = {}
  let isSuccess = true

  for (const [name, stat] of Object.entries(data.stats)) {
    if (!stat.success) {
      isSuccess = false
      duration[name] = stat.duration
      size[name] = stat.size
    }
  }

  return {
    name: eventName,
    payload: {
      isSuccess,
      isDev: options.dev || false,
      isCI: ci.isCI,
      duration,
      size // TODO, it's empty
    }
  }
}
