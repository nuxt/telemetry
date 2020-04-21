import path from 'path'
import fs from 'fs-extra'

const defaultPM = 'npm'

const FILE2PM = {
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'shrinkwrap.json': 'npm'
}

export async function detectPackageManager(rootDir) {
  for (const file in FILE2PM) {
    if (await fs.exists(path.resolve(rootDir, file))) {
      return FILE2PM[file]
    }
  }
  return defaultPM
}
