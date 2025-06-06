import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { fileService, uploadSessionService } from '../services'

function MainFeature({ files, setFiles, uploadSessions, setUploadSessions }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({})
  const fileInputRef = useRef(null)

  const createParticles = (element) => {
    const rect = element.getBoundingClientRect()
    const particles = []
    
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 100}px`
      particle.style.top = `${rect.top + rect.height / 2 + (Math.random() - 0.5) * 100}px`
      document.body.appendChild(particle)
      particles.push(particle)
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle)
        }
      }, 2000)
    }
  }

  const handleFileUpload = useCallback(async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    const fileArray = Array.from(selectedFiles)
    const maxSize = 100 * 1024 * 1024 // 100MB
    const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats-officedocument']

    // Validate files
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 100MB.`)
        return false
      }
      
      const isValidType = allowedTypes.some(type => file.type.startsWith(type))
      if (!isValidType) {
        toast.error(`File type ${file.type} is not supported.`)
        return false
      }
      
      return true
    })

    if (validFiles.length === 0) return

    // Create upload session
    const session = {
      id: `session_${Date.now()}`,
      files: [],
      startedAt: new Date(),
      totalSize: validFiles.reduce((sum, file) => sum + file.size, 0),
      completedSize: 0
    }

    try {
      const newSession = await uploadSessionService.create(session)
      setUploadSessions(prev => [...prev, newSession])

      // Process each file
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        const fileId = `file_${Date.now()}_${i}`

        // Create file record
        const fileRecord = {
          id: fileId,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date(),
          status: 'uploading',
          progress: 0,
          url: URL.createObjectURL(file),
          thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }

        // Add to files list immediately
        setFiles(prev => [...prev, fileRecord])
        
        // Simulate upload progress
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))
        
        // Simulate upload with progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }))
          
          // Update file progress
          setFiles(prev => prev.map(f => 
            f.id === fileId ? { ...f, progress } : f
          ))
        }

        // Complete the upload
        const completedFile = { ...fileRecord, status: 'completed', progress: 100 }
        await fileService.create(completedFile)
        
        setFiles(prev => prev.map(f => 
          f.id === fileId ? completedFile : f
        ))

        // Update session progress
        setUploadSessions(prev => prev.map(s => 
          s.id === newSession.id 
            ? { 
                ...s, 
                completedSize: s.completedSize + file.size,
                files: [...s.files, completedFile]
              }
            : s
        ))

        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[fileId]
          return newProgress
        })

        toast.success(`${file.name} uploaded successfully`)
      }

      // Remove completed session after a delay
      setTimeout(() => {
        setUploadSessions(prev => prev.filter(s => s.id !== newSession.id))
      }, 3000)

    } catch (error) {
      toast.error('Upload failed')
      console.error('Upload error:', error)
    }
  }, [setFiles, setUploadSessions])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback(async (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const droppedFiles = e.dataTransfer.files
    await handleFileUpload(droppedFiles)
    
    // Create particle effect
    createParticles(e.currentTarget)
  }, [handleFileUpload])

  const handleFileSelect = useCallback(async (e) => {
    const selectedFiles = e.target.files
    await handleFileUpload(selectedFiles)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFileUpload])

  return (
    <div className="space-y-6">
      {/* Upload Drop Zone */}
      <motion.div
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-surface-300 dark:border-surface-600 hover:border-surface-400 dark:hover:border-surface-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.mp4,.mp3,.wav"
        />

        <motion.div
          className={`transition-colors duration-300 ${
            isDragOver ? 'text-primary' : 'text-surface-400'
          }`}
          animate={{ 
            scale: isDragOver ? 1.1 : 1,
            rotate: isDragOver ? [0, -5, 5, 0] : 0
          }}
        >
          <ApperIcon 
            name="Upload" 
            size={48} 
            className="mx-auto mb-4"
          />
        </motion.div>

        <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
          {isDragOver ? 'Drop files here' : 'Drag and drop files'}
        </h3>
        
        <p className="text-surface-500 dark:text-surface-400 mb-6">
          or click to browse files from your device
        </p>

        <motion.button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="FolderOpen" size={20} />
          <span>Browse Files</span>
        </motion.button>

        <div className="mt-4 text-xs text-surface-400 dark:text-surface-500">
          Supported: Images, Videos, Audio, PDF, Documents • Max 100MB per file
        </div>

        {/* Upload Progress Overlay */}
        <AnimatePresence>
          {Object.keys(uploadProgress).length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/90 dark:bg-surface-800/90 backdrop-blur-sm rounded-2xl flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="w-16 h-16 border-4 border-surface-200 dark:border-surface-700 rounded-full"></div>
                  <div 
                    className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"
                  ></div>
                </div>
                <p className="text-surface-900 dark:text-white font-medium">
                  Uploading files...
                </p>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                  {Object.keys(uploadProgress).length} files in progress
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Upload Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Files" size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-surface-900 dark:text-white">
                {files.length}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Total Files
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-surface-900 dark:text-white">
                {files.filter(f => f.status === 'completed').length}
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Completed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-card">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="HardDrive" size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-surface-900 dark:text-white">
                {(files.reduce((sum, f) => sum + (f.size || 0), 0) / (1024 * 1024)).toFixed(1)}MB
              </p>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Total Size
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainFeature