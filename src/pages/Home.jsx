import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import { fileService, folderService } from '../services'

function Home({ darkMode, setDarkMode }) {
  const [files, setFiles] = useState([])
  const [uploadSessions, setUploadSessions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  
  // Folder organization state
  const [folders, setFolders] = useState([])
  const [selectedFolderId, setSelectedFolderId] = useState(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [foldersLoading, setFoldersLoading] = useState(false)

useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setFoldersLoading(true)
      try {
        // Load both files and folders
        const [filesResult, foldersResult] = await Promise.all([
          fileService.getAll(),
          folderService.getAll()
        ])
        setFiles(filesResult || [])
        setFolders(foldersResult || [])
      } catch (err) {
        setError(err.message)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
        setFoldersLoading(false)
      }
    }
    loadData()
  }, [])

const filteredFiles = files.filter(file => {
    const matchesSearch = file?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || ''
    const matchesFolder = selectedFolderId ? file.folderId === selectedFolderId : true
    return matchesSearch && matchesFolder
  })

  const handleDeleteFile = async (fileId) => {
    try {
      await fileService.delete(fileId)
      setFiles(prev => prev.filter(f => f.id !== fileId))
      toast.success('File deleted successfully')
      setShowPreview(false)
    } catch (err) {
      toast.error('Failed to delete file')
    }
  }

  const handlePreviewFile = (file) => {
    setSelectedFile(file)
    setShowPreview(true)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

  // Folder management functions
  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId)
  }

  const handleCreateFolder = async (folderName, parentId = null) => {
    try {
      const newFolder = await folderService.create({
        name: folderName,
        parentId: parentId,
        path: parentId ? `${getFolderPath(parentId)}/${folderName}` : `/${folderName}`,
        color: '#3B82F6',
        icon: 'Folder'
      })
      
      // Reload folders to get updated tree
      const updatedFolders = await folderService.getAll()
      setFolders(updatedFolders)
      toast.success('Folder created successfully')
      return newFolder
    } catch (err) {
      toast.error('Failed to create folder')
      throw err
    }
  }

  const handleDeleteFolder = async (folderId) => {
    try {
      await folderService.delete(folderId)
      const updatedFolders = await folderService.getAll()
      setFolders(updatedFolders)
      
      // Reset selected folder if it was deleted
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null)
      }
      
      toast.success('Folder deleted successfully')
    } catch (err) {
      toast.error('Failed to delete folder')
    }
  }

  const handleMoveFile = async (fileId, targetFolderId) => {
    try {
      await fileService.moveToFolder(fileId, targetFolderId)
      const updatedFiles = await fileService.getAll()
      setFiles(updatedFiles)
      toast.success('File moved successfully')
    } catch (err) {
      toast.error('Failed to move file')
    }
  }

  const getFolderPath = (folderId) => {
    const findFolderPath = (folders, targetId, currentPath = '') => {
      for (const folder of folders) {
        const newPath = currentPath + '/' + folder.name
        if (folder.id === targetId) {
          return newPath
        }
        if (folder.children && folder.children.length > 0) {
          const childPath = findFolderPath(folder.children, targetId, newPath)
          if (childPath) return childPath
        }
      }
      return null
    }
    return findFolderPath(folders, folderId) || '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-surface-600 dark:text-surface-300">Loading files...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800">
      {/* Header */}
      <header className="bg-white/70 dark:bg-surface-800/70 backdrop-blur-lg border-b border-surface-200 dark:border-surface-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Upload" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-heading font-semibold text-surface-900 dark:text-white">
                DropZone
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden sm:block">
                <ApperIcon 
                  name="Search" 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400"
                />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-surface-100 dark:bg-surface-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white dark:bg-surface-600 text-primary shadow-sm' 
                      : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                  }`}
                >
                  <ApperIcon name="Grid3x3" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white dark:bg-surface-600 text-primary shadow-sm' 
                      : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                  }`}
                >
                  <ApperIcon name="List" size={16} />
                </button>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              >
                <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={18} />
              </button>
            </div>
          </div>
        </div>
      </header>

{/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid gap-8 ${showSidebar ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} transition-all duration-300`}>
          
          {/* File Organization Sidebar */}
          {showSidebar && (
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card sticky top-24 max-h-[calc(100vh-6rem)] overflow-hidden">
                <div className="p-4 border-b border-surface-200 dark:border-surface-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                      Folders
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCreateFolder('New Folder')}
                        className="p-1.5 text-surface-500 hover:text-primary transition-colors"
                        title="Create Folder"
                      >
                        <ApperIcon name="FolderPlus" size={16} />
                      </button>
                      <button
                        onClick={() => setShowSidebar(false)}
                        className="p-1.5 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 transition-colors"
                      >
                        <ApperIcon name="X" size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 overflow-y-auto max-h-96">
                  {foldersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {/* All Files Option */}
                      <button
                        onClick={() => handleFolderSelect(null)}
                        className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left transition-colors ${
                          selectedFolderId === null
                            ? 'bg-primary/10 text-primary'
                            : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                        }`}
                      >
                        <ApperIcon name="Files" size={16} />
                        <span className="text-sm font-medium">All Files</span>
                        <span className="ml-auto text-xs text-surface-500">
                          {files.length}
                        </span>
                      </button>
                      
                      {/* Folder Tree */}
                      {folders.map((folder) => (
                        <FolderTreeItem
                          key={folder.id}
                          folder={folder}
                          selectedFolderId={selectedFolderId}
                          onSelect={handleFolderSelect}
                          onDelete={handleDeleteFolder}
                          files={files}
                          level={0}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Toggle Sidebar Button (when hidden) */}
          {!showSidebar && (
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40">
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 bg-white dark:bg-surface-800 rounded-lg shadow-card text-surface-600 dark:text-surface-300 hover:text-primary transition-colors"
              >
                <ApperIcon name="FolderOpen" size={20} />
              </button>
            </div>
          )}
{/* Upload Area */}
          <div className={`${showSidebar ? 'lg:col-span-3' : 'lg:col-span-3'}`}>
            <MainFeature 
              files={files}
              setFiles={setFiles}
              uploadSessions={uploadSessions}
              setUploadSessions={setUploadSessions}
            />

            {/* Files Display */}
            <div className="mt-8">
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {filteredFiles.length === 0 && !loading ? (
                <div className="text-center py-12">
                  <ApperIcon name="FileX" size={48} className="mx-auto text-surface-400 mb-4" />
                  <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-2">
                    {searchTerm ? 'No files found' : 'No files uploaded yet'}
                  </h3>
                  <p className="text-surface-500 dark:text-surface-400">
                    {searchTerm ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
                  </p>
                </div>
              ) : (
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-2'
                }`}>
                  <AnimatePresence>
                    {filteredFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`${
                          viewMode === 'grid'
                            ? 'bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card hover:shadow-soft transition-all duration-200 cursor-pointer group'
                            : 'bg-white dark:bg-surface-800 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-card transition-all duration-200'
                        }`}
                        onClick={() => handlePreviewFile(file)}
                      >
                        {viewMode === 'grid' ? (
                          <div>
                            <div className="aspect-square bg-surface-100 dark:bg-surface-700 rounded-lg mb-3 flex items-center justify-center">
                              {file.type?.startsWith('image/') ? (
                                <img 
                                  src={file.thumbnail || file.url} 
                                  alt={file.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <ApperIcon name="File" size={32} className="text-surface-400" />
                              )}
                            </div>
                            <h4 className="font-medium text-surface-900 dark:text-white truncate mb-1">
                              {file.name || 'Untitled'}
                            </h4>
                            <div className="flex items-center justify-between text-sm text-surface-500 dark:text-surface-400">
                              <span>{formatFileSize(file.size || 0)}</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                file.status === 'completed' 
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                  : file.status === 'uploading'
                                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                  : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                              }`}>
                                {file.status || 'unknown'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-surface-100 dark:bg-surface-700 rounded-lg flex items-center justify-center">
                                <ApperIcon name="File" size={20} className="text-surface-400" />
                              </div>
                              <div>
                                <h4 className="font-medium text-surface-900 dark:text-white">
                                  {file.name || 'Untitled'}
                                </h4>
                                <p className="text-sm text-surface-500 dark:text-surface-400">
                                  {formatFileSize(file.size || 0)} • {file.type || 'Unknown type'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                file.status === 'completed' 
                                  ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                                  : file.status === 'uploading'
                                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                  : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                              }`}>
                                {file.status || 'unknown'}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteFile(file.id)
                                }}
                                className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                              >
                                <ApperIcon name="Trash2" size={16} />
                              </button>
                            </div>
                          </>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Upload Queue Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-card sticky top-24">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">
                Upload Queue
              </h3>
              {uploadSessions.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Upload" size={32} className="mx-auto text-surface-400 mb-2" />
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    No active uploads
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadSessions.map((session) => (
                    <div key={session.id} className="p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-surface-900 dark:text-white">
                          Session {session.id?.slice(-6)}
                        </span>
                        <span className="text-xs text-surface-500 dark:text-surface-400">
                          {session.files?.length || 0} files
                        </span>
                      </div>
                      <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-2 mb-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${((session.completedSize || 0) / (session.totalSize || 1)) * 100}%` 
                          }}
                        />
                      </div>
                      <p className="text-xs text-surface-500 dark:text-surface-400">
                        {formatFileSize(session.completedSize || 0)} / {formatFileSize(session.totalSize || 0)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
</div>
        </div>
      </main>

      {/* File Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-surface-900 dark:text-white">
                    {selectedFile.name}
                  </h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(selectedFile.url, '_blank')}
                    className="p-2 text-surface-600 dark:text-surface-300 hover:text-primary transition-colors"
                  >
                    <ApperIcon name="Download" size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteFile(selectedFile.id)}
                    className="p-2 text-surface-600 dark:text-surface-300 hover:text-red-500 transition-colors"
                  >
                    <ApperIcon name="Trash2" size={20} />
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 text-surface-600 dark:text-surface-300 hover:text-surface-800 dark:hover:text-white transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6 max-h-[60vh] overflow-auto">
                {selectedFile.type?.startsWith('image/') ? (
                  <img 
                    src={selectedFile.url} 
                    alt={selectedFile.name}
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <ApperIcon name="File" size={64} className="text-surface-400 mb-4" />
                    <p className="text-surface-600 dark:text-surface-300 text-center">
                      Preview not available for this file type
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Simple FolderTreeItem component (inline for now)
function FolderTreeItem({ folder, selectedFolderId, onSelect, onDelete, files, level }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const filesInFolder = files.filter(f => f.folderId === folder.id).length
  
  return (
    <div>
      <button
        onClick={() => onSelect(folder.id)}
        className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left transition-colors ${
          selectedFolderId === folder.id
            ? 'bg-primary/10 text-primary'
            : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
        }`}
        style={{ paddingLeft: `${8 + level * 16}px` }}
      >
        {folder.children && folder.children.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="p-0.5"
          >
            <ApperIcon 
              name={isExpanded ? "ChevronDown" : "ChevronRight"} 
              size={12} 
            />
          </button>
        )}
        <ApperIcon name={folder.icon || "Folder"} size={16} />
        <span className="text-sm font-medium flex-1">{folder.name}</span>
        <span className="text-xs text-surface-500">{filesInFolder}</span>
      </button>
      
      {isExpanded && folder.children && folder.children.map((child) => (
        <FolderTreeItem
          key={child.id}
          folder={child}
          selectedFolderId={selectedFolderId}
          onSelect={onSelect}
          onDelete={onDelete}
          files={files}
          level={level + 1}
        />
      ))}
    </div>
</div>
  )
}

export default Home