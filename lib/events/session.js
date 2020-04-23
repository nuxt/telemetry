import { getProjectData } from '../utils/get-project-data'
import { getProjectId } from '../utils/get-project-id'
import { getProjectSession } from '../utils/get-project-session'
import { hash } from '../utils/hash'

export async function sessionEvent({ eventName, options }) {
  try {
    const projectData = await getProjectData({ options })
    const _id = await getProjectId({ projectData })
    const projectSession = await getProjectSession({ _id })

    return {
      name: eventName,
      payload: {
        projectSession: hash(projectSession)
      }
    }
  } catch (err) {
    // check env variable to debug error
    // console.log(err)
    return null
  }
}
