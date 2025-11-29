'use client'
import { useEffect, useState } from 'react'
import {
  testBookingService,
  getMockBookings
} from '../../test/booking-service.test'

export default function TestBookingsPage () {
  const [testResults, setTestResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runTests = async () => {
      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        ''''
      const token = localStorage.getItem('token')
      const results = []

      // Test 1: Check token and user
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      results.push({
        test: 'Auth Check',
        status: token && user.id ? 'PASS' : 'FAIL',
        message: token
          ? user.id
            ? `Token and user ID (${user.id}) found`
            : 'Token found but no user ID'
          : 'No token found'
      })

      if (!token) {
        setTestResults(results)
        setLoading(false)
        return
      }

      // Test 2: User bookings endpoint
      if (user.id) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/bookings/users/${user.id}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          results.push({
            test: 'User Bookings API',
            status: response.ok ? 'PASS' : 'FAIL',
            message: `Status: ${response.status} for user ${user.id}`,
            data: response.ok ? await response.json() : null
          })
        } catch (error) {
          results.push({
            test: 'User Bookings API',
            status: 'ERROR',
            message: error.message
          })
        }
      } else {
        results.push({
          test: 'User Bookings API',
          status: 'SKIP',
          message: 'No user ID found in storage'
        })
      }

      // Test 3: Professional bookings endpoint
      try {
        const response = await fetch(`${API_BASE_URL}/bookings/professionals`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        results.push({
          test: 'Professional Bookings API',
          status: response.ok ? 'PASS' : 'FAIL',
          message: `Status: ${response.status}`,
          data: response.ok ? await response.json() : null
        })
      } catch (error) {
        results.push({
          test: 'Professional Bookings API',
          status: 'ERROR',
          message: error.message
        })
      }

      // Test 4: Mock data
      const mockBookings = getMockBookings()
      results.push({
        test: 'Mock Bookings Data',
        status: 'PASS',
        message: `${mockBookings.length} mock bookings loaded`,
        data: mockBookings
      })

      setTestResults(results)
      setLoading(false)
    }

    runTests()
  }, [])

  return (
    <div className='p-8 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-bold mb-6'>Bookings API Test Suite</h1>

      {loading ? (
        <div className='flex items-center gap-2'>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
          <span>Running tests...</span>
        </div>
      ) : (
        <div className='space-y-4'>
          {testResults.map((result, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                result.status === 'PASS'
                  ? 'bg-green-50 border-green-200'
                  : result.status === 'FAIL'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}
            >
              <div className='flex items-center gap-2 mb-2'>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    result.status === 'PASS'
                      ? 'bg-green-100 text-green-800'
                      : result.status === 'FAIL'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {result.status}
                </span>
                <h3 className='font-semibold'>{result.test}</h3>
              </div>
              <p className='text-sm text-gray-600 mb-2'>{result.message}</p>
              {result.data && (
                <details className='text-xs'>
                  <summary className='cursor-pointer font-medium'>
                    View Data
                  </summary>
                  <pre className='mt-2 p-2 bg-gray-100 rounded overflow-auto'>
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
