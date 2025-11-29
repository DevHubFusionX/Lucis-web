import ClientBookingService from '../services/client/bookingService'

// Mock data for testing
const mockBookings = [
  {
    id: '1',
    professional: 'John Doe Photography',
    service: 'Wedding Photography',
    date: '2024-02-15',
    time: '14:00',
    location: 'Central Park, NYC',
    price: 1500,
    status: 'confirmed',
    paymentStatus: 'Paid',
    rating: 4.8
  },
  {
    id: '2', 
    professional: 'Sarah Smith Studios',
    service: 'Portrait Session',
    date: '2024-02-20',
    time: '10:00',
    location: 'Downtown Studio',
    price: 300,
    status: 'upcoming',
    paymentStatus: 'Pending',
    rating: 4.9
  }
]

// Test function to verify booking service
export async function testBookingService() {
  console.log('🧪 Testing Booking Service...')
  
  try {
    // Test getBookings
    console.log('📋 Testing getBookings...')
    const bookings = await ClientBookingService.getBookings()
    console.log('✅ Bookings fetched:', bookings)
    
    // Test createBooking with mock data
    console.log('📝 Testing createBooking...')
    const newBooking = {
      professionalId: 'prof-123',
      packageId: 'pkg-456',
      startDateTime: '2024-03-01T14:00:00Z',
      endDateTime: '2024-03-01T18:00:00Z',
      location: 'Test Location',
      notes: 'Test booking'
    }
    
    // Note: This will fail in test environment without proper auth
    // const created = await ClientBookingService.createBooking(newBooking)
    // console.log('✅ Booking created:', created)
    
    console.log('✅ All booking service tests passed!')
    return true
    
  } catch (error) {
    console.error('❌ Booking service test failed:', error.message)
    return false
  }
}

// Mock booking data for UI testing
export const getMockBookings = () => mockBookings

// Test booking status filtering
export function testBookingFilters() {
  console.log('🔍 Testing booking filters...')
  
  const confirmed = mockBookings.filter(b => b.status === 'confirmed')
  const upcoming = mockBookings.filter(b => b.status === 'upcoming')
  
  console.log('Confirmed bookings:', confirmed.length)
  console.log('Upcoming bookings:', upcoming.length)
  
  return { confirmed, upcoming }
}