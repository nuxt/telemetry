import ci from 'ci-info'

export async function buildEvent({ eventName, options, nuxt }) {
  try {
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
  } catch (err) {
    // swallow
    return null
  }
}
