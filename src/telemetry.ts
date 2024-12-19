import type { Nuxt } from '@nuxt/schema'

import { postEvent } from './utils/post-event'
import { createContext } from './context'
import type { EventFactory, TelemetryOptions, Context, EventFactoryResult } from './types'
import { logger } from './utils/log'

import { build } from './events/build'
import { command } from './events/command'
import { generate } from './events/generate'
import { module } from './events/module'
import { project } from './events/project'
import { session } from './events/session'
import { files } from './events/files'

export class Telemetry {
  nuxt: Nuxt
  options: Required<TelemetryOptions>
  storage: any // TODO
  _contextPromise?: Promise<Context>
  events: Promise<EventFactoryResult<any>>[] = []
  eventFactories: Record<string, EventFactory<any>> = {
    build,
    command,
    generate,
    module,
    project,
    session,
    files,
  }

  constructor(nuxt: Nuxt, options: Required<TelemetryOptions>) {
    this.nuxt = nuxt
    this.options = options
  }

  getContext(): Promise<Context> {
    if (!this._contextPromise) {
      this._contextPromise = createContext(this.nuxt, this.options)
    }
    return this._contextPromise
  }

  createEvent(name: string, payload?: object): undefined | Promise<any> {
    const eventFactory = this.eventFactories[name]
    if (typeof eventFactory !== 'function') {
      logger.warn('Unknown event:', name)
      return
    }
    const eventPromise = this._invokeEvent(name, eventFactory, payload)
    this.events.push(eventPromise)
  }

  async _invokeEvent(name: string, eventFactory: EventFactory<any>, payload?: object): Promise<any> {
    try {
      const context = await this.getContext()
      const event = await eventFactory(context, payload)
      event.name = name
      return event
    }
    catch (err) {
      logger.error('Error while running event:', err)
    }
  }

  async getPublicContext() {
    const context = await this.getContext()
    const eventContext: Record<string, any> = {}
    for (const key of [
      'nuxtVersion',
      'nuxtMajorVersion',
      'isEdge',
      'nodeVersion',
      'cli',
      'os',
      'environment',
      'projectHash',
      'projectSession',
    ] as const) {
      eventContext[key] = context[key]
    }
    return eventContext
  }

  async sendEvents(debug?: boolean) {
    const events: EventFactoryResult<any>[] = [].concat(...(await Promise.all(this.events)).filter(Boolean))
    this.events = []
    const context = await this.getPublicContext()

    const body = {
      timestamp: Date.now(),
      context,
      events,
    }

    if (this.options.endpoint) {
      const start = Date.now()
      try {
        if (debug) {
          logger.info('Sending events:', JSON.stringify(body, null, 2))
        }
        await postEvent(this.options.endpoint, body)
        if (debug) {
          logger.success(`Events sent to \`${this.options.endpoint}\` (${Date.now() - start} ms)`)
        }
      }
      catch (err) {
        if (debug) {
          logger.error(`Error sending sent to \`${this.options.endpoint}\` (${Date.now() - start} ms)\n`, err)
        }
      }
    }
  }
}
