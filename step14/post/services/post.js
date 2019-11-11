'use strict'

const S = require('fluent-schema')
const Hyperid = require('hyperid')

async function postService (fastify, opts) {
  const hyperid = Hyperid({ urlSafe: true })

  fastify.route({
    method: 'POST',
    path: '/',
    onRequest: fastify.basicAuth,
    handler: onPost,
    schema: {
      body: S.object()
        .prop('text', S.string()
          .minLength(1)
          .maxLength(280)
          .required()
        ),
      response: {
        200: S.object()
          .prop('id', S.string())
          .prop('time', S.string())
      }
    }
  })

  async function onPost (req, reply) {
    const { name: user } = req.user
    const { text } = req.body
    const time = new Date().toISOString()

    const topics = await loadTopics(text)

    const id = hyperid()

    await this.elastic.index({
      index: 'tweets',
      refresh: 'wait_for',
      id,
      body: {
        id,
        text,
        user,
        time,
        topics
      }
    })

    reply.code(201)
    return { id, time }
  }
}

// Function that can potentially put
// under heavy load our process
async function loadTopics (text) {
  return text
    .split(' ')
    .filter(w => w.startsWith('#'))
    .map(w => w.slice(1).replace(/[.,\s]/g, ''))
}

module.exports = postService
