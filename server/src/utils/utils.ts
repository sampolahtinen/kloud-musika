export async function wait(time: number) {
  setTimeout(() => new Promise((resolve, reject) => resolve('ok')), time)
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

export default {
  wait,
  isAudioFile,
}
