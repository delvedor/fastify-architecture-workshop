'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('Get the timeline', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/timeline',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    }
  })

  t.strictEqual(response.statusCode, 200)
  const payload = JSON.parse(response.payload)
  t.true(Array.isArray(payload))
  t.strictEqual(payload.length, 10)
  payload.forEach(tweet => {
    t.deepEqual(
      Object.keys(tweet),
      ['id', 'text', 'time', 'user', 'topics']
    )
  })
})

test('Get next 10 tweets', async t => {
  const app = await build(t)
  var response = await app.inject({
    method: 'GET',
    url: '/timeline',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    }
  })

  const tweets = JSON.parse(response.payload)

  response = await app.inject({
    method: 'GET',
    url: '/timeline?from=10',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    }
  })

  t.notDeepEqual(tweets, JSON.parse(response.payload))
})

test('Empty result', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/timeline?from=1000',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    }
  })

  t.strictEqual(response.statusCode, 200)
  const payload = JSON.parse(response.payload)
  t.true(Array.isArray(payload))
  t.strictEqual(payload.length, 0)
})

test('401', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/timeline'
  })

  t.strictEqual(response.statusCode, 401)
})

test('400 (bad type)', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/timeline?from=hello',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    }
  })

  t.strictEqual(response.statusCode, 400)
})

test('400 (too big)', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/timeline?from=9999999999',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    }
  })

  t.strictEqual(response.statusCode, 400)
})

test('400 (should be positive)', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/timeline?from=-1',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    }
  })

  t.strictEqual(response.statusCode, 400)
})
