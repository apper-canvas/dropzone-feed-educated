import filesData from '../mockData/files.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let files = [...filesData]

export const fileService = {
  async getAll() {
    await delay(300)
    return [...files]
  },

async getById(id) {
    if (!id) {
      throw new Error('File ID is required')
    }
    await delay(200)
    const file = files.find(f => f.id === id)
    return file ? { ...file } : null
  },

async create(fileData) {
    if (!fileData || !fileData.name) {
      throw new Error('File data with name is required')
    }
    await delay(400)
    const newFile = {
      ...fileData,
      id: fileData.id || `file_${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      folderId: fileData.folderId || null
    }
    files.push(newFile)
    return { ...newFile }
  },

async update(id, updates) {
    if (!id) {
      throw new Error('File ID is required')
    }
    if (!updates || typeof updates !== 'object') {
      throw new Error('Updates object is required')
    }
    await delay(300)
    const index = files.findIndex(f => f.id === id)
    if (index === -1) {
      throw new Error('File not found')
    }
    files[index] = { ...files[index], ...updates, updatedAt: new Date().toISOString() }
    return { ...files[index] }
  },

async delete(id) {
    if (!id) {
      throw new Error('File ID is required')
    }
    await delay(250)
    const index = files.findIndex(f => f.id === id)
    if (index === -1) {
      throw new Error('File not found')
    }
    files.splice(index, 1)
    return true
  },

  // Get files by folder
  async getByFolder(folderId) {
    await delay(200)
    return files.filter(f => f.folderId === folderId)
  },

  // Move file to folder
async moveToFolder(fileId, folderId) {
    if (!fileId) {
      throw new Error('File ID is required')
    }
    await delay(300)
    const index = files.findIndex(f => f.id === fileId)
    if (index === -1) {
      throw new Error('File not found')
    }
    
    files[index] = {
      ...files[index],
      folderId: folderId,
      updatedAt: new Date().toISOString()
    }
    
    return { ...files[index] }
  },

  // Search files
async search(query, folderId = null) {
    if (!query || typeof query !== 'string') {
      throw new Error('Search query is required')
    }
    await delay(150)
    let searchResults = files.filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase()) ||
      (file.type && file.type.toLowerCase().includes(query.toLowerCase()))
    )
    
    if (folderId) {
      searchResults = searchResults.filter(f => f.folderId === folderId)
    }
    
    return searchResults
  },

  // Get files with folder filter
  async getFiltered(filters = {}) {
    await delay(200)
    let filteredFiles = [...files]
    
    if (filters.folderId) {
      filteredFiles = filteredFiles.filter(f => f.folderId === filters.folderId)
    }
    
    if (filters.type) {
      filteredFiles = filteredFiles.filter(f => f.type && f.type.startsWith(filters.type))
    }
    
    if (filters.search) {
      filteredFiles = filteredFiles.filter(f => 
        f.name.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    
return filteredFiles
  }
}