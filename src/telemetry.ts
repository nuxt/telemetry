import type { Nuxt } from '@nuxt/schema'
import { postEvent } from './utils/post-event'
import * as events from './events/index'
import { createContext } from './context'
import { EventFactory, TelemetryOptions, Context, EventFactoryResult } from './types'
import log from './utils/log'

export class Telemetry {
  nuxt: Nuxt
  options: TelemetryOptions
  storage: any // TODO
  _contextPromise?: Promise<Context>
  events: Promise<EventFactoryResult<any>>[] = []

  constructor (nuxt: Nuxt, options: TelemetryOptions) {
    this.nuxt = nuxt
    this.options = options
  }

  getContext (): Promise<Context> {
    if (!this._contextPromise) {
      this._contextPromise = createContext(this.nuxt, this.options)
    }
    return this._contextPromise
  }

  createEvent (name: string, payload?: object): void | Promise<any> {
    // @ts-ignore
    const eventFactory: EventFactory<any> = (events as any)[name]
    if (typeof eventFactory !== 'function') {
      log.warn('Unknown event:', name)
      return
    }
    const eventPromise = this._invokeEvent(name, eventFactory, payload)
    this.events.push(eventPromise)
  }

  async _invokeEvent (name: string, eventFactory: EventFactory<any>, payload?: object): Promise<any> {
    try {
      const context = await this.getContext()
      const event = await eventFactory(context, payload)
      event.name = name
      return event
    } catch (err) {
      log.error('Error while running event:', err)
    }
  }

  async getPublicContext () {
    const context = await this.getContext()
    const eventContext = {}
    for (const key of [
      'nuxtVersion',
      'isEdge',
      'nodeVersion',
      'cli',
      'os',
      'environment',
      'projectHash',
      'projectSession'
    ]) {
      eventContext[key] = context[key]
    }
    return eventContext
  }

  async sendEvents (debug?: boolean) {
    const events: EventFactoryResult<any>[] = [].concat(...(await Promise.all(this.events)).filter(Boolean))
    this.events = []
    const context = await this.getPublicContext()

    const body = {
      timestamp: Date.now(),
      context,
      events
    }

    if (this.options.endpoint) {
      const start = Date.now()
      try {
        if (debug) {
          log.info('Sending events:', JSON.stringify(body, null, 2))
        }
        await postEvent(this.options.endpoint, body)
        if (debug) {
          log.success(`Events sent to \`${this.options.endpoint}\` (${Date.now() - start} ms)`)
        }
      } catch (err) {
        if (debug) {
          log.error(`Error sending sent to \`${this.options.endpoint}\` (${Date.now() - start} ms)\n`, err)
        }
      }
    }
  }
}
