'use strict'

const S = require('fluent-schema')

async function timelineService (fastify, opts) {
  fastify.route({
    method: 'GET',
    path: '/timeline',
    onRequest: fastify.basicAuth,
    handler: onGetTimeline,
    schema: {
      // https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-from-size.html
      querystring: S.object()
        .prop('from', S.integer().minimum(0).maximum(10000))
        .additionalProperties(false)
        .valueOf(),
      response: {
        200: S.array()
          .items(S.object()
            .prop('id', S.string())
            .prop('text', S.string())
            .prop('time', S.string())
            .prop('user', S.string())
            .prop('topics', S.array().items(S.string()))
          ).valueOf()
      }
    }
  })

  async function onGetTimeline (req, reply) {
    // TODO: add this query in dataset.js
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
