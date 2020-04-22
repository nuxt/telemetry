export async function configEvent({ name, options }) {
  try {
    return {
      name,
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
