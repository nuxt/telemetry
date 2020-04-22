import ci from 'ci-info'

export async function buildEvent({ name, options, nuxt }) {
  // nuxt.hook('build:compiled', () => {
  //   console.log('COMPILEEEEEEED')
  // })
  try {
    return {
      name,
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
