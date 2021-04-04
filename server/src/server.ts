import koa from 'koa' // koa@2
import { schema } from './schema'
import koaRouter from 'koa-router'
import { ApolloServer } from 'apollo-server-koa'
import { createContext } from './context'
import { streamFile } from './tools/old/streamFile'
import fs from 'fs'
import cors from '@koa/cors'
import websocket from 'websocket'
import http from 'http'

const server = new ApolloServer({ schema, context: createContext })
const router = new koaRouter()

/**
 * WEB SOCKET STUFF
 */
// const WEBSOCKET_PORT = 8008
// const httpServer = http.createServer()

// httpServer.listen(WEBSOCKET_PORT)

// const webSocketServer = websocket.server
// const wss = new webSocketServer({
//   httpServer,
// })

// const clients = {} as any

// wss.on('request', request => {
//   const connection = request.accept(null, request.origin)
//   clients['uniqId1'] = connection
// })

// wss.on('connect', (ws: any) => {
//   const music =
//     '/Users/sampo/Music/Collection/Prince of Denmark/The Body [32]/02 Nymphonic.mp3'
//   const readStream = fs.createReadStream(music)

//   readStream.on('data', (chunk: any) => {
//     chunk.type = 'audio/mp3'
//     ws.send(chunk)
//   })

//   readStream.on('end', () => {
//     ws.send('end')
//   })
// })

/**
 *
 */

const app = new koa()

app.use(cors())

const PORT = 8000

server.applyMiddleware({ app })
router.get('/stream', ctx => {
  const music =
    '/Users/sampo/Music/Collection/Prince of Denmark/The Body [32]/02 Nymphonic.mp3'

  const stat = fs.statSync(music)
  const range = ctx.headers.range
  let readStream: any

  if (range !== undefined) {
    const parts = range.replace(/bytes=/, '').split('-')

    const partialStart = parts[0]
    const partialEnd = parts[1]

    if (
      (isNaN(partialStart) && partialStart.length > 1) ||
      (isNaN(partialEnd) && partialEnd.length > 1)
    ) {
      return (ctx.status = 500)
    }

    const start = parseInt(partialStart, 10)
    const end = partialEnd ? parseInt(partialEnd, 10) : stat.size - 1
    const content_length = end - start + 1

    ctx.status = 200
    // ctx.header = {
    //   'Content-Type': 'audio/mpeg',
    //   'Content-Length': content_length,
    //   'Content-Range': 'bytes ' + start + '-' + end + '/' + stat.size,
    // }

    readStream = fs.createReadStream(music, { start: start, end: end })
  } else {
    ctx.set('Content-Type', 'audio/mpeg')
    ctx.set('Content-Length', `${stat.size}`)
    ctx.set('Cache-Control', 'no-cache')
    readStream = fs.createReadStream(music)
    ctx.body = readStream
  }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen({ port: PORT }, () =>
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`),
)
