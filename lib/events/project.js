function wait() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject(new Error('some error in project event'))
      resolve()
    }, 10000)
  })
}

export async function projectEvent({ name, options }) {
  try {
    await wait()
    return {
      name,
      payload: {}
    }
  } catch (err) {
    // swallow
    return null
  }
}
