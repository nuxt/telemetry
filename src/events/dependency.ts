import { join } from 'path'
import { existsSync } from 'fs'
import createRequire from 'create-require'
import { EventFactory } from '../types'

export interface DependencyEvent {
  name: 'dependency'
  packageName: string
  version: string
  isDevDependency: boolean
  isModule: boolean
  isBuildModule: boolean
}

interface Dependency {
  name: string
  version: string
  dev: boolean
}

export const dependency = <EventFactory<DependencyEvent>> function ({ nuxt: { options } }) {
  const events: DependencyEvent[] = []
  const projectDeps = getDependencies(options.rootDir)

  // Get used modules and buildModules
  const modules = normalizeModules(options.modules)
  const buildModules = normalizeModules(options.buildModules)

  // Only send event for relevant dependencies
  const relatedDeps = [...modules, ...buildModules]

  for (const dep of projectDeps) {
    if (!relatedDeps.includes(dep.name)) {
      continue
    }
    events.push({
      name: 'dependency',
      packageName: dep.name,
      version: dep.version,
      isDevDependency: dep.dev,
      isModule: modules.includes(dep.name),
      isBuildModule: buildModules.includes(dep.name)
    })
  }

  return events
}

function normalizeModules (modules) {
  return modules.map((m) => {
    if (typeof m === 'string') { return m }
    if (Array.isArray(m) && typeof m[0] === 'string') { return m[0] }
    return null
  }).filter(Boolean)
}

export function getDependencies (rootDir: string) {
  const pkgPath = join(rootDir, 'package.json')

  if (!existsSync(pkgPath)) {
    return []
  }

  const _require = createRequire(rootDir)
  const pkg = _require(pkgPath)

  const mapDeps = (depsObj, dev = false) => {
    const _deps: Dependency[] = []
    for (const name in depsObj) {
      try {
        const pkg = _require(join(name, 'package.json'))
        _deps.push({ name, version: pkg.version, dev })
      } catch (_e) {
        // Dependency is not installed
        _deps.push({ name, version: depsObj[name], dev })
      }
    }
    return _deps
  }

  const deps: Dependency[] = []

  if (pkg.dependencies) {
    deps.push(...mapDeps(pkg.dependencies))
  }

  if (pkg.devDependencies) {
    deps.push(...mapDeps(pkg.dependencies, true))
  }

  return deps
}
