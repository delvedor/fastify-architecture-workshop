'use strict'

const Hyperid = require('hyperid')

async function postService (fastify, opts) {
  const hyperid = Hyperid()

  fastify.route({
    method: 'POST',
    path: '/post',
    handler: onPost,
    schema: {
      body: {
        type: 'object',
        additionalProperties: false,
        required: ['text'],
        properties: {
          text: {
            type: 'string',
            minLength: 1,
            maxLength: 280
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            time: { type: 'string' }
          }
        }
      }
    }
  })

  async function onPost (req, reply) {
    const { name: user } = req.user
    const { text } = req.body
    const time = new Date().toISOString()

    const topics = text
      .split(' ')
      .filter(w => w.starsWith('#'))
      .map(w => w.slice(1).replace(/[.,\s]/g, ''))

    const id = hyperid({ urlSafe: true })

    await this.elastic.index({
      index: 'tweets',
      id,
      body: {
        id,
        text,
        user,
        time,
        topics
      }
    })

    return { id, time }
  }
}

module.exports = postService
