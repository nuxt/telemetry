import fs from 'node:fs'
import { resolve } from 'pathe'

const FILE2PM = {
  'yarn.lock': 'yarn',
  'package-lock.json': 'npm',
  'shrinkwrap.json': 'npm',
  'pnpm-lock.yaml': 'pnpm',
}

export async function detectPackageManager(rootDir: string): Promise<string> {
  for (const file in FILE2PM) {
    if (fs.existsSync(resolve(rootDir, file))) {
      return FILE2PM[file as keyof typeof FILE2PM]
    }
  }
  return 'unknown'
}
