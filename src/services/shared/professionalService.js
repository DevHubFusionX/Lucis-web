import BaseApiService from '../api/baseApi'

class SharedProfessionalService extends BaseApiService {
  async getProfessionals(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const endpoint = `/professionals${queryParams ? `?${queryParams}` : ''}`
    
    try {
      const data = await this.get(endpoint, true, 3 * 60 * 1000) // 3min cache
      return this.handlePaginatedResponse(data)
    } catch (error) {
      return { records: [], pagination: null }
    }
  }

  async getProfessional(professionalId) {
    const data = await this.get(`/professionals/${professionalId}`, true, 5 * 60 * 1000) // 5min cache
    return this.handleResponse(data, 'Failed to fetch professional')
  }

  async getProfessionalPackages(professionalId, page = 1, limit = 10) {
    try {
      const data = await this.get(`/packages/${professionalId}?page=${page}&limit=${limit}`, true, 3 * 60 * 1000)
      return this.handlePaginatedResponse(data)
    } catch (error) {
      return { records: [], pagination: null }
    }
  }

  async getProfessionalSchedules(professionalId) {
    try {
      const data = await this.get(`/schedules/${professionalId}`, true, 3 * 60 * 1000)
      return this.handlePaginatedResponse(data)
    } catch (error) {
      return { records: [], pagination: null }
    }
  }

  async getProfessionalReviews(professionalId) {
    try {
      const data = await this.get(`/reviews/${professionalId}`, true, 5 * 60 * 1000)
      return data.data || { records: [], details: { averageRating: 0, totalReviews: 0 } }
    } catch (error) {
      return { records: [], details: { averageRating: 0, totalReviews: 0 } }
    }
  }

  async recordProfessionalView(professionalId) {
    try {
      await this.post('/professionals/view/', { professionalId })
    } catch (error) {
      console.warn('Failed to record view:', error)
    }
  }
}

export default new SharedProfessionalService()