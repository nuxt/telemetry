export function configEvent({ eventName }) {
  return {
    name: eventName,
    payload: {
      mode: false, // TODO
      build: {
        extend: false // TODO
      },
      axios: {
        baseURL: false // TODO
      }
    }
  }
}
