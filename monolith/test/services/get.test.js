'use strict'

const { test } = require('tap')
const { build } = require('../helper')

test('Get a post by id', async t => {
  const app = await build(t)
  var response = await app.inject({
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
  const { id } = JSON.parse(response.payload)

  response = await app.inject({
    method: 'GET',
    url: `/post/${id}`,
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    }
  })

  const payload = JSON.parse(response.payload)
  t.type(payload.time, 'string')
  delete payload.time

  t.deepEqual(payload, {
    text: 'Hello #world',
    topics: ['world'],
    user: 'arya',
    id
  })
})

test('404', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/post/123',
    headers: {
      Authorization: 'Basic YXJ5YTpzdGFyaw=='
    }
  })

  t.strictEqual(response.statusCode, 404)
})

test('401', async t => {
  const app = await build(t)
  const response = await app.inject({
    method: 'GET',
    url: '/post/123'
  })

  t.strictEqual(response.statusCode, 401)
})
