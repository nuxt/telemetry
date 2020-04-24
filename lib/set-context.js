import os from 'os'
import isDocker from 'is-docker'
import ci from 'ci-info'

export function setContext({ options, nuxt } = {}) {
  const context = {
    nuxtVersion: nuxt.constructor.version,
    nuxtEdge: null, // TODO
    nuxtStart: null, // TODO
    // // vs
    // nuxt: { version: '2.12.0', edge: true, start: true },
    nodeVersion: process.version,
    os: os.type(),
    environment: process.env.CODESANDBOX_SSE
      ? 'CSB'
      : isDocker()
      ? 'Docker'
      : ci.isCI
      ? ci.name
      : 'terminal'
  }
  return context
}
