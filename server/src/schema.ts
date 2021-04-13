import { nexusPrisma } from 'nexus-plugin-prisma'
import { makeSchema } from 'nexus'
import * as path from 'path'
import {
  Artist,
  CloudSyncMetadata,
  Mutation,
  Query,
  Track,
  TrackMetadata,
  User,
} from './graphql'

export const schema = makeSchema({
  types: [
    User,
    Track,
    Artist,
    TrackMetadata,
    Query,
    Mutation,
    CloudSyncMetadata,
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
