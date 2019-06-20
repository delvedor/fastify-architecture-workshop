'use strict'

const path = require('path')
const AutoLoad = require('fastify-autoload')
const envSchema = require('env-schema')

const schema = {
  type: 'object',
  properties: {
    ELASTICSEARCH: {
      type: 'string',
      default: 'http://localhost:9200'
    }
  }
}

const config = envSchema({ schema })

module.exports = async function (fastify, opts) {
  fastify.register(
    require('fastify-elasticsearch'),
    { node: config.ELASTICSEARCH }
  )
  // Creates the 'tweets' index and adds some initial data.
  // It also exposes the generateTimelineQuery function.
  fastify.register(require('@delvedor/fastify-workshop-dataset'))

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in services
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })
}
