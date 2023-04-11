import { useLogger } from '@nuxt/kit'
import { ConsolaInstance } from 'consola'

export const logger = useLogger('@nuxt/telemetry') as ConsolaInstance
