'use strict'

async function getService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/post/:id',
    onRequest: fastify.basicAuth,
    handler: onGetPost,
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            text: { type: 'string' },
            time: { type: 'string' },
            user: { type: 'string' },
            topics: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      }
    }
  })

  async function onGetPost (req, reply) {
    const { body, statusCode } = await this.elastic.get({
      index: 'tweets',
      id: req.params.id
    }, {
      ignore: [404]
    })

    if (statusCode === 404) {
      reply.code(404)
      return new Error('Not Found')
    }

    return body._source
  }
}

module.exports = getService
