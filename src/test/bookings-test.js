// Test file to debug bookings API
// Run this in browser console or as a standalone test

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || ''''

async function testBookingsAPI () {
  // Get token from localStorage (adjust based on your storage implementation)
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  if (!token) {
    console.error('No token found. Please login first.')
    return
  }

  console.log('Testing bookings API...')
  console.log('Token:', token.substring(0, 20) + '...')
  console.log('API URL:', `${API_BASE_URL}/bookings/professionals`)

  try {
    const response = await fetch(`${API_BASE_URL}/bookings/professionals`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('Response status:', response.status)
    console.log(
      'Response headers:',
      Object.fromEntries(response.headers.entries())
    )

    const data = await response.json()
    console.log('Raw response data:', data)
    console.log('Data type:', typeof data)
    console.log('Data.data type:', typeof data.data)
    console.log('Is data.data an array?', Array.isArray(data.data))

    if (data.data) {
      console.log('Data.data contents:', data.data)
      if (data.data.records) {
        console.log('Found records:', data.data.records)
        console.log('Records is array?', Array.isArray(data.data.records))
      }
    }

    if (!response.ok || data.error) {
      console.error('API Error:', data.message || 'Unknown error')
      return
    }

    // Test the processing logic
    let bookings = []
    if (data.data?.records) {
      bookings = data.data.records
    } else if (Array.isArray(data.data)) {
      bookings = data.data
    } else {
      bookings = []
    }

    console.log('Processed bookings:', bookings)
    console.log('Bookings count:', bookings.length)

    // Test grouping
    const groupedBookings = {
      pending: bookings.filter(b => b.status === 'pending') || [],
      confirmed: bookings.filter(b => b.status === 'confirmed') || [],
      completed: bookings.filter(b => b.status === 'completed') || [],
      cancelled: bookings.filter(b => b.status === 'cancelled') || []
    }

    console.log('Grouped bookings:', groupedBookings)
  } catch (error) {
    console.error('Fetch error:', error)
  }
}

// Auto-run the test
testBookingsAPI()

// Also export for manual testing
window.testBookingsAPI = testBookingsAPI
