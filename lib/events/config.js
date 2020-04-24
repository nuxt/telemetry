export function configEvent({ eventName }) {
  return {
    name: eventName,
    payload: {
      mode: null, // TODO
      build: {
        extend: null // TODO
      },
      axios: {
        baseURL: null // TODO
      }
    }
  }
}
