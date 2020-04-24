import { join } from 'path'
import { existsSync } from 'fs'

export function getDependencies(rootDir) {
  const deps = {
    dependencies: {},
    devDependencies: {}
  }

  const pkgPath = join(rootDir, 'package.json')

  if (!existsSync(pkgPath)) {
    return deps
  }

  const pkg = require(pkgPath)

  // Read each dependency package.json to get exact installed version
  for (const type of ['dependencies', 'devDependencies']) {
    for (const _name in pkg[type] || {}) {
      try {
        const { name, version } = require(join(_name, 'package.json'))
        deps[type][name] = version
      } catch (_e) {
        // Dependency is not installed
        deps[type][_name] = pkg[type][_name]
      }
    }
  }

  // console.log('Debug:', { deps })
  return deps
}
