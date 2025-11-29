class ApiCache {
  constructor() {
    this.cache = new Map()
    this.ttl = 5 * 60 * 1000 // 5 minutes default TTL
  }

  set(key, data, customTtl = null) {
    if (!key || typeof key !== 'string') {
      throw new Error('Cache key must be a non-empty string')
    }
    
    const ttl = customTtl || this.ttl
    const expiry = Date.now() + ttl
    this.cache.set(key, { data, expiry })
  }

  get(key) {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  invalidate(pattern) {
    if (typeof pattern === 'string') {
      this.cache.delete(pattern)
    } else if (pattern instanceof RegExp) {
      for (const key of this.cache.keys()) {
        if (pattern.test(key)) {
          this.cache.delete(key)
        }
      }
    }
  }

  clear() {
    this.cache.clear()
  }

  generateKey(endpoint, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')
    return `${endpoint}${sortedParams ? `?${sortedParams}` : ''}`
  }
}

export default new ApiCache()