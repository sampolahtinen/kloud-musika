import { nexusPrisma } from 'nexus-plugin-prisma'
import { makeSchema } from 'nexus'
import * as path from 'path'
import { Artist, Track, TrackMetadata, User } from './graphql'
import { Query } from './graphql/query'
import { Mutation } from './graphql/mutation'


export const schema = makeSchema({
  types: [
    User, 
    Track, 
    Artist,
    TrackMetadata,
    Query,
    Mutation,
  ],
  plugins: [
    nexusPrisma({
      experimentalCRUD: true,
    }),
  ],
  outputs: {
    typegen: path.join(__dirname, '/generated/nexus.ts'),
    schema: path.join(__dirname, './schema.graphql'),
  },
})