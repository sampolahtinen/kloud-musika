import { prisma } from '../context'
import dropbox from 'dropbox'
import { generateSharingLink, isAudioFile } from '../connectors/dropbox'

// TODO fix this type
// type ImportTracksInput = drive_v3.Schema$File[] | dropbox.files.FileMetadata[]

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
  return await prisma.track.findOne({ where: { fileId } })
}

async function importArtists(artists: any) {
  return Promise.all(
    artists.map(async (artist: any) => {
      await prisma.artist.upsert({
        where: { name: artist },
        create: {
          name: artist,
        },
        update: {
          name: artist,
        },
      })
    }),
  )
}

export async function importTracks(tracks: ImportTracksInput) {
  console.log('importTrack function executed')
  // Create a unique artist array
  const artists = [
    ...new Set(
      tracks.map(track => parseTrack(track.name ? track.name : '')[0]),
    ),
  ]

  // First import artists to avoid duplicate import attempts
  await importArtists(artists)

  const promises = tracks.map(async track => {
    const artistTrackTuple = parseTrack(track.name ? track.name : '')
    const { path_lower } = track
    try {
      const artist = await prisma.artist.findOne({
        where: { name: artistTrackTuple[0] },
      })

      let importedTrack = await prisma.track.findOne({
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
                direct_link: await generateSharingLink(path_lower || ''),
                // direct_link: '',
              },
            },
          },
        })
      }

      return importedTrack
    } catch (error) {
      console.log('There was an error when trying to create a track/artist')
      console.log(error)
      return error
    }
  })
  return Promise.all(promises)
}
