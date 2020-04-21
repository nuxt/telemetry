export async function configEvent({ name, options }) {
  try {
    return {
      name,
      payload: {}
    }
  } catch (err) {
    // swallow
    return null
  }
}
