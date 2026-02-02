import httpClient from './httpClient'
import apiCache from './cache'

class BaseApiService {
  constructor() {
    this.http = httpClient
    this.cache = apiCache
  }


  async get(endpoint, useCache = false, ttl = null) {
    if (useCache && ttl) {
      const cachedData = this.cache.get(endpoint)
      if (cachedData) return cachedData

      const data = await this.http.get(endpoint)
      this.cache.set(endpoint, data, ttl)
      return data
    }

    return this.http.get(endpoint)
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