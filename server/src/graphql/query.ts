import { objectType, stringArg } from 'nexus'

export const Query = objectType({
  name: 'Query',
  definition(t) {
    t.crud.post()

    t.list.field('artists', {
      type: 'Artist',
      resolve: (_, args, ctx) => {
        return ctx.prisma.artist.findMany()
      },
    })

    t.list.field('tracks', {
      type: 'Track',
      resolve: (_, args, ctx) => {
        return ctx.prisma.track.findMany()
      },
    })

    t.list.field('TrackMetadata', {
      type: 'TrackMetadata',
      resolve: (_, args, ctx) => {
        return ctx.prisma.trackMetadata.findMany()
      },
    })

    t.list.field('feed', {
      type: 'Post',
      resolve: (_, args, ctx) => {
        return ctx.prisma.post.findMany({
          where: { published: true },
        })
      },
    })

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (_, { searchString }, ctx) => {
        return ctx.prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: searchString } },
              { content: { contains: searchString } },
            ],
          },
        })
      },
    })
  },
})
