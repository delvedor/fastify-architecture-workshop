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
        .additionalProperties(false),
      response: {
        200: S.array()
          .items(S.object()
            .prop('id', S.string())
            .prop('text', S.string())
            .prop('time', S.string())
            .prop('user', S.string())
            .prop('topics', S.array().items(S.string()))
          )
      }
    }
  })

  async function onGetTimeline (req, reply) {
    const query = this.generateTimelineQuery(req.user.topics, req.query.from)
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
