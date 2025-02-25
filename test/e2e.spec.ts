import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

import { getRandomPort } from 'get-port-please'
import { createApp, readBody, toNodeListener, defineEventHandler } from 'h3'
import { afterAll, describe, expect, it } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import { isCI } from 'std-env'

const logs: Array<{ url?: string, body: any }> = []

const app = createApp().use(defineEventHandler(async (event) => {
  const body = await readBody(event)
  expect(body.context.nodeVersion).toEqual(process.versions.node)
  delete body.context.nodeVersion
  expect(body.context.nuxtVersion).toBeDefined()
  delete body.context.nuxtVersion
  expect(body.context.os).toEqual(os.type().toLocaleLowerCase())
  delete body.context.os
  expect(body.context.projectHash).toBeDefined()
  expect(body.context.projectSession).toBeDefined()
  delete body.context.projectHash
  delete body.context.projectSession
  expect(body.context.environment).toEqual(isCI ? 'github_actions' : 'unknown')
  delete body.context.environment
  expect(body.timestamp).toBeGreaterThan(0)
  delete body.timestamp
  for (const event of body.events) {
    if (event.id) {
      event.id = 'eventid'
    }
  }
  logs.push({ url: event.node.req.url, body })
  return null
}))

const server = createServer(toNodeListener(app))
const port = await getRandomPort()
server.listen(port)

await setup({
  rootDir: fileURLToPath(new URL('../playground', import.meta.url)),
  server: true,
  nuxtConfig: {
    telemetry: {
      enabled: true,
      debug: true,
      consent: 1,
      endpoint: `http://localhost:${port}/`,
    },
  },
})
describe('@nuxt/telemetry', () => {
  it('should build project', async () => {
    await $fetch('/')
    for (const log of logs) {
      const devtoolLog = log.body.events.find((event: any) => event.moduleName === '@nuxt/devtools')
      expect(devtoolLog.timing).toBeDefined()
      expect(devtoolLog.version).toBeDefined()
      delete devtoolLog.timing
      delete devtoolLog.version
    }
    expect(logs).toMatchInlineSnapshot(`
      [
        {
          "body": {
            "context": {
              "cli": "programmatic",
              "isEdge": false,
              "nuxtMajorVersion": 3,
            },
            "events": [
              {
                "isSSR": true,
                "name": "project",
                "packageManager": "pnpm",
                "target": "server",
                "type": "git",
              },
              {
                "command": "unknown",
                "name": "command",
              },
              {
                "moduleName": "@nuxt/devtools",
                "name": "module",
              },
            ],
          },
          "url": "/",
        },
      ]
    `)
  })
  afterAll(() => {
    server.close()
  })
})
