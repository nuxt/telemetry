export async function cliCommandEvent({ name, options }) {
  let cliCommand
  if (options.dev) {
    cliCommand = 'DEV'
  } else if (options._generate) {
    cliCommand = 'GENERATE'
  } else if (options._build) {
    cliCommand = 'BUILD'
  } else {
    cliCommand = 'START'
  }

  try {
    return {
      name,
      payload: {
        projectSession: null, // TODO
        projectId: null, // TODO
        name: cliCommand, // TODO EXPORT
        arguments: null, // TODO
        duration: {
          boot: null, // TODO
          total: null // TODO
        }
      }
    }
  } catch (err) {
    // swallow
    return null
  }
}
