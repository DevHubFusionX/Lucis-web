import BaseApiService from '../api/baseApi'
import { storage } from '../../utils/storage'
import { sanitizeFormData } from '../../utils/securityUtils'

class BookingService extends BaseApiService {
  async createBooking(bookingData) {
    const sanitizedData = sanitizeFormData(bookingData)
    
    console.log('🔍 Creating booking with data:', sanitizedData)
    
    const data = await this.post('/bookings/', sanitizedData)
    
    console.log('✅ Booking created successfully:', data.data)
    return this.handleResponse(data, 'Failed to create booking')
  }

  async getUserBookings() {
    const user = storage.get('user')
    
    try {
      const data = await this.get(`/bookings/users/${user.id}`)
      return this.handleArrayResponse(data)
    } catch (error) {
      if (error.message === 'Booking was not found') {
        return []
      }
      throw error
    }
  }
}

export default new BookingService()