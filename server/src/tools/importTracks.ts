import { prisma } from '../context'
import dropbox from 'dropbox'
import { isAudioFile } from '../utils/utils'

type ImportTracksInput = dropbox.files.FileMetadataReference[]

export function parseTrack(track: string) {
  // TODO: Add proper file validation
  if (!isAudioFile(track)) {
    console.log(track)
    console.log(`Not a proper audio track`, track)
  }

  const trackInformation = track
    .split('-')
    .map(s => s.trim().replace('.mp3', ''))

  if (trackInformation.length === 3) {
    return [trackInformation[0], trackInformation[2]]
  } else {
    return [trackInformation[0], trackInformation[1]]
  }
}

export async function trackExists(fileId: string) {
  return await prisma.track.findUnique({ where: { fileId } })
}

async function importArtists(artistNames: string[]) {
  return Promise.all(
    artistNames.map(async artistName => {
      await prisma.artist.upsert({
        where: { name: artistName },
        create: {
          name: artistName,
        },
        update: {
          name: artistName,
        },
      })
    }),
  )
}

export async function importTracks(tracks: ImportTracksInput) {
  try {
    // First import artists to avoid duplicate import attempts
    // Create a unique artist array
    const artists = [
      ...new Set(tracks.map(track => parseTrack(track?.name ?? '')[0])),
    ]
    await importArtists(artists)

    const promises = tracks.map(async track => {
      const artistTrackTuple = parseTrack(track?.name ?? '')
      const { path_lower } = track
      const artist = await prisma.artist.findUnique({
        where: { name: artistTrackTuple[0] },
      })

      let importedTrack = await prisma.track.findUnique({
        where: { fileId: track.id },
      })

      if (!importedTrack) {
        importedTrack = await prisma.track.create({
          data: {
            title: artistTrackTuple[1],
            fileId: track.id,
            artist: {
              connect: { id: artist.id },
            },
            metadata: {
              create: {
                original_file_path: path_lower || '',
                direct_link: '',
              },
            },
          },
        })
      }

      return importedTrack
    })

    return Promise.all(promises)
  } catch (error) {
    console.log(JSON.stringify(error))
    /**
     * Following error most likely originates from this warning:
     * "Warning: nexus-plugin-prisma@0.33.0 does not support @prisma/client@2.20.1. The supported range is: `2.19.x`. This could lead to undefined behaviors and bugs."
     */
    if (!JSON.stringify(error).includes('clientVersion')) {
      console.error('IMPORT TRACKS FAILED')
      console.error(JSON.stringify(error))
      throw new Error(JSON.stringify(error))
    }
    console.log('ok from import catch')
    return 'OK'
  }
}
