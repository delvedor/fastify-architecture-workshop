'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('Should add a new post', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'POST',
    url: '/post',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    },
    payload: {
      text: 'Hello #world'
    }
  })

  t.strictEqual(response.statusCode, 201)
  const payload = JSON.parse(response.payload)
  t.type(payload.time, 'string')
  t.type(payload.id, 'string')

  const { body } = await app.elastic.get({
    index: 'tweets',
    id: payload.id
  })

  t.type(body._source.id, 'string')
  t.type(body._source.time, 'string')
  delete body._source.id
  delete body._source.time

  t.deepEqual(body._source, {
    text: 'Hello #world',
    topics: ['world'],
    user: 'arya'
  })
})

test('Unauthorized', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'POST',
    url: '/post',
    payload: {
      text: 'Hello #world'
    }
  })

  t.strictEqual(response.statusCode, 401)
})

test('Bad request', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'POST',
    url: '/post',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    },
    payload: {
      text: ''
    }
  })

  t.strictEqual(response.statusCode, 400)
})

test('Bad request (too long)', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'POST',
    url: '/post',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    },
    payload: {
      text: 'King of the north!'.repeat(300)
    }
  })

  t.strictEqual(response.statusCode, 400)
})
