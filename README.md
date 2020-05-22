# Nuxt Telemetry Module

> ℹ️ Only used for Nuxt 2.13+

Nuxt.js collects anonymous telemetry data about general usage. This helps us to accurately gauge Nuxt feature usage and customization across all our users.

This anonymous program is optional, and you may [opt-out](#opting-out) if you'd not like to share any information.

## Why collecting Telemetry?

Nuxt.js has grown a lot from it's [initial release](https://github.com/nuxt/nuxt.js/releases/tag/v0.2.0) (7 Nov 2016) and we are keep listening to [community feedback](https://github.com/nuxt/nuxt.js/issues) to improve it.

However, this manual process only collects feedback from a subset of users that takes the time to fill the issue template and it may have different needs or use-case than you.

Nuxt Telemetry collects anonymous telemetry data about general usage. This helps us to accurately gauge feature usage and customization across all our users. This data will let us better understand how Nuxt.js is used globally, measuring improvements made (DX and performances) and their relevance.

## Events

We collect multiple events:
- Command invoked (`nuxt dev`, `nuxt build`, etc)
- Versions of Nuxt.js and Node.js
- General machine informations (MacOS/Linux/Windows and if command is run within CI)
- Duration of the Webpack build and average size of the application, as well as the generation (when using `nuxt generate`)
- What are the *public dependency* of your project (Nuxt modules)

You can see the list of events in [lib/events](./lib/events).

Example of an event:

```json
{
   "name": "NUXT_PROJECT",
   "payload": {
    "type": "GIT",
    "isSsr": true,
    "target": "server",
    "isTypescriptBuild": false,
    "isTypescriptRuntime": false,
    "isProgrammatic": false,
    "packageManager": "npm"
   }
}
```

To display the events that will be sent, you can use `NUXT_TELEMETRY_DEBUG=1`, when set, no data will be sent but only printed out.

## Sensitive data

We take your privacy and our security very seriously.

We do not collect any metrics which may contain sensitive data.
This includes, but is not limited to: environment variables, file paths, contents of files, logs, or serialized JavaScript errors.

The data we collect is completely anonymous, not traceable to the source, and only meaningful in aggregate form. No data we collect is personally identifiable.

## Opting-out

### Locally

You can disable Nuxt Telemetry for your project with two ways:

1. Using an environement variable

```bash
NUXT_TELEMETRY_DISABLED=1
```

2. Setting `telemetry: false` in your `nuxt.config.js`:

```js
export default {
  telemetry: false
}
```

## Thank you

We want to thank you for participating in this telemetry program to help us better understand how you use Nuxt.js to keep improving it 💚

## License

[MIT License](./LICENSE)

Copyright (c) NuxtJS Team
