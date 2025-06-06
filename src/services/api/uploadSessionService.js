import mockSessions from '../mockData/uploadSessions.json'

class UploadSessionService {
  constructor() {
    this.sessions = [...mockSessions]
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200))
  }

  async getAll() {
    await this.delay()
    return [...this.sessions]
  }

  async getById(id) {
    await this.delay()
    const session = this.sessions.find(s => s.id === id)
    return session ? { ...session } : null
  }

  async create(sessionData) {
    await this.delay()
    const newSession = {
      ...sessionData,
      id: sessionData.id || `session_${Date.now()}`,
      startedAt: sessionData.startedAt || new Date().toISOString(),
      files: sessionData.files || [],
      completedSize: sessionData.completedSize || 0
    }
    this.sessions.push(newSession)
    return { ...newSession }
  }

  async update(id, data) {
    await this.delay()
    const index = this.sessions.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Upload session not found')
    
    this.sessions[index] = { ...this.sessions[index], ...data }
    return { ...this.sessions[index] }
  }

  async delete(id) {
    await this.delay()
    const index = this.sessions.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Upload session not found')
    
    const deleted = this.sessions.splice(index, 1)[0]
    return { ...deleted }
  }
}

export const uploadSessionService = new UploadSessionService()