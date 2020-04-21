export function normalizeModules(modules) {
  return modules.flat().filter((m) => typeof m === 'string')
}
