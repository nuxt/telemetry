import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Nuxt } from '@nuxt/schema'
import type { TelemetryOptions } from '../src/types'

vi.mock('../src/utils/nuxtrc', () => ({ updateUserNuxtRc: vi.fn() }))

async function setupModule(telemetry: unknown) {
  const { default: telemetryModule } = await import('../src/module')
  const hook = vi.fn()
  const nuxt = {
    options: telemetry === undefined ? {} : { telemetry },
    hooks: { addHooks: vi.fn() },
    hook,
  } as unknown as Nuxt
  await telemetryModule({} as TelemetryOptions, nuxt)
  return hook.mock.calls.some(([name]) => name === 'nitro:init')
}

describe('telemetry opt-in in a non-interactive environment', () => {
  beforeEach(() => {
    vi.stubEnv('DO_NOT_TRACK', '')
    vi.stubEnv('NUXT_TELEMETRY_DISABLED', '')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it.each([
    ['true', true],
    ['{ enabled: true }', { enabled: true }],
    ['{ enabled: true, consent: 1 }', { enabled: true, consent: 1 }],
    ['{ consent: 1 }', { consent: 1 }],
    ['{ debug: true, enabled: true }', { debug: true, enabled: true }],
    ['{ debug: true, consent: 1 }', { debug: true, consent: 1 }],
  ])('should enable telemetry for telemetry: %s', async (_, telemetry) => {
    expect(await setupModule(telemetry)).toBe(true)
  })

  it.each([
    ['false', false],
    ['undefined', undefined],
    ['{}', {}],
    ['{ enabled: false }', { enabled: false }],
    ['{ enabled: false, consent: 1 }', { enabled: false, consent: 1 }],
    ['{ enabled: true, consent: 0 }', { enabled: true, consent: 0 }],
    ['{ consent: 0 }', { consent: 0 }],
    ['{ debug: true }', { debug: true }],
    ['{ debug: true, enabled: false, consent: 1 }', { debug: true, enabled: false, consent: 1 }],
  ])('should disable telemetry for telemetry: %s', async (_, telemetry) => {
    expect(await setupModule(telemetry)).toBe(false)
  })

  it.each([
    ['DO_NOT_TRACK'],
    ['NUXT_TELEMETRY_DISABLED'],
  ])('should be disabled by %s', async (env) => {
    vi.stubEnv(env, '1')
    expect(await setupModule(true)).toBe(false)
    expect(await setupModule({ enabled: true })).toBe(false)
    expect(await setupModule({ enabled: true, consent: 1 })).toBe(false)
  })

  it('should require consent again after consentVersion is bumped', async () => {
    vi.doMock('../src/meta', async importOriginal => ({ ...await importOriginal<object>(), consentVersion: 2 }))
    expect(await setupModule({ enabled: true, consent: 1 })).toBe(false)
    expect(await setupModule({ enabled: true, consent: 2 })).toBe(true)
    expect(await setupModule(true)).toBe(true)
  })
})
