import BaseApiService from '../api/baseApi'
import { storage } from '../../utils/storage'

class ReviewService extends BaseApiService {
  async getReviews() {
    const user = storage.get('user')
    
    try {
      const data = await this.get(`/reviews/${user.id}`, true, 5 * 60 * 1000) // 5min cache
      return data.data || { records: [], details: { averageRating: 0, totalReviews: 0 } }
    } catch (error) {
      return { records: [], details: { averageRating: 0, totalReviews: 0 } }
    }
  }

  async getViews() {
    try {
      const data = await this.get('/professionals/views/', true, 5 * 60 * 1000) // 5min cache
      return this.handlePaginatedResponse(data)
    } catch (error) {
      return { records: [], pagination: null }
    }
  }
}

export default new ReviewService()