import BaseApiService from '../api/baseApi'

class SearchService extends BaseApiService {
  /**
   * Search for nearby professionals
   * GET /search/near-by/:longitude/:latitude
   */
  async searchNearbyProfessionals(latitude, longitude, limit = 10) {
    try {
      const lng = parseFloat(longitude)
      const lat = parseFloat(latitude)

      const data = await this.get(`/search/near-by/${lng}/${lat}?limit=${limit}`)
      console.log(`[SearchService] Nearby search results:`, data)
      return this.handleArrayResponse(data)

    } catch (error) {
      console.error('Nearby search failed:', error)
      return []
    }
  }

  /**
   * General search for professionals
   * GET /search/
   */
  async searchProfessionals({ latitude, longitude, radius, dayOfWeek, limit = 10 }) {
    const params = new URLSearchParams()

    if (latitude) params.append('latitude', latitude)
    if (longitude) params.append('longitude', longitude)
    if (radius) params.append('radius', radius)
    if (dayOfWeek) params.append('dayOfWeek', dayOfWeek)
    if (limit) params.append('limit', limit)

    try {
      console.log(`[SearchService] Searching professionals with params:`, { latitude, longitude, radius, dayOfWeek, limit })
      const data = await this.get(`/search/?${params.toString()}`)
      console.log(`[SearchService] Search response:`, data)
      return this.handleArrayResponse(data)
    } catch (error) {
      console.error('[SearchService] General search failed:', error)
      return []
    }

  }

  /**
   * Discovery professionals (featured/recommended)
   * GET /discover
   */
  async discoverProfessionals(limit = 10, latitude, longitude, radius = 50) {
    const params = new URLSearchParams()
    params.append('limit', limit)

    if (latitude && longitude) {
      params.append('latitude', latitude)
      params.append('longitude', longitude)
      params.append('radius', radius)
    }

    try {
      const data = await this.get(`/discover?${params.toString()}`)
      console.log(`[SearchService] Discovery results:`, data)
      return this.handleArrayResponse(data)
    } catch (error) {
      console.error('[SearchService] Discovery failed:', error)
      return []
    }

  }

  /**
   * Get public profile by ID
   * GET /discover/:id
   */
  async getProfile(professionalId) {
    const data = await this.get(`/discover/${professionalId}`)
    return this.handleResponse(data, 'Failed to fetch public profile')
  }
}

export default new SearchService()
