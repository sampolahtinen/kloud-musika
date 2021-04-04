import { objectType } from 'nexus'

export const TrackMetadata = objectType({
  name: 'TrackMetadata',
  definition(t) {
    t.model.id()
    t.model.track()
    t.model.original_file_path()
    t.model.direct_link()
    t.model.track()
  },
})
