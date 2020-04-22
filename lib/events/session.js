function wait() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject(new Error('some error in session event'))
      resolve()
    }, 4000)
  })
}

export async function sessionEvent({ name, options }) {
  try {
    await wait()

    return {
      name,
      payload: {
        projectSession: null // TODO
      }
    }
  } catch (err) {
    // check env variable to debug error
    // console.log(err)
    return null
  }
}
