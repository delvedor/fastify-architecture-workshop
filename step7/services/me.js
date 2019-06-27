'use strict'

const S = require('fluent-schema')

async function statusService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/me',
    handler: onStatus,
    onRequest: fastify.basicAuth,
    schema: {
      response: {
        200: S.object()
          .prop('name', S.string())
          .prop('topics', S.array().items(S.string()))
      }
    }
  })

  async function onStatus (req, reply) {
    return req.user
  }
}

module.exports = statusService
