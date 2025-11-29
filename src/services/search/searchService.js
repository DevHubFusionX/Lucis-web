import BaseApiService from '../api/baseApi'

class SearchService extends BaseApiService {
  async searchNearbyProfessionals(latitude, longitude, limit = 10) {
    try {
      const data = await this.get(`/search/near-by/${latitude}/${longitude}?limit=${limit}`, true, 2 * 60 * 1000) // 2min cache
      return data.data?.records || []
    } catch (error) {
      return []
    }
  }

  async searchProfessionals({ latitude, longitude, radius, dayOfWeek, limit = 10 }) {
    const params = new URLSearchParams()
    
    if (latitude) params.append('latitude', latitude)
    if (longitude) params.append('longitude', longitude)
    if (radius) params.append('radius', radius)
    if (dayOfWeek) params.append('dayOfWeek', dayOfWeek)
    if (limit) params.append('limit', limit)

    try {
      const data = await this.get(`/search/?${params.toString()}`, true, 2 * 60 * 1000) // 2min cache
      return data.data?.records || []
    } catch (error) {
      return []
    }
  }
}

export default new SearchService()