import BaseApiService from '../api/baseApi'

class ProfessionalBookingService extends BaseApiService {
  async getBookings() {
    try {
      const data = await this.get('/bookings/professionals')
      return this.handleArrayResponse(data)
    } catch (error) {
      if (error.message === 'Booking was not found') {
        return []
      }
      throw error
    }
  }

  async rejectBooking(bookingId) {
    const data = await this.patch(`/bookings/reject/${bookingId}`)
    return this.handleResponse(data, 'Failed to reject booking')
  }

  async acceptBooking(bookingId) {
    const data = await this.patch(`/bookings/accept/${bookingId}`)
    return this.handleResponse(data, 'Failed to accept booking')
  }
}

export default new ProfessionalBookingService()