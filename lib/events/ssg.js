export async function ssgEvent({ name, options }) {
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
