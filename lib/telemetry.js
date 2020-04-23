import { isTrue } from './utils/is-true'
import { postEvent } from './post-event'
import { EventsStorage } from './events-storage'
import {
  projectEvent,
  sessionEvent,
  cliCommandEvent,
  dependencyEvent,
  configEvent,
  buildEvent,
  ssgEvent
} from './events'
import { setContext } from './set-context'
const { NUXT_TELEMETRY_DISABLED } = process.env

const eventsMap = {
  NUXT_PROJECT: projectEvent,
  NUXT_SESSION: sessionEvent,
  NUXT_CLI_COMMAND: cliCommandEvent,
  NUXT_DEPENDENCY: dependencyEvent,
  NUXT_CONFIG: configEvent,
  NUXT_BUILD: buildEvent,
  NUXT_SSG: ssgEvent
}

export class Telemetry {
  events
  options
  nuxt
  storage = new EventsStorage()

  constructor({ options, nuxt }) {
    this.options = options
    this.nuxt = nuxt
  }

  get isDisabled() {
    return isTrue(NUXT_TELEMETRY_DISABLED)
  }

  processEvent(eventName) {
    this.storage.addEventToQueue(
      eventsMap[eventName]({
        eventName,
        options: this.options,
        nuxt: this.nuxt
      })
    )
  }

  async recordEvents() {
    const fulfilledEvents = await this.storage
      .completedEvents()
      .then((events) =>
        events
          .filter((e) => e.status === 'fulfilled')
          .map((e) => e.value)
          .flat()
      )

    if (fulfilledEvents.length) {
      await postEvent(
        {
          body: {
            createdAt: new Date(),
            context: await setContext({
              options: this.options,
              nuxt: this.nuxt
            }),
            events: fulfilledEvents
          }
        },
        { options: this.options }
      )
    }
  }
}
