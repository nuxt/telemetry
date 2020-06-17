import { NuxtOptions } from '@nuxt/types'

export interface TelemetryOptions {
  debug: boolean
  endpoint: string
  seed: string
  consent?: number
  enabled: boolean
}

export type EventFactoryResult<T> = Promise<T> | T | Promise<T>[] | T[]
export type EventFactory<T extends Event> = (context: Context, payload: any) => EventFactoryResult<T>

export interface Event {
  name: string
  [key: string]: any
}

export interface Nuxt {
  options: NuxtOptions
  hook: (name: string, func: Function) => void
}

export interface Context {
  nuxt: Nuxt
  cli: string
  seed: string
  projectHash: string
  projectSession: string
  nuxtVersion: string
  isEdge: boolean
  nodeVersion: string
  os: string
  git?: { url: string}
  environment: string | null
  packageManager: string
}

export interface Stats {
  endTime: number
  startTime: number
  compilation: {
    errors: Error[]
    fullHash: string
  }
}

// Should be merged or renamed
interface Stats {
  [name: string]: {
    duration: number
    success: boolean
    size: number
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
