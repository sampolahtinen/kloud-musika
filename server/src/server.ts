import koa from 'koa' // koa@2
import { schema } from './schema'
import koaRouter from 'koa-router'
import { ApolloServer } from 'apollo-server-koa'
import { createContext } from './context'
import cors from '@koa/cors'

const server = new ApolloServer({ 
  schema, 
  context: createContext,
  tracing: true
 })
const router = new koaRouter()

const app = new koa()

app.use(cors())

const PORT = 8000

server.applyMiddleware({ app })

app.use(router.routes()).use(router.allowedMethods())

app.listen({ port: PORT }, () =>
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`),
)
