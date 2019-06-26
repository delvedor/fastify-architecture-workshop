'use strict'

const S = require('fluent-schema')

async function statusService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/status',
    handler: onStatus,
    schema: {
      response: {
        200: S.object().prop('status', S.string())
      }
    }
  })

  async function onStatus (req, reply) {
    return { status: 'ok' }
  }
}

module.exports = statusService
