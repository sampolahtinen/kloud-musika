import dotenv from 'dotenv'
import dropbox from 'dropbox'
import fetch from 'isomorphic-fetch'
dotenv.config()

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
        resolve(link)
      })
      .catch(error => {
        console.log(JSON.stringify(error))
        reject(error)
      })
  })
}

export function getFolderFiles(path: string) {
  return dbx.filesListFolder({ path, limit: 500 })
}

export function getFolderFilesContinue(cursor: string) {
  return dbx.filesListFolderContinue({ cursor })
}

export function getFileMetadata(id: string) {
  return dbx.filesGetMetadata({ path: id })
}

export function getLatestFolderCursor(path: string) {
  return dbx.filesListFolderGetLatestCursor({ path })
}
