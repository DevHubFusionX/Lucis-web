import { storage } from '../utils/storage'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

class BookingService {
  getToken() {
    return storage.get('token')
  }

  async createBooking(bookingData) {
    const token = this.getToken()
    
    console.log('🔍 Creating booking with data:', bookingData)
    console.log('🔑 Using token:', token ? 'Present' : 'Missing')
    
    const response = await fetch(`${API_BASE_URL}/bookings/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })

    const data = await response.json()
    
    console.log('📡 Booking API Response:', {
      status: response.status,
      ok: response.ok,
      data: data
    })
    
    if (!response.ok || data.error) {
      console.error('❌ Booking failed:', data)
      throw new Error(data.message || 'Failed to create booking')
    }

    console.log('✅ Booking created successfully:', data.data)
    return data.data
  }

  async getUserBookings() {
    const token = this.getToken()
    const user = storage.get('user')
    
    const response = await fetch(`${API_BASE_URL}/bookings/users/${user.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      if (data.message === 'Booking was not found') {
        return []
      }
      throw new Error(data.message || 'Failed to fetch bookings')
    }

    if (data.data?.records) {
      return data.data.records
    }
    
    return Array.isArray(data.data) ? data.data : []
  }
}

export default new BookingService()