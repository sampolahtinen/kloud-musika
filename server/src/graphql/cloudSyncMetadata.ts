import { objectType } from 'nexus'

export const CloudSyncMetadata = objectType({
  name: 'CloudSyncMetadata',
  definition(t) {
    t.model.id()
    t.model.lastImportedCursor
    t.model.latestCursor
    t.model.createdAt
    t.model.importFileCount
    t.model.status
  },
})
