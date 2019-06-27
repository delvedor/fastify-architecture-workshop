'use strict'

const fp = require('fastify-plugin')
const basicAuth = require('fastify-basic-auth')

const users = {
  arya: 'stark', // Basic YXJ5YTpzdGFyaw==
  jon: 'snow' // Basic am9uOnNub3c=
}

async function basicAuthPlugin (fastify, opts) {
  fastify.register(basicAuth, { validate })
  fastify.decorateRequest('user', null)

  async function validate (username, password, req, reply) {
    if (users[username] !== password) {
      throw new Error('Invalid username or password')
    }

    req.user = {
      name: username,
      topics: username === 'arya'
        ? ['sword', 'death', 'weapon']
        : ['sword', 'night', 'know']
    }
  }
}

module.exports = fp(basicAuthPlugin)
