'use strict'

const fastify = require('fastify')({ logger: true })
const proxy = require('fastify-http-proxy')

fastify.register(proxy, {
  upstream: 'http://localhost:3030',
  prefix: '/post'
})

fastify.register(proxy, {
  upstream: 'http://localhost:3031',
  prefix: '/me'
})

fastify.register(proxy, {
  upstream: 'http://localhost:3032',
  prefix: '/timeline'
})

fastify.listen(3000)
