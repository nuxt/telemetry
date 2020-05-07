import { join } from 'path'
import { setup, get } from '@nuxtjs/module-test-utils'

import config from '../example/nuxt.config'

describe('module', () => {
  let nuxt

  beforeAll(async () => {
    config.rootDir = join(__dirname, '..', 'example')
    ;({ nuxt } = await setup(config))
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Works!')
  })
})
