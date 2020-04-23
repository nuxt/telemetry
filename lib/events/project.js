import { getProjectData } from '../utils/get-project-data'
import { getProjectId } from '../utils/get-project-id'
import { hash } from '../utils/hash'
import { detectPackageManager } from '../utils/detect-package-manager'

export async function projectEvent({ eventName, options }) {
  try {
    const projectData = await getProjectData({ options })
    const _id = await getProjectId({ projectData })

    return {
      name: eventName,
      payload: {
        type: projectData.remote ? 'GIT' : 'LOCAL',
        ssr: options.mode === 'universal' || options.ssr === true,
        target: options._generate ? 'static' : 'server',
        typescript:
          options.extensions.includes('ts') ||
          process.argv[1].endsWith('nuxt-ts'), // TODO check if working
        isProgrammatic: !options._cli,
        packageManager: await detectPackageManager(options.rootDir),
        _id: hash(_id) // TODO calculates multiple times
      }
    }
  } catch (err) {
    // swallow
    return null
  }
}
