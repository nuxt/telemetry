import fs from 'fs'
import { resolve } from 'pathe'

const FILE2PM = {
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'shrinkwrap.json': 'npm',
  'pnpm-lock.yaml': 'pnpm'
}

// eslint-disable-next-line require-await
export async function detectPackageManager (rootDir: string): Promise<string> {
  for (const file in FILE2PM) {
    if (fs.existsSync(resolve(rootDir, file))) {
      // @ts-ignore
      return FILE2PM[file]
    }
  }
  return 'unknown'
}
