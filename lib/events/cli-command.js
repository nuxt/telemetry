export function cliCommandEvent({
  eventName,
  options,
  projectSession,
  projectId
}) {
  let cliCommand = 'UNKNOWN' // It is probably an external nuxt command

  if (options.dev) {
    cliCommand = 'DEV'
  } else if (options._generate) {
    cliCommand = 'GENERATE'
  } else if (options._build) {
    cliCommand = 'BUILD'
  } else if (options._export) {
    cliCommand = 'EXPORT'
  } else if (options._serve) {
    cliCommand = 'SERVE'
  } else if (options._start) {
    cliCommand = 'START'
  }

  return {
    name: eventName,
    payload: {
      projectSession,
      projectId,
      name: cliCommand
      // arguments: 'null', // TODO: Discuss
      // TODO: Needs adding a flags to nuxt-cli
      // duration: {
      //   boot: false,
      //   total: false
      // }
    }
  }
}
