export function projectEvent({
  eventName,
  options,
  git,
  packageManager,
  projectSession
}) {
  return {
    name: eventName,
    payload: {
      type: git.url ? 'GIT' : 'LOCAL',
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
