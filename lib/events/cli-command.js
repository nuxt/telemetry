export function cliCommandEvent({
  eventName,
  options,
  projectSession,
  projectId
}) {
  let cliCommand = 'START'

  if (options.dev) {
    cliCommand = 'DEV'
  } else if (options._generate) {
    cliCommand = 'GENERATE'
  } else if (options._build) {
    cliCommand = 'BUILD'
  }

  return {
    name: eventName,
    payload: {
      projectSession,
      projectId,
      name: cliCommand, // TODO EXPORT
      arguments: 'null', // TODO?
      duration: {
        boot: false, // TODO later
        total: false // TODO later
      }
    }
  }
}
