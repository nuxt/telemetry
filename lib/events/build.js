import ci from 'ci-info' // TODO

export function buildEvent({ eventName, options }, data) {
  // console.log('Build timings: ', data)

  return {
    name: eventName,
    payload: {
      isSuccess: false, // TODO
      isDev: options.dev || false,
      isCI: ci.isCI,
      duration: {}, // TODO in data
      size: 'false' // TODO
    }
  }
}
