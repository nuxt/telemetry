import type { Nuxt } from '@nuxt/schema'
import { Telemetry } from './telemetry'

export interface TelemetryOptions {
  debug: boolean
  endpoint: string
  seed: string
  consent?: number
  enabled: boolean
}

export interface Context {
  nuxt: Nuxt
  cli: string
  seed: string
  projectHash: string
  projectSession: string
  nuxtVersion: string
  nuxtMajorVersion: 2 | 3
  isEdge: boolean
  nodeVersion: string
  os: string
  git?: { url: string }
  environment: string | null
  packageManager: string,
  concent: number
}

export interface Event {
  name: string
  [key: string]: any
}

export type EventFactoryResult<T> = Promise<T> | T | Promise<T>[] | T[]
export type EventFactory<T extends Event> = (context: Context, payload: any) => EventFactoryResult<T>

export interface Stats {
  endTime: number
  startTime: number
  compilation: {
    errors: Error[]
    fullHash: string
  }
}

export interface GitData {
  url: string
  gitRemote: string
  source: string
  owner: string
  name: string
}

declare module '@nuxt/schema' {
  interface NuxtHooks {
    'telemetry:setup': (telemetry: Telemetry) => void
  }
}
