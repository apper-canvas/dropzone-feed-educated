import foldersData from '../mockData/folders.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let folders = [...foldersData]

// Helper function to build folder tree structure
const buildFolderTree = (folderList) => {
  const folderMap = {}
  const rootFolders = []

  // Create folder map
  folderList.forEach(folder => {
    folderMap[folder.id] = { ...folder, children: [] }
  })

  // Build tree structure
  folderList.forEach(folder => {
    if (folder.parentId && folderMap[folder.parentId]) {
      folderMap[folder.parentId].children.push(folderMap[folder.id])
    } else {
      rootFolders.push(folderMap[folder.id])
    }
  })

  return rootFolders
}

// Flatten folder tree for easier searching
const flattenFolderTree = (folderTree) => {
  const flattened = []
  
  const traverse = (folders) => {
    folders.forEach(folder => {
      flattened.push(folder)
      if (folder.children && folder.children.length > 0) {
        traverse(folder.children)
      }
    })
  }
  
  traverse(folderTree)
  return flattened
}

export const folderService = {
  // Get all folders as tree structure
  async getAll() {
    await delay(200)
    return buildFolderTree(folders)
  },

  // Get all folders as flat list
  async getFlat() {
    await delay(150)
    return [...folders]
  },

  // Get folder by ID
  async getById(id) {
    await delay(100)
    const folder = folders.find(f => f.id === id)
    return folder ? { ...folder } : null
  },

  // Create new folder
  async create(folderData) {
    await delay(300)
    const newFolder = {
      ...folderData,
      id: `folder_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      children: []
    }
    
    folders.push(newFolder)
    return { ...newFolder }
  },

  // Update folder
  async update(id, updates) {
    await delay(250)
    const index = folders.findIndex(f => f.id === id)
    if (index === -1) {
      throw new Error('Folder not found')
    }
    
    folders[index] = {
      ...folders[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    return { ...folders[index] }
  },

  // Delete folder
  async delete(id) {
    await delay(200)
    const index = folders.findIndex(f => f.id === id)
    if (index === -1) {
      throw new Error('Folder not found')
    }
    
    // Also remove any child folders
    const folderToDelete = folders[index]
    const childFolders = folders.filter(f => f.path && f.path.startsWith(folderToDelete.path + '/'))
    
    folders = folders.filter(f => f.id !== id && !childFolders.some(child => child.id === f.id))
    
    return true
  },

  // Get folder path
  async getFolderPath(folderId) {
    await delay(100)
    if (!folderId) return '/'
    
    const folder = folders.find(f => f.id === folderId)
    return folder ? folder.path : '/'
  },

  // Move folder to new parent
  async moveFolder(folderId, newParentId) {
    await delay(300)
    const folderIndex = folders.findIndex(f => f.id === folderId)
    if (folderIndex === -1) {
      throw new Error('Folder not found')
    }
    
    const folder = folders[folderIndex]
    const oldPath = folder.path
    
    let newPath
    if (newParentId) {
      const parentFolder = folders.find(f => f.id === newParentId)
      if (!parentFolder) {
        throw new Error('Parent folder not found')
      }
      newPath = `${parentFolder.path}/${folder.name}`
    } else {
      newPath = `/${folder.name}`
    }
    
    // Update folder
    folders[folderIndex] = {
      ...folder,
      parentId: newParentId,
      path: newPath,
      updatedAt: new Date().toISOString()
    }
    
    // Update all child folders' paths
    folders.forEach((f, index) => {
      if (f.path && f.path.startsWith(oldPath + '/')) {
        folders[index] = {
          ...f,
          path: f.path.replace(oldPath, newPath),
          updatedAt: new Date().toISOString()
        }
      }
    })
    
    return { ...folders[folderIndex] }
  }
}