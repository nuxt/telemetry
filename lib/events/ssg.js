export function ssgEvent({ eventName, options, nuxt }) {
  return new Promise((resolve) => {
    let routesCount = 0
    const timings = {}
    try {
      nuxt.hook('generate:extendRoutes', (routes) => {
        routes.map((r) => routesCount++)
      })
      nuxt.hook('build:compiled', ({ stats }) => {
        timings.startTime = stats.startTime
        timings.endTime = stats.endTime
      })
      nuxt.hook('generate:done', () => {
        resolve({
          name: eventName,
          payload: {
            legacy: !!options._generate,
            routesCount,
            duration: {
              generate: timings.endTime - timings.startTime
            }
          }
        })
      })
    } catch (err) {
      // swallow
      return null
    }
  })
}
