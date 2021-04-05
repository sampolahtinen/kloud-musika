import { mutationType, nonNull, stringArg } from "nexus"
import { generateSharingLink, generateTemporaryDirectLink } from '../connectors/dropbox'
import { Context } from "../context"

export const Mutation = mutationType({
  definition(t) {
    t.crud.createOneArtist()
    t.crud.createOneUser()
    t.crud.createOneTrack()
    t.crud.createOneTrackMetadata()
    t.field('generateDirectMediaLink', {
      type: 'TrackMetadata',
      args: {
        trackId: nonNull(stringArg()),
      },
      async resolve(_root, args, ctx: Context) {
          const track = await ctx.prisma.track.findUnique({ where: { id: args.trackId }})
          const trackMetadata = await ctx.prisma.trackMetadata.findUnique({ where: { id: track.metadataId }})
          // return ctx.prisma.trackMetadata.update({ 
          //   where: { id: track.metadataId},
          //   data: {
          //     direct_link: await generateSharingLink(trackMetadata.original_file_path)
          //   }
          // })
          trackMetadata.direct_link = await generateTemporaryDirectLink(trackMetadata.original_file_path)
          // trackMetadata.direct_link = await generateSharingLink(trackMetadata.original_file_path)
          return trackMetadata
      },
    })
  }
})