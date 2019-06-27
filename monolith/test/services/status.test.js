'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('200 response', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/status'
  })

  t.strictEqual(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), { status: 'ok' })
})
