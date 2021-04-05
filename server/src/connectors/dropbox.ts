import dotenv from 'dotenv'
import dropbox from 'dropbox'
import fetch from 'isomorphic-fetch'
import { importTracks } from '../tools/importTracks'
import chalk from 'chalk'
dotenv.config()
const MUSIC_COLLECTION_PATH = '/music_collection'

export const dbx = new dropbox.Dropbox({
  fetch,
  accessToken: process.env.DROPBOX_ACCESS_TOKEN,
})

export function generateSharingLink(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    dbx
      .sharingCreateSharedLink({ path })
      .then(sharedLink => {
        const { url } = sharedLink
        const cleanedUrl = url.replace('?dl=0', '')

        resolve(cleanedUrl)
      })
      .catch(error => {
        console.log(JSON.stringify(error))
        reject(error)
      })
  })
}

export function generateTemporaryDirectLink(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    dbx
      .filesGetTemporaryLink({ path })
      .then(tempLink => {
        const { link } = tempLink
        // const cleanedUrl = url.replace('?dl=0', '')

        resolve(link)
      })
      .catch(error => {
        console.log(JSON.stringify(error))
        reject(error)
      })
  })
}

export function getFolderFiles(path: string) {
  return dbx.filesListFolder({ path, limit: 100 })
}

export function getFolderFilesContinue(cursor: string) {
  return dbx.filesListFolderContinue({ cursor })
}

export function getFileMetadata(id: string) {
  return dbx.filesGetMetadata({ path: id })
}

export function isAudioFile(fileName: string) {
  if (
    fileName.includes('.mp3') ||
    fileName.includes('.wav') ||
    fileName.includes('.flac')
  ) {
    return true
  }

  return false
}

async function wait(time: number) {
  setTimeout(() => new Promise((resolve, reject) => resolve('ok')), time)
}

async function syncDropboxTracks() {
  try {
    let cursor: string
    let debugCounter = 0

    const {
      entries: tracks,
      has_more,
      cursor: firstCursor,
    } = await getFolderFiles(MUSIC_COLLECTION_PATH)

    let hasMore = has_more
    cursor = firstCursor
    debugCounter = debugCounter + tracks.length
    const cleaned = tracks.filter(track => isAudioFile(track.name))
    await importTracks(cleaned as dropbox.files.FileMetadataReference[])

    console.log('First import done')
    console.log(cleaned)
    // debugCounter < 5
    // while (hasMore) {
    //   console.log('Looping through cursors')
    //   const {
    //     entries: moreTracks,
    //     has_more,
    //     cursor: nextCursor,
    //   } = await getFolderFilesContinue(cursor)

    //   cursor = nextCursor
    //   hasMore = has_more

    //   const cleanedArray = moreTracks.filter(track =>
    //     isAudioFile(track.name),
    //   ) as dropbox.files.FileMetadataReference[]

    //   debugCounter = debugCounter + tracks.length
    //   // debugCounter++
    //   console.log(chalk.yellow(debugCounter))
    //   await wait(1000 * 60)
    //   await importTracks(cleanedArray)
    // }

    return debugCounter
  } catch (error) {
    console.log(chalk.red('Error from syncDropboxTracks function'))
    console.log(chalk.red(JSON.stringify(error)))
    throw new Error(error)
  }
}

// syncDropboxTracks()
//   .then(totalCount => {
//     console.log(chalk.green('SUCCESS!'))
//     console.log(chalk.green(`Imported ${totalCount} tracks!`))
//     process.exit()
//   })
//   .catch(error => {
//     console.log(chalk.red('Error from syncDropboxTracks function invocation'))
//     console.log(chalk.red(error))

//     process.exit()
//   })
