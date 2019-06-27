export { theme } from './config'
import { CodeSurferLayout, Code } from 'code-surfer'
import { Appear, Image } from 'mdx-deck'
import { Big, Center } from './config'

<Big>

# Take your monolith<br/>to *microservices* with Fastify

</Big>

---

# About Us

***Tomas Della Vedova***  
Senior Software Engineer - Elastic

***Matteo Collina***  
Technical Director - NearForm

---

<Image src="images/fastify-background.png">

<Center>

<img
  src="images/fastify-white-landscape.png"
  style={{
    width: '80%',
    height: 'auto'
  }}
/>

</Center>

</Image>

---

<CodeSurferLayout>

```js
'use strict'

const fastify = require('fastify')()

fastify.get('/', async (req, reply) => {
  return { hello: 'world' }
})

fastify.listen(3000, console.log)
```

</CodeSurferLayout>

---

<Big>

# Fastify *Plugins*
A brief overview

</Big>

---

<CodeSurferLayout>

```js
fastify.register(
  require('my-plugin'),
  { options }
)
```

</CodeSurferLayout>

---

<CodeSurferLayout>

```js
async function myPlugin (fastify, opts) {
  // register other plugins
  fastify.register(...)

  // add hooks
  fastify.addHook(...)

  // add decorator
  fastify.decorate(...)

  // add routes
  fastify.route(...)
}

module.exports = myPlugin
```

</CodeSurferLayout>

---

## Plugins: *Architecture*
<img
  src="images/dag.png"
  style={{ width: '60%' }}
/>

---

## Plugins: *Encapsulation*
<img
  src="images/dag-decorate.png"
  style={{ width: '60%' }}
/>

---

<CodeSurferLayout>

```js
async function myPlugin (fastify, options) {
  fastify.decorate('util', yourAwesomeUtility)
  // now you can use it with `fastify.util`
}
```

```js
async function myPlugin (fastify, options) {
  fastify.decorate('util', yourAwesomeUtility)
  // now you can use it with `fastify.util`
}

module.exports = myPlugin
```

```js
const fp = require('fastify-plugin')

async function myPlugin (fastify, options) {
  fastify.decorate('util', yourAwesomeUtility)
  // now you can use it with `fastify.util`
}

module.exports = fp(myPlugin)
```

</CodeSurferLayout>

---

## Plugins: *Encapsulation*
<img
  src="images/dag-fp-encapsulate.png"
  style={{ width: '60%' }}
/>

---

## Plugins: Real world
<img
  src="images/plugin-real-world.png"
  style={{ width: '60%' }}
/>

---

<CodeSurferLayout>

```js title="Encapsulation enables cool things"
const fastify = require('fastify')()

fastify.register(require('./api/v1'), {
  prefix: '/v1'
})
```

```js title="Multiple version of the API"
const fastify = require('fastify')()

fastify.register(require('./api/v1'), {
  prefix: '/v1'
})

fastify.register(require('./api/v2'), {
  prefix: '/v2'
})
```

```js title="Different log levels"
const fastify = require('fastify')()

fastify.register(require('./api/v1'), {
  prefix: '/v1',
  logLevel: 'error'
})

fastify.register(require('./api/v2'), {
  prefix: '/v2',
  logLevel: 'debug'
})
```

</CodeSurferLayout>

---

<Big>
<Center>

# *Everything*<br/>is a plugin

</Center>
</Big>

---

<Big>
<Center>

# Let's start*!*

</Center>
</Big>

---

# A little bit of configuration
Being *consistent* across microservices is a difficult task,  
to *help you* Fastify provides a powerful CLI.

```bash
npx fastify generate workshop
cd workshop
npm install
```

---

# Project structure
- *app.js*: your entry point;
- *services*: the folder where you will declare all your endpoints;
- *plugins*: the folder where you will store all your custom plugins;
- *test*: the folder where you will declare all your test.

---

# Scripts
- *`npm start`*: run your server;
- *`npm run dev`*: run your server with pretty logs  
(not suitable for production);
- *`npm test`*: run your test suite.

---

# Exercise*:*

Generate the project and create  
a simple status service that exposes a status route.
```
GET /status => { status: 'ok' }
```

---

<CodeSurferLayout>

<Code
  title="Testing"
  lang="js"
  focus="1:23"
  code={require("!!raw-loader!./code/test.js").default}
/>

<Code
  lang="js"
  focus="3:5"
  code={require("!!raw-loader!./code/test.js").default}
  subtitle="Required the dependencies"
/>

<Code
  lang="js"
  focus="7"
  code={require("!!raw-loader!./code/test.js").default}
  subtitle="Create a new test block"
/>

<Code
  lang="js"
  focus="8:9"
  code={require("!!raw-loader!./code/test.js").default}
  subtitle="Instance the framework and register the application"
/>

<Code
  lang="js"
  focus="11:14"
  code={require("!!raw-loader!./code/test.js").default}
  subtitle="Inject an http request"
/>

<Code
  lang="js"
  focus="16:20"
  code={require("!!raw-loader!./code/test.js").default}
  subtitle="Check the response!"
/>

<Code
  lang="js"
  focus="22"
  code={require("!!raw-loader!./code/test.js").default}
  subtitle="Shutdown the application"
/>

</CodeSurferLayout>

---

# Exercise*:*

Test your application.

---

# Let's add our *database*

```bash
npm i fastify-elasticsearch
npm i @delvedor/fastify-workshop-dataset
```

---

<CodeSurferLayout>

```js
module.exports = async function (fastify, opts) {
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })
}
```

```js
module.exports = async function (fastify, opts) {
  fastify.register(
    require('fastify-elasticsearch'),
    { node: 'http://localhost:9200' }
  )

  fastify.register(require('@delvedor/fastify-workshop-dataset'))

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'services'),
    options: Object.assign({}, opts)
  })
}
```

</CodeSurferLayout>

---

# Exercise*:*

Create an endpoint to index a new tweet,  
the endpoint should return the tweet id.  
**Bonus:** Add route validation.

You can use [Hyperid](http://npmjs.com/package/hyperid) for generating the IDs.
```
{
  id: String,
  text: String,
  user: String,
  time: DateString,
  topics: String[]
}
```

---

# Exercise*:*

Test your application.

---

# Exercise*:*

Create an endpoint to get a tweet by id.  
**Bonus:** Add route validation.

```
GET /tweet/:id => {
                    id: String,
                    text: String,
                    user: String,
                    time: DateString,
                    topics: String[]
                  }
```

---

# Exercise*:*

Test your application.

---

# Exercise*:*

Create an endpoint to get a tweet timeline, ordered by time.  
**Bonus:** Boost the results with a given topic.

```
GET /timeline => [{
                    id: String,
                    text: String,
                    user: String,
                    time: DateString,
                    topics: String[]
                 }]
```

---

# Exercise*:*

Test your application.

---

# Authentication

Protecting your application is important.
<img
  src="images/basic-auth-over-plain-http.jpg"
  style={{
    width: '50%',
    height: 'auto'
  }}
/>

---

# Exercise*:*

Create an authentication plugin that uses [fastify-basic-auth](https://github.com/fastify/fastify-basic-auth).

Create also two fake users to test your application.
```js
const users = {
  arya: 'stark', // Basic YXJ5YTpzdGFyaw==
  jon: 'snow' // Basic am9uOnNub3c=
}
```

---

<CodeSurferLayout>

<Code
  lang="js"
  focus="1:29"
  code={require("!!raw-loader!./code/basic-auth.js").default}
/>

<Code
  lang="js"
  focus="3:4"
  code={require("!!raw-loader!./code/basic-auth.js").default}
  subtitle="Require the dependencies"
/>

<Code
  lang="js"
  focus="6:9"
  code={require("!!raw-loader!./code/basic-auth.js").default}
  subtitle="Our 'database'"
/>

<Code
  lang="js"
  focus="12:13"
  code={require("!!raw-loader!./code/basic-auth.js").default}
  subtitle="Register the basicAuth plugin and decorate the request with a user object"
/>

<Code
  lang="js"
  focus="15:18"
  code={require("!!raw-loader!./code/basic-auth.js").default}
  subtitle="Validate the username and password"
/>

<Code
  lang="js"
  focus="20:26"
  code={require("!!raw-loader!./code/basic-auth.js").default}
  subtitle="If the user exist, let's add its topics"
/>

</CodeSurferLayout>

___

# Exercise*:*

Test your plugin.

---

# Exercise*:*

Add the authentication to your routes.

---

<CodeSurferLayout>

```js
fastify.route({
  method: 'GET',
  path: '/post/:id',
  handler: onGetPost
})
```

```js
fastify.route({
  method: 'GET',
  path: '/post/:id',
  onRequest: fastify.basicAuth,
  handler: onGetPost
})
```

</CodeSurferLayout>

---

# Exercise*:*

Update your test.

---

# Let's talk about *observability*

```
npm i elastic-apm-node
```

---

<CodeSurferLayout>

```json
{
  "dev": "fastify start -l info -P app.js",
}
```

```json
{
  "dev": "fastify start -l info -P app.js",
  "apm": "NODE_OPTIONS=\"-r elastic-apm-node/start\" fastify start -l info -P app.js"
}
```

</CodeSurferLayout>

---

# Exercise*:*

Open Kibana and run your application with APM.

---

<img src="images/kibana-apm.png" />

---

# From monolith<br/>to *microservices*

Let's begin*!*

---

# Exercise*:*
<ul>
  <Appear>
    <li><em>Duplicate</em> the project three times</li>
    <li>Keep only <em>one service</em> per project</li>
    <li><em>Run</em> the services!</li>
  </Appear>
</ul>

---

# Awesome!
Now update *all your clients* so they know  
which address to call based on the service they need to use.
<img
  src="images/clients.gif"
  style={{ width: '50%' }}
/>

---

<Big>
<Center>

# *WRONG!*

</Center>
</Big>

---

# The infrastructure<br/>should be *transparent*<br/>to the client.

---

# Exercise*:*

How can we fix this?

---

<Image src="images/fastify-background.png">

<Center>

<img
  src="images/fastify-white-landscape.png"
  style={{
    width: '80%',
    height: 'auto'
  }}
/>

</Center>

</Image>

---

<Center>
<Big>

# Thanks*!*

</Big>
</Center>