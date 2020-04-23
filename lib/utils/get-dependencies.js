import { join } from 'path'

export function getDependencies({ options } = {}) {
  try {
    const {
      dependencies: dependenciesRaw,
      devDependencies: devDependenciesRaw
    } = require(join(
      options && options.rootDir ? options.rootDir : process.cwd(),
      'package.json'
    ))
    const dependencies = {}
    const devDependencies = {}

    // read each dependency package.json to get exact version
    for (const d of Object.keys(devDependenciesRaw)) {
      const { name, version } = require(join(
        options && options.rootDir ? options.rootDir : process.cwd(),
        'node_modules',
        d,
        'package.json'
      ))
      devDependencies[name] = version
    }
    for (const d of Object.keys(dependenciesRaw)) {
      const { name, version } = require(join(
        options && options.rootDir ? options.rootDir : process.cwd(),
        'node_modules',
        d,
        'package.json'
      ))
      dependencies[name] = version
    }
    return { dependencies, devDependencies }
  } catch (err) {
    return null
  }
}
