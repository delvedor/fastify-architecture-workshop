'use strict'

const { test } = require('tap')
const Fastify = require('fastify')
const basicAuthPlugin = require('../../plugins/basic-auth')

test('Should add the basic auth utility', async t => {
  const fastify = Fastify()
  fastify.register(basicAuthPlugin)

  await fastify.ready()

  t.ok(fastify.basicAuth)
  t.end()
})

test('Should authenticate the request', async t => {
  const fastify = Fastify()
  fastify.register(basicAuthPlugin)
    .after(() => {
      fastify.route({
        method: 'GET',
        path: '/',
        onRequest: fastify.basicAuth,
        handler: async () => 'ok'
      })
    })

  // missing token
  var response = await fastify.inject({
    method: 'GET',
    url: '/'
  })

  t.strictEqual(response.statusCode, 401)

  // bad token
  response = await fastify.inject({
    method: 'GET',
    url: '/',
    headers: {
      Authorization: 'Basic YXJ5YTpzdrfyaw=='
    }
  })

  t.strictEqual(response.statusCode, 401)

  // valid token
  response = await fastify.inject({
    method: 'GET',
    url: '/',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    }
  })

  t.strictEqual(response.statusCode, 200)

  t.end()
})

test('Should add a user object to the request', t => {
  t.test('Arya user', async t => {
    t.plan(2)

    const fastify = Fastify()
    fastify.register(basicAuthPlugin)
      .after(() => {
        fastify.route({
          method: 'GET',
          path: '/',
          onRequest: fastify.basicAuth,
          handler: async req => {
            t.deepEqual(
              req.user,
              { name: 'arya', topics: ['sword', 'death', 'weapon'] }
            )
            return 'ok'
          }
        })
      })

    const response = await fastify.inject({
      method: 'GET',
      url: '/',
      headers: {
        Authorization: 'Basic YXJ5YTpzdGFyaw=='
      }
    })

    t.strictEqual(response.statusCode, 200)
  })

  t.test('Jon user', async t => {
    t.plan(2)

    const fastify = Fastify()
    fastify.register(basicAuthPlugin)
      .after(() => {
        fastify.route({
          method: 'GET',
          path: '/',
          onRequest: fastify.basicAuth,
          handler: async req => {
            t.deepEqual(
              req.user,
              { name: 'jon', topics: ['sword', 'night', 'know'] }
            )
            return 'ok'
          }
        })
      })

    const response = await fastify.inject({
      method: 'GET',
      url: '/',
      headers: {
        Authorization: 'Basic am9uOnNub3c='
      }
    })

    t.strictEqual(response.statusCode, 200)
  })

  t.end()
})
