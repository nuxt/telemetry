import ci from 'ci-info' // TODO

export function buildEvent({ eventName, options }, data) {
  console.log('Build timings: ', data)

  return {
    name: eventName,
    payload: {
      success: null, // TODO
      dev: options.dev || false,
      ci: ci.isCI,
      duration: {}, // TODO
      size: null // TODO
    }
  }
}
