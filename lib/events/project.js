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
      isSsr: options.mode === 'universal' || options.ssr === true,
      target: options._generate ? 'static' : 'server',
      isTypescript:
        options.extensions.includes('ts') ||
        process.argv[1].includes('nuxt-ts'), // TODO check if working
      isProgrammatic: !options._cli,
      packageManager,
      projectSession
    }
  }
}
