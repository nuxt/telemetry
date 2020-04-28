export function ssgEvent({ eventName, options, nuxt }, data) {
  // console.log(data)

  return {
    name: eventName,
    payload: {
      isLegacy: !!options._generate,
      routesCount: data.routesCount,
      duration: {
        generate: data.stats.server.duration
      }
    }
  }
}
