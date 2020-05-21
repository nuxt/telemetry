export function normalizeModules(modules: Array<Object>): Array<Object> {
  return modules.flat().filter((m) => typeof m === 'string')
}
