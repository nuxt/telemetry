#!/usr/bin/env node
process._startTime = Date.now()
import('../dist/cli.mjs').then(r => (r.default || r).main().catch((error) => {
  console.error(error)
  process.exit(1)
}))
