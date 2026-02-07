import type { Nuxt } from '@nuxt/schema'
import type { Telemetry } from './telemetry'

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
  nuxtMajorVersion: number
  isEdge: boolean
  nodeVersion: string
  os: string
  git?: { url: string }
  environment: string | null
  packageManager: string
  concent: number
}

export interface Event {
  name: string
  [key: string]: any
}

export type EventFactoryResult<T> = Promise<T> | T | Promise<T>[] | T[]
export type EventFactory<T extends Event> = (context: Context, payload: any) => EventFactoryResult<T>

export interface GitData {
  url: string
  gitRemote: string
  source: string
  owner: string
  name: string
}
