export interface Event {
  name: string
  payload: object
}

export interface TelemetryOptions {
  debug: boolean,
  endpoint: string,
  consent?: number | boolean
}

export interface NuxtOptions {
  rootDir: string
  _generate: boolean
  _build: boolean
  _export: boolean
  _serve: boolean
  _start: boolean
  mode: string
  extensions: String[]
  _cli: boolean
  ssr: boolean
  dev: boolean
  telemetry: {
    url: string
  }
  buildModules: []
  modules: []
}

export interface Nuxt {
  options: NuxtOptions
  hook: (name: string, func: Function) => void
}

export interface Context {
  nuxt?: Nuxt
  options?: NuxtOptions
  rootDir?: string
  git?: object
  sessionId?: string
  projectId?: string
  projectSession?: string
  nuxtVersion?: string
  isEdge?: boolean
  isStart?: boolean
  nodeVersion?: string
  os?: string
  environment?: string | null
  packageManager?: string,
  [key: string]: any
}

// interface EventContext {
//   nuxtVersion?: string
//   isEdge?: boolean
//   isStart?: boolean
//   nodeVersion?: string
//   os?: string
//   environment?: string
// }

interface GitData {
  url: string
  gitRemote: string
  source: string
  owner: string
  name: string
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
  client: ClientStats
  server: ServerStats
}

interface ClientStats {
  duration: number
  success: boolean
  size: number
  fullHash: string
}

interface ServerStats {
  duration: number
  success: boolean
  size: number
  fullHash: string
}
