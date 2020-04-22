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

  processEvent(name) {
    this.storage.addEventToQueue(
      eventsMap[name]({ name, options: this.options, nuxt: this.nuxt })
    )
  }

  async recordEvents() {
    // console.log(this.storage.eventsQueue)

    const fulfilledEvents = await this.storage
      .completedEvents()
      .then((events) =>
        events.filter((e) => e.status === 'fulfilled').map((e) => e.value)
      )

    console.log(fulfilledEvents.length)

    await postEvent(
      {
        body: {
          createdAt: new Date(),
          context: await setContext({ options: this.options, nuxt: this.nuxt }),
          events: fulfilledEvents
        }
      },
      { options: this.options }
    )
    // console.log('fulfilledEvents', fulfilledEvents)
  }
}
