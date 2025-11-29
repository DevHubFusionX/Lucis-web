import BaseApiService from '../api/baseApi'
import { sanitizeFormData } from '../../utils/securityUtils'

class PaymentService extends BaseApiService {
  async getPaymentMethods() {
    try {
      const data = await this.get('/payments/methods/', true, 5 * 60 * 1000) // 5min cache
      return this.handleArrayResponse(data)
    } catch (error) {
      return []
    }
  }

  async addPaymentMethod(paymentData) {
    const sanitizedData = sanitizeFormData(paymentData)
    const data = await this.post('/payments/methods/', sanitizedData)
    
    // Invalidate payment methods cache
    this.cache.invalidate('/payments/methods/')
    
    return this.handleResponse(data, 'Failed to add payment method')
  }

  async removePaymentMethod(methodId) {
    const data = await this.delete(`/payments/methods/${methodId}`)
    
    // Invalidate payment methods cache
    this.cache.invalidate('/payments/methods/')
    
    return this.handleResponse(data, 'Failed to remove payment method')
  }

  async processPayment(paymentData) {
    const sanitizedData = sanitizeFormData(paymentData)
    const data = await this.post('/payments/process/', sanitizedData)
    return this.handleResponse(data, 'Payment processing failed')
  }

  async getPaymentHistory() {
    try {
      const data = await this.get('/payments/history/', true, 3 * 60 * 1000) // 3min cache
      return this.handleArrayResponse(data)
    } catch (error) {
      return []
    }
  }

  async getPaymentDetails(paymentId) {
    const data = await this.get(`/payments/${paymentId}`)
    return this.handleResponse(data, 'Failed to fetch payment details')
  }
}

export default new PaymentService()