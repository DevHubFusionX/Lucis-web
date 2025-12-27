import httpClient from './api/httpClient'
import apiCache from '../utils/apiCache'

/**
 * Service for discovery and search operations
 */
class SearchService {
  /**
   * Search for nearby professionals within a radius
   */
  async searchNearbyProfessionals(latitude, longitude, limit = 10) {
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error('Invalid coordinates')
    }

    const validLimit = Math.max(1, Math.min(100, parseInt(limit) || 10))
    const endpoint = `/search/near-by/${lat}/${lng}?limit=${validLimit}`

    const data = await httpClient.get(endpoint, {
      requestId: `nearby-${lat}-${lng}`,
      retryAttempts: 2
    })

    return data.data?.records || data.data || []
  }

  /**
   * Get discovery professionals (featured/recommended)
   */
  async discoverProfessionals(limit = 10, latitude, longitude, radius = 50) {
    const params = new URLSearchParams()
    params.append('limit', Math.max(1, Math.min(100, parseInt(limit) || 10)))
    
    // API requires latitude, longitude, and radius to be provided together
    if (latitude && longitude) {
      params.append('latitude', latitude)
      params.append('longitude', longitude)
      params.append('radius', radius)
    }

    const endpoint = `/discover?${params.toString()}`

    const data = await httpClient.get(endpoint, {
      requestId: 'discover-professionals',
      retryAttempts: 2
    })

    return data.data?.records || data.data || []
  }

  async searchProfessionals({ latitude, longitude, radius, dayOfWeek, limit = 10, sortBy, order }) {
    const params = new URLSearchParams()
    
    if (latitude) params.append('latitude', latitude)
    if (longitude) params.append('longitude', longitude)
    if (radius) params.append('radius', radius)
    if (dayOfWeek) params.append('dayOfWeek', dayOfWeek)
    if (limit) params.append('limit', limit)
    if (sortBy) params.append('sortBy', sortBy)
    if (order) params.append('order', order)

    const endpoint = `/search/?${params.toString()}`
    
    const data = await httpClient.get(endpoint, {
      requestId: 'search-professionals',
      retryAttempts: 2
    })

    return data.data?.records || data.data || []
  }

  /**
   * Get photographer profile by ID with caching
   */
  async getProfile(professionalId) {
    const endpoint = `/discover/${professionalId}`
    const cacheKey = apiCache.generateKey(endpoint)

    // Check cache first
    const cached = apiCache.get(cacheKey)
    if (cached) {
      console.log('📦 Cache hit:', endpoint)
      return cached
    }

    const data = await httpClient.get(endpoint, {
      requestId: `profile-${professionalId}`,
      retryAttempts: 3 // Retry profile fetching more aggressively
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to fetch profile')
    }

    const profile = data.data

    // Cache profile for 5 minutes
    apiCache.set(cacheKey, profile, 5 * 60 * 1000)

    return profile
  }

  /**
   * Invalidate cached profile
   */
  invalidateProfile(professionalId) {
    const endpoint = `/discover/${professionalId}`
    const cacheKey = apiCache.generateKey(endpoint)
    apiCache.invalidate(cacheKey)
  }

  /**
   * Invalidate all search caches
   */
  invalidateSearchCache() {
    apiCache.invalidate(/^\/discover/)
  }
}

export default new SearchService()