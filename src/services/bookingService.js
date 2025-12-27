import httpClient from './api/httpClient'
import { storage } from '../utils/storage'

/**
 * Service for booking operations
 */
class BookingService {
  /**
   * Create a new booking
   */
  async createBooking(bookingData) {
    console.log('🔍 Creating booking with data:', bookingData)

    const data = await httpClient.post('/bookings/', bookingData, {
      requestId: 'create-booking',
      retryAttempts: 1 // Only retry once for mutations
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to create booking')
    }

    console.log('✅ Booking created successfully:', data.data)
    return data.data
  }

  /**
   * Get user's bookings
   */
  async getUserBookings() {
    const user = storage.get('user')
    
    if (!user?.id) {
      throw new Error('User not found')
    }

    const endpoint = `/bookings/users/${user.id}`

    const data = await httpClient.get(endpoint, {
      requestId: 'user-bookings',
      retryAttempts: 2
    })

    // Handle "not found" gracefully
    if (data.error && data.message === 'Booking was not found') {
      return []
    }

    if (data.error) {
      throw new Error(data.message || 'Failed to fetch bookings')
    }

    // Handle different response formats
    if (data.data?.records) {
      return data.data.records
    }
    
    return Array.isArray(data.data) ? data.data : []
  }

  /**
   * Cancel user bookings cache
   */
  cancelBookingRequests() {
    httpClient.cancelRequest('user-bookings')
    httpClient.cancelRequest('create-booking')
  }
}

export default new BookingService()