import path from 'path'
import fs from 'fs-extra'

const defaultPM = 'npm'

const FILE2PM: {
  'yarn.lock': string
  'package-lock.json': string
  'shrinkwrap.json': string
} = {
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'shrinkwrap.json': 'npm'
}

export async function detectPackageManager (rootDir: string): Promise<string> {
  for (const file in FILE2PM) {
    if (await fs.pathExists(path.resolve(rootDir, file))) {
      // @ts-ignore
      return FILE2PM[file]
    }
  }
  return defaultPM
}
