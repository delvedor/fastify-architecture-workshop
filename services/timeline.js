'use strict'

async function timelineService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/timeline',
    onRequest: fastify.basicAuth,
    handler: onGetTimeline,
    schema: {
      querystring: {
        type: 'object',
        additionalProperties: false,
        properties: {
          // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-from-size.html
          from: {
            type: 'integer',
            minimum: 0,
            maximum: 10000
          }
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
    const filterTopics = req.user.topics.map(t => {
      return {
        filter: {
          term: { topics: t }
        },
        weight: 5
      }
    })

    const query = {
      query: {
        function_score: {
          query: {
            match_all: {}
          },
          functions: [
            {
              gauss: {
                time: {
                  origin: 'now',
                  scale: '4h',
                  offset: '2h',
                  decay: 0.5
                }
              }
            },
            ...filterTopics
          ],
          boost_mode: 'multiply'
        }
      },
      size: 10,
      from: req.query.from || 0
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
