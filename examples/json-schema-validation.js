'use strict'

const Fastify = require('fastify')
const mercurius = require('mercurius')
const mercuriusValidation = require('mercurius-validation')

const schema = `
  type Message {
    id: ID!
    text: String
  }

  input Filters {
    id: ID
    text: String
  }

  input NestedFilters {
    input: Filters
  }

  input ArrayFilters {
    values: [String]
    filters: [Filters]
  }

  type Query {
    message(id: ID): Message
    messages(filters: Filters): [Message]
  }
`

const messages = [
  {
    id: 0,
    text: 'Some system message.'
  },
  {
    id: 1,
    text: 'Hello there'
  },
  {
    id: 2,
    text: 'Give me a place to stand, a lever long enough and a fulcrum. And I can move the Earth.'
  },
  {
    id: 3,
    text: ''
  }
]

const resolvers = {
  Query: {
    message: async (_, { id }) => {
      return messages.find(message => message.id === Number(id))
    },
    messages: async () => {
      return messages
    }
  }
}

const app = Fastify()
app.register(mercurius, {
  schema,
  resolvers
})
app.register(mercuriusValidation, {
  schema: {
    Filters: {
      text: { type: 'string', minLength: 1 }
    },
    Query: {
      message: {
        id: { type: 'string', minLength: 1 }
      }
    }
  }
})

app.listen(3000)
