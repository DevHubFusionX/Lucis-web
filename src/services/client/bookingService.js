import BaseApiService from '../api/baseApi'
import { storage } from '../../utils/storage'
import { sanitizeFormData } from '../../utils/securityUtils'

class ClientBookingService extends BaseApiService {
  async createBooking(bookingData) {
    const sanitizedData = sanitizeFormData(bookingData)
    const data = await this.post('/bookings/', sanitizedData)
    
    // Invalidate bookings cache
    this.cache.invalidate(/^\/bookings\/users\//);
    
    return this.handleResponse(data, 'Failed to create booking')
  }

  async getBookings() {
    try {
      const data = await this.get('/bookings/users', true, 2 * 60 * 1000) // 2min cache
      return this.handleArrayResponse(data)
    } catch (error) {
      if (error.message === 'Booking was not found') {
        return []
      }
      throw error
    }
  }

  async getBooking(bookingId) {
    const data = await this.get(`/bookings/users/${bookingId}`)
    return this.handleResponse(data, 'Failed to fetch booking')
  }

  async cancelBooking(bookingId) {
    const data = await this.patch(`/bookings/cancel/${bookingId}`)
    
    // Invalidate bookings cache
    this.cache.invalidate(/^\/bookings\/users\//);
    
    return this.handleResponse(data, 'Failed to cancel booking')
  }

  async updateBooking(bookingId, bookingData) {
    const sanitizedData = sanitizeFormData(bookingData)
    const data = await this.put(`/bookings/${bookingId}`, sanitizedData)
    
    // Invalidate bookings cache
    this.cache.invalidate(/^\/bookings\/users\//);
    
    return this.handleResponse(data, 'Failed to update booking')
  }
}

export default new ClientBookingService()