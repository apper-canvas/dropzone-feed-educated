import mockFiles from '../mockData/files.json'

class FileService {
  constructor() {
    this.files = [...mockFiles]
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.files]
  }

  async getById(id) {
    await this.delay()
    const file = this.files.find(f => f.id === id)
    return file ? { ...file } : null
  }

  async create(fileData) {
    await this.delay()
    const newFile = {
      ...fileData,
      id: fileData.id || `file_${Date.now()}`,
      uploadedAt: fileData.uploadedAt || new Date().toISOString()
    }
    this.files.push(newFile)
    return { ...newFile }
  }

  async update(id, data) {
    await this.delay()
    const index = this.files.findIndex(f => f.id === id)
    if (index === -1) throw new Error('File not found')
    
    this.files[index] = { ...this.files[index], ...data }
    return { ...this.files[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.files.findIndex(f => f.id === id)
    if (index === -1) throw new Error('File not found')
    
    const deleted = this.files.splice(index, 1)[0]
    return { ...deleted }
  }
}

export const fileService = new FileService()