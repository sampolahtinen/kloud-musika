import chalk from 'chalk'
import Dropbox from 'dropbox'
import {
  getFolderFilesContinue,
  getFolderFiles,
  getLatestFolderCursor,
} from './dropbox'
import { importTracks } from '../tools/importTracks'
import { isAudioFile, wait } from '../utils/utils'
import { prisma } from '../context'
import { isEmpty } from 'ramda'
import { isDropboxFile } from './utils'

const MUSIC_COLLECTION_PATH = '/music_collection'

enum IMPORT_MESSAGES {
  NO_CHANGES = 'no changes',
}

type SyncResults = {
  importedTracksCount: number
  cursor: string
}

async function syncDropboxTracks(): Promise<SyncResults | IMPORT_MESSAGES> {
  console.log(chalk.yellow.bold('>> SYNCING DROPBOX TRACKS <<'))
  /**
   * Get the latest dropbox sync metadata
   */
  const [latestSyncMetadata] = await prisma.cloudSyncMetadata.findMany({
    orderBy: { createdAt: 'desc' },
    take: 1,
  })

  return new Promise((resolve, reject) => {
    let importedTracksCount = 0

    /**
     * If previous sync exists in the database,
     * use the latest cursor as a default parameter for pump() invocation
     */
    const pump = async (
      nextCursor: Dropbox.files.ListFolderCursor = latestSyncMetadata?.latestCursor ??
        undefined,
    ): Promise<SyncResults | IMPORT_MESSAGES> => {
      try {
        /**
         * If no cursor exists,
         * Use getFolderFilers with the default dropbox folder path
         */
        const { entries, has_more: hasMore, cursor } = nextCursor
          ? await getFolderFilesContinue(nextCursor)
          : await getFolderFiles(MUSIC_COLLECTION_PATH)

        if (isEmpty(entries)) resolve(IMPORT_MESSAGES.NO_CHANGES)

        const audioTracks = entries.filter(
          entry => isDropboxFile(entry) && isAudioFile(entry.name),
        )

        try {
          const importedAudioTracks = await importTracks(
            audioTracks as Dropbox.files.FileMetadataReference[],
          )

          importedTracksCount = importedTracksCount + importedAudioTracks.length
        } catch (error) {
          console.log(JSON.stringify(error))
          console.log('érror after importaing tracks')
        }

        console.log(`Successfully imported: ${importedTracksCount}`)

        if (hasMore) {
          /**
           * Let's wait a bit to avoid request limits of Dropbox
           */
          console.log(`Importing next cursor: ${cursor}`)
          await wait(1000 * 60)
          return pump(cursor)
        }
        resolve({ importedTracksCount, cursor })
      } catch (error) {
        console.log(JSON.stringify(error))
        if (JSON.stringify(error).includes('clientVersion')) {
          resolve({ importedTracksCount, cursor: nextCursor })
        }
        await prisma.cloudSyncMetadata.create({
          data: {
            lastImportedCursor: nextCursor,
            importFileCount: importedTracksCount,
            status: 'ERROR',
          },
        })
        reject(JSON.stringify(error))
      }
    }

    pump()
  })
}

syncDropboxTracks()
  .then(async syncResult => {
    if (syncResult === IMPORT_MESSAGES.NO_CHANGES) {
      console.log(chalk.green.bold('>> NO CHANGES SINCE LAST SYNC <<'))
    } else {
      const { importedTracksCount, cursor } = syncResult
      const { cursor: latestCursor } = await getLatestFolderCursor(
        MUSIC_COLLECTION_PATH,
      )
      await prisma.cloudSyncMetadata.create({
        data: {
          lastImportedCursor: cursor,
          latestCursor,
          importFileCount: importedTracksCount,
          status: 'OK',
        },
      })
      console.log(chalk.green.bold('>> TRACKS IMPORTED SUCCESSFULLY <<'))
      console.log(chalk.green(`>> Imported ${importedTracksCount} tracks!`))
    }
  })
  .catch(async error => {
    console.trace()
    console.log(
      chalk.red('>> THERE WAS AN ERROR WHILE SYNCING DROPBOX TRACKS.'),
    )
    console.log(
      chalk.red('>> Last processed cursor has been saved to database.'),
    )
    console.log(JSON.stringify(error))
    console.log(chalk.red(error))
  })
  .finally(async () => {
    await prisma.$disconnect()
    process.exit()
  })
