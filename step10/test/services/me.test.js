'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('200 response', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/me',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    }
  })

  t.strictEqual(response.statusCode, 200)
  t.deepEqual(JSON.parse(response.payload), {
    name: "arya",
    topics: [
      "sword",
      "death",
      "weapon"
    ]
  })
})
