import { detectPackageManager } from '../utils/detect-package-manager'

export async function projectEvent({
  eventName,
  options,
  git,
  projectSession
}) {
  const packageManager = await detectPackageManager(options.rootDir)

  return {
    name: eventName,
    payload: {
      type: git.repoUrl ? 'GIT' : 'LOCAL',
      ssr: options.mode === 'universal' || options.ssr === true,
      target: options._generate ? 'static' : 'server',
      typescript:
        options.extensions.includes('ts') ||
        process.argv[1].includes('nuxt-ts'), // TODO check if working
      isProgrammatic: !options._cli,
      packageManager,
      projectSession
    }
  }
}
