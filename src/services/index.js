export { fileService } from './api/fileService'
export { uploadSessionService } from './api/uploadSessionService'
export { folderService } from './api/folderService'

// Re-export commonly used utilities
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
}