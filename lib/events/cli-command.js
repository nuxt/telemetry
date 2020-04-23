import { getProjectData } from '../utils/get-project-data'
import { getProjectId } from '../utils/get-project-id'
import { getProjectSession } from '../utils/get-project-session'
import { hash } from '../utils/hash'

export async function cliCommandEvent({ eventName, options }) {
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
    const projectData = await getProjectData({ options })
    const _id = await getProjectId({ projectData })
    const projectSession = await getProjectSession({ _id })

    return {
      name: eventName,
      payload: {
        projectSession: hash(projectSession),
        projectId: hash(_id), // TODO calculates multiple times
        name: cliCommand, // TODO EXPORT
        arguments: null, // TODO?
        duration: {
          boot: null, // TODO later
          total: null // TODO later
        }
      }
    }
  } catch (err) {
    // swallow
    return null
  }
}
