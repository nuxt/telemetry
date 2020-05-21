import { postEvent } from './post-event'
import { EventsStorage } from './events-storage'
import {
  projectEvent,
  sessionEvent,
  cliCommandEvent,
  dependencyEvent,
  buildEvent,
  ssgEvent
} from './events'
import { createContext, getEventContext } from './utils/context'
import { Nuxt, NuxtOptions, Context } from './types'

const eventsMap = {
  NUXT_PROJECT: projectEvent,
  NUXT_SESSION: sessionEvent,
  NUXT_CLI_COMMAND: cliCommandEvent,
  NUXT_DEPENDENCY: dependencyEvent,
  NUXT_BUILD: buildEvent,
  NUXT_SSG: ssgEvent
}

type FulfilledEvent = {
  status: string
  value: object | []
}

// type TelemetryEvent = { eventName: string; payload: object }

export class Telemetry {
  // private _contextPromise: object
  nuxt: Nuxt
  options: NuxtOptions
  storage: any // TODO
  _contextPromise: Promise<Context>

  constructor(nuxt: Nuxt) {
    this.nuxt = nuxt
    this.options = nuxt.options
    this.storage = new EventsStorage()
  }

  getContext(): Promise<Context> {
    if (!this._contextPromise) {
      this._contextPromise = createContext(this.nuxt)
    }
    return this._contextPromise
  }

  processEvent(eventName: string, data?: object): void | Promise<any> {
    const event: Function = eventsMap[eventName]
    if (typeof event !== 'function') {
      // console.warn('Event not found:' + eventName)
      return
    }
    this.storage.addEventToQueue(this._invokeEvent(eventName, event, data))
  }

  async _invokeEvent(
    eventName: string,
    event: Function,
    data: object
  ): Promise<any> {
    try {
      const context = await this.getContext()
      return await event({ ...context, eventName }, data)
    } catch (err) {
      // console.error('Error while running event:', event, err)
    }
  }

  async recordEvents() {
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

      await postEvent(
        {
          body: {
            createdAt: new Date(),
            context: getEventContext(context),
            events: fulfilledEvents
          }
        },
        { options: this.options }
      )
    }
  }
}
