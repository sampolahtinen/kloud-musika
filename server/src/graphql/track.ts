import { objectType } from 'nexus'

export const Track = objectType({
  name: 'Track',
  definition(t) {
    t.model.id()
    t.model.title()
    t.model.fileId()
    t.model.artist()
    t.model.metadata()
  },
})
