import { storage } from '../utils/storage'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

class SearchService {
  getToken() {
    return storage.get('token')
  }

  async searchNearbyProfessionals(latitude, longitude, limit = 10) {
    // Validate coordinates to prevent SSRF
    const lat = parseFloat(latitude)
    const lng = parseFloat(longitude)
    
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error('Invalid coordinates')
    }
    
    const response = await fetch(`${API_BASE_URL}/search/near-by/${lat}/${lng}?limit=${Math.max(1, Math.min(100, parseInt(limit) || 10))}`, {
      method: 'GET'
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      return []
    }

    return data.data?.records || []
  }

  async searchProfessionals({ latitude, longitude, radius, dayOfWeek, limit = 10 }) {
    const params = new URLSearchParams()
    
    if (latitude) params.append('latitude', latitude)
    if (longitude) params.append('longitude', longitude)
    if (radius) params.append('radius', radius)
    if (dayOfWeek) params.append('dayOfWeek', dayOfWeek)
    if (limit) params.append('limit', limit)

    const response = await fetch(`${API_BASE_URL}/search/?${params.toString()}`, {
      method: 'GET'
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      return []
    }

    return data.data?.records || []
  }
}

export default new SearchService()