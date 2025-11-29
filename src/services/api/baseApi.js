import httpClient from './httpClient'
import apiCache from '../../utils/apiCache'

class BaseApiService {
  constructor() {
    this.http = httpClient
    this.cache = apiCache
  }

  async get(endpoint, useCache = false, cacheTtl = null) {
    if (useCache) {
      const cached = this.cache.get(endpoint)
      if (cached) return cached
    }

    const data = await this.http.get(endpoint)
    
    if (useCache) {
      this.cache.set(endpoint, data, cacheTtl)
    }
    
    return data
  }

  async post(endpoint, data) {
    return this.http.post(endpoint, data)
  }

  async put(endpoint, data) {
    return this.http.put(endpoint, data)
  }

  async patch(endpoint, data = null) {
    return this.http.patch(endpoint, data)
  }

  async delete(endpoint) {
    return this.http.delete(endpoint)
  }

  handleResponse(data, errorMessage = 'Operation failed') {
    if (data.error) {
      throw new Error(data.message || errorMessage)
    }
    return data.data || data
  }

  handleArrayResponse(data) {
    if (data.data?.records) return data.data.records
    return Array.isArray(data.data) ? data.data : []
  }

  handlePaginatedResponse(data) {
    return data.data || { records: [], pagination: null }
  }
}

export default BaseApiService