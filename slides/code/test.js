'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const app = require('../app')

test('Should expose a /status route', async t => {
  const fastify = Fastify()
  fastify.register(app)

  const response = await fastify.inject({
    method: 'GET',
    path: '/status'
  })

  t.strictEqual(response.statusCode, 200)
  t.deepEqual(
    JSON.parse(response.payload),
    { status: 'ok' }
  )

  await fastify.close()
})
