'use strict'

async function timelineService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/timeline',
    handler: onGetTimeline,
    schema: {
      querystring: {
        type: 'object',
        additionalProperties: false,
        properties: {
          from: { type: 'integer' }
        }
      },
      response: {
        200: {
          type: 'array',
          items: {
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
    }
  })

  async function onGetTimeline (req, reply) {
    const { topics } = req.user
    const query = {
      query: {
        bool: {
          must: [{ match_all: {} }],
          should: topics.map(t => ({ term: { topics: t } }))
        }
      },
      size: 10,
      from: req.query.from || 0,
      sort: [
        { time: { order: 'desc' } }
      ]
    }

    const { body, statusCode } = await this.elastic.search({
      index: 'tweets',
      body: query
    }, {
      ignore: [404]
    })

    if (statusCode === 404) {
      reply.code(404)
      return new Error('Not Found')
    }

    return body.hits.hits.map(h => h._source)
  }
}

module.exports = timelineService
