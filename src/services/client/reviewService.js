import BaseApiService from '../api/baseApi'
import { sanitizeFormData } from '../../utils/securityUtils'

class ClientReviewService extends BaseApiService {
  async createReview(reviewData) {
    const sanitizedData = sanitizeFormData(reviewData)
    const data = await this.post('/reviews/', sanitizedData)
    
    // Invalidate reviews cache
    this.cache.invalidate(/^\/reviews\//);
    
    return this.handleResponse(data, 'Failed to create review')
  }

  async getReviews() {
    try {
      const data = await this.get('/reviews/user/', true, 5 * 60 * 1000) // 5min cache
      return this.handleArrayResponse(data)
    } catch (error) {
      return []
    }
  }

  async updateReview(reviewId, reviewData) {
    const sanitizedData = sanitizeFormData(reviewData)
    const data = await this.put(`/reviews/${reviewId}`, sanitizedData)
    
    // Invalidate reviews cache
    this.cache.invalidate(/^\/reviews\//);
    
    return this.handleResponse(data, 'Failed to update review')
  }

  async deleteReview(reviewId) {
    const data = await this.delete(`/reviews/${reviewId}`)
    
    // Invalidate reviews cache
    this.cache.invalidate(/^\/reviews\//);
    
    return this.handleResponse(data, 'Failed to delete review')
  }
}

export default new ClientReviewService()