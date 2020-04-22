import { machineId } from 'node-machine-id'
import { getProjectData } from '../utils/get-project-data'
import { hash } from '../utils/hash'
import { detectPackageManager } from '../utils/detect-package-manager'

// function wait() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       reject(new Error('some error in project event'))
//       // resolve()
//     }, 10000)
//   })
// }

export async function projectEvent({ name, options }) {
  try {
    // await wait()
    const projectData = await getProjectData({ options })
    const _id = projectData.remote
      ? `${projectData.source}-${projectData.owner}-${projectData.name}`
      : `${projectData.path}-${await machineId()}`
    return {
      name,
      payload: {
        type: projectData.remote ? 'GIT' : 'LOCAL',
        ssr: options.mode === 'universal' || options.ssr === true,
        target: options._generate ? 'static' : 'server',
        typescript:
          options.extensions.includes('ts') ||
          process.argv[1].endsWith('nuxt-ts'), // CHECK IF WORKING
        isProgrammatic: !options._cli,
        packageManager: await detectPackageManager(options.rootDir),
        _id: hash(_id)
      }
    }
  } catch (err) {
    // swallow
    return null
  }
}
