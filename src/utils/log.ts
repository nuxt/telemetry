import { ConsolaInstance, consola } from 'consola'

export const logger = consola.withTag('@nuxt/telemetry') as ConsolaInstance
