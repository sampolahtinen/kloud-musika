import { mutationType } from "nexus"

export const Mutation = mutationType({
  definition(t) {
    t.crud.createOneArtist()
    t.crud.createOneUser()
    t.crud.createOneTrack()
    t.crud.createOneTrackMetadata()
  }
})