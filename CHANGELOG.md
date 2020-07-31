# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.3](https://github.com/nuxt/telemetry/compare/v1.2.2...v1.2.3) (2020-07-31)


### Bug Fixes

* **deps:** downgrade `fs-extra` to 8.x (fixes [#26](https://github.com/nuxt/telemetry/issues/26)) ([b28d1cb](https://github.com/nuxt/telemetry/commit/b28d1cb01ecf4d17c4c61d8f68309a451c0ed2cd)), closes [nuxt/nuxt.js#7745](https://github.com/nuxt/nuxt.js/issues/7745)

### [1.2.2](https://github.com/nuxt/telemetry/compare/v1.2.1...v1.2.2) (2020-07-10)


### Bug Fixes

* disable consent for docker (fixes [#7695](https://github.com/nuxt/telemetry/issues/7695)) ([56fbc22](https://github.com/nuxt/telemetry/commit/56fbc220f820b1c04b799433d7949e1fc317e24b))

### [1.2.1](https://github.com/nuxt/telemetry/compare/v1.2.0...v1.2.1) (2020-06-28)

## [1.2.0](https://github.com/nuxt/telemetry/compare/v1.1.1...v1.2.0) (2020-06-26)


### Features

* **module:** support `telemetry: true` ([4010c07](https://github.com/nuxt/telemetry/commit/4010c072c38fbc4ac7804d98673b1de963b94be7))

### [1.1.1](https://github.com/nuxt/telemetry/compare/v1.1.0...v1.1.1) (2020-06-26)


### Bug Fixes

* **module:** handle entry errors ([f8051d0](https://github.com/nuxt/telemetry/commit/f8051d047c0bd5f2128cce19b3a967e10e82005a))

## [1.1.0](https://github.com/nuxt/telemetry/compare/v1.0.1...v1.1.0) (2020-06-19)


### Features

* **cli:** support dotenv and nuxt.config ([7cebe56](https://github.com/nuxt/telemetry/commit/7cebe56b7cf749953e5427fe6e0a49d3990aadb0))


### Bug Fixes

* **cli:** set consent for enable/disable ([9b03c4f](https://github.com/nuxt/telemetry/commit/9b03c4ff885cca538e308cb4ac0fb9c9f6d9066c))
* **consent:** use stdEnv for ci detection ([7a4d2f6](https://github.com/nuxt/telemetry/commit/7a4d2f6c7a403e048a7b7cd0eb9df69202afed56))

### [1.0.1](https://github.com/nuxt/telemetry/compare/v1.0.0...v1.0.1) (2020-06-18)

## [1.0.0](https://github.com/nuxt/telemetry/compare/v0.0.14...v1.0.0) (2020-06-18)

### [0.0.14](https://github.com/nuxt/telemetry/compare/v0.0.13...v0.0.14) (2020-06-17)


### Bug Fixes

* **cli:** set default _dir to . ([142bc74](https://github.com/nuxt/telemetry/commit/142bc74fb480816b61fbf0c3d9ae015138333671))

### [0.0.13](https://github.com/nuxt/telemetry/compare/v0.0.11...v0.0.13) (2020-06-17)

### [0.0.12](https://github.com/nuxt/telemetry/compare/v0.0.11...v0.0.12) (2020-06-17)

### [0.0.11](https://github.com/nuxt/telemetry/compare/v0.0.10...v0.0.11) (2020-06-16)

### [0.0.10](https://github.com/nuxt/telemetry/compare/v0.0.9...v0.0.10) (2020-06-16)

### [0.0.9](https://github.com/nuxt/telemetry/compare/v0.0.8...v0.0.9) (2020-06-12)


### Bug Fixes

* fix codesandbox sse env ([e5d2406](https://github.com/nuxt/telemetry/commit/e5d2406493c3684853eea40a9061818b2899de9b))

### [0.0.8](https://github.com/nuxt/telemetry/compare/v0.0.7...v0.0.8) (2020-06-12)


### Bug Fixes

* hide telemetry logs when debug is off ([6587377](https://github.com/nuxt/telemetry/commit/65873770a6177de7a2a62457206e6498bc0bb1e4))

### [0.0.7](https://github.com/nuxt/telemetry/compare/v0.0.6...v0.0.7) (2020-06-11)


### Bug Fixes

* **utils:** avoid error on deps[type] ([#7](https://github.com/nuxt/telemetry/issues/7)) ([ff2c9be](https://github.com/nuxt/telemetry/commit/ff2c9beca3c4b87ae509c99ba6db268c48c0a133))

### [0.0.6](https://github.com/nuxt/telemetry/compare/v0.0.5...v0.0.6) (2020-06-08)


### Bug Fixes

* git can be empty ([47b3df0](https://github.com/nuxt/telemetry/commit/47b3df02703b4c9ff2a5608b2bee9b298273493c))

### [0.0.5](https://github.com/nuxt/telemetry/compare/v0.0.4...v0.0.5) (2020-06-08)


### Features

* user consent prompt and random seed instead of machine-id ([#4](https://github.com/nuxt/telemetry/issues/4)) ([4910922](https://github.com/nuxt/telemetry/commit/4910922c8ddac38ad50eb4b1b033f0d7725c3645))

### [0.0.4](https://github.com/nuxt/telemetry/compare/v0.0.3...v0.0.4) (2020-05-22)

### [0.0.3](https://github.com/nuxt/telemetry/compare/v0.0.2...v0.0.3) (2020-05-22)


### Features

* support NUXT_TELEMETRY_DEBUG and NUXT_TELEMETRY_ENDPOINT ([f57526f](https://github.com/nuxt/telemetry/commit/f57526ff3b1126fb815fbd256b4dde3249d618b7))

### [0.0.2](https://github.com/nuxt/telemetry/compare/v0.0.1...v0.0.2) (2020-05-22)


### Bug Fixes

* build after versioning ([8aedc95](https://github.com/nuxt/telemetry/commit/8aedc956e5e76fc438db07190cd1f193e565cda1))

### 0.0.1 (2020-05-22)


### Features

* better debugging and options handling ([1e21367](https://github.com/nuxt/telemetry/commit/1e213672753c49d0230f3e9bb9f109ad46c88f4a))
* improvements ([c4889e6](https://github.com/nuxt/telemetry/commit/c4889e6b8c5617121ac31237dcf1e8b9f33d99f5))
* prepare for validation ([a9799d3](https://github.com/nuxt/telemetry/commit/a9799d3c073ed1aaf77541a98e899223e11efa4b))


### Bug Fixes

* disable telemetry with config or env var ([cf64c4e](https://github.com/nuxt/telemetry/commit/cf64c4ec6779841f8b4e55c877f64be659654815))
* don't relay on classProperties for Node 10 ([7a957dc](https://github.com/nuxt/telemetry/commit/7a957dcc380f2bc8d0d38f92d7cda87f36d104c2))
* options.telemetry ([1592144](https://github.com/nuxt/telemetry/commit/159214424c84f0457144292abb136ab7363e7d20))
* updates from Pooya pair coding ([880ff9a](https://github.com/nuxt/telemetry/commit/880ff9a5c6e7d33fd284d98c76855668c1a0c8c2))
