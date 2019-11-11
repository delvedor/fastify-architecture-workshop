'use strict'

const S = require('fluent-schema')

async function meService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/',
    handler: onMe,
    onRequest: fastify.basicAuth,
    schema: {
      response: {
        200: S.object()
          .prop('name', S.string())
          .prop('topics', S.array().items(S.string()))
      }
    }
  })

  async function onMe (req, reply) {
    return req.user
  }
}

module.exports = meService
