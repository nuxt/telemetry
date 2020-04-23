export async function configEvent({ eventName, options }) {
  try {
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
  } catch (err) {
    // swallow
    return null
  }
}
