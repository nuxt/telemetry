import { postEvent } from './post-event'
import { EventsStorage } from './events-storage'
import * as events from './events/index'
import { createContext, getEventContext } from './utils/context'
import { Nuxt, Context, TelemetryOptions } from './types'
import logger from './utils/logger'

type FulfilledEvent = {
  status: string
  value: object | []
}

export class Telemetry {
  nuxt: Nuxt
  options: TelemetryOptions
  storage: any // TODO
  _contextPromise?: Promise<Context>

  constructor (nuxt: Nuxt, options: TelemetryOptions) {
    this.nuxt = nuxt
    this.options = options
    this.storage = new EventsStorage()
  }

  getContext (): Promise<Context> {
    if (!this._contextPromise) {
      this._contextPromise = createContext(this.nuxt)
    }
    return this._contextPromise
  }

  processEvent (eventName: string, data?: object): void | Promise<any> {
    // @ts-ignore
    const event: Function = events[eventName]
    if (typeof event !== 'function') {
      return
    }
    this.storage.addEventToQueue(this._invokeEvent(eventName, event, data))
  }

  async _invokeEvent (
    eventName: string,
    event: Function,
    data?: object
  ): Promise<any> {
    try {
      const context = await this.getContext()
      return await event({ ...context, eventName }, data)
    } catch (err) {
      // console.error('Error while running event:', event, err)
    }
  }

  async recordEvents () {
    const fulfilledEvents = await this.storage
      .completedEvents()
      .then((events: []) =>
        events
          .filter((e: FulfilledEvent) => e.status === 'fulfilled')
          .map((e: FulfilledEvent) => e.value)
          .flat()
      )

    if (fulfilledEvents.length) {
      const context = await this.getContext()
      const body = {
        createdAt: new Date(),
        context: getEventContext(context),
        events: fulfilledEvents
      }
      if (this.options.endpoint) {
        const start = Date.now()
        try {
          if (this.options.debug) {
            logger.info('Sending events:', JSON.stringify(body, null, 2))
          }
          await postEvent(this.options.endpoint, body)
          if (this.options.debug) {
            logger.success(`Events sent to \`${this.options.endpoint}\` (${Date.now() - start} ms)`)
          }
        } catch (err) {
          if (this.options.debug) {
            logger.error(`Error sending sent to \`${this.options.endpoint}\` (${Date.now() - start} ms)\n`, err)
          }
        }
      }
    }
  }
}
