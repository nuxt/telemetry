export async function dependencyEvent({ name, options }) {
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
