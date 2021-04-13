export const isDropboxFile = (
  entry:
    | DropboxTypes.files.FileMetadataReference
    | DropboxTypes.files.FolderMetadataReference
    | DropboxTypes.files.DeletedMetadataReference,
) => entry['.tag'] === 'file'
