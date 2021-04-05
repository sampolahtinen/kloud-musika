import { objectType, queryType, stringArg } from 'nexus'

export const Query = queryType({
  definition(t) {
    t.crud.users({ pagination: true, filtering: true });
    t.crud.tracks({ filtering: true });
    t.crud.artists({ filtering: true })
    t.crud.trackMetadata({ filtering: true })
  },
})
