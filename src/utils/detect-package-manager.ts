import { resolve } from 'pathe'
import { pathExists } from 'fs-extra'

const FILE2PM = {
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'shrinkwrap.json': 'npm',
  'pnpm-lock.yaml': 'pnpm'
}

export async function detectPackageManager (rootDir: string): Promise<string> {
  for (const file in FILE2PM) {
    if (await pathExists(resolve(rootDir, file))) {
      // @ts-ignore
      return FILE2PM[file]
    }
  }
  return 'unknown'
}
