import { useLogger } from '@nuxt/kit'
import type { ConsolaInstance } from 'consola'

export const logger = useLogger('@nuxt/telemetry') as ConsolaInstance
