export async function cliCommandEvent({ name, options }) {
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
