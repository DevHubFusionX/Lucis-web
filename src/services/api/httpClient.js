import { storage } from '../../utils/storage'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

class HttpClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    }
  }

  getAuthHeaders() {
    const token = storage.get('token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      ...options,
      headers: {
        ...(options.skipDefaultHeaders ? {} : this.defaultHeaders),
        ...this.getAuthHeaders(),
        ...options.headers
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP ${response.status}` }))
        throw new Error(errorData.message || `Request failed with status ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.')
      }
      throw error
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  patch(endpoint, data = null, options = {}) {
    const config = { ...options, method: 'PATCH' }
    if (data) config.body = JSON.stringify(data)
    return this.request(endpoint, config)
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  upload(endpoint, formData, options = {}) {
    const headers = { ...this.getAuthHeaders(), ...options.headers }
    delete headers['Content-Type'] // Let browser set multipart boundary
    
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      headers,
      body: formData,
      skipDefaultHeaders: true
    })
  }
}

export default new HttpClient()