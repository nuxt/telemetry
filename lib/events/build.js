export async function buildEvent({ name, options }) {
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
