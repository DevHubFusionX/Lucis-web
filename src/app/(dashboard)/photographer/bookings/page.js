'use client'
import { useState, useEffect } from 'react'
import { ProfessionalBookingService } from '../../../../services'

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('pending')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [bookings, setBookings] = useState({
    pending: [],
    confirmed: [],
    completed: [],
    cancelled: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await ProfessionalBookingService.getBookings()
        console.log('🔍 DEBUG: Raw bookings data:', data)
        console.log('🔍 DEBUG: Bookings count:', data.length)
        
        // Log each booking's status
        data.forEach((booking, index) => {
          console.log(`🔍 DEBUG: Booking ${index + 1}:`, {
            id: booking.id,
            status: booking.status,
            user: booking.user?.firstName + ' ' + booking.user?.lastName,
            serviceType: booking.serviceType,
            startDateTime: booking.startDateTime
          })
        })
        
        const groupedBookings = {
          pending: data.filter(b => b.status === 'pending') || [],
          confirmed: data.filter(b => b.status === 'accepted' || b.status === 'confirmed') || [],
          completed: data.filter(b => b.status === 'completed') || [],
          cancelled: data.filter(b => b.status === 'cancelled' || b.status === 'rejected') || []
        }
        
        console.log('🔍 DEBUG: Grouped bookings:', {
          pending: groupedBookings.pending.length,
          confirmed: groupedBookings.confirmed.length,
          completed: groupedBookings.completed.length,
          cancelled: groupedBookings.cancelled.length
        })
        
        setBookings(groupedBookings)
      } catch (error) {
        console.error('❌ Failed to fetch bookings:', error)
        // Show empty bookings when API returns "Booking was not found"
        setBookings({
          pending: [],
          confirmed: [],
          completed: [],
          cancelled: []
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  const handleAcceptBooking = async (bookingId) => {
    try {
      await ProfessionalBookingService.acceptBooking(bookingId)
      // Refresh bookings after accepting
      const data = await ProfessionalBookingService.getBookings()
      const groupedBookings = {
        pending: data.filter(b => b.status === 'pending') || [],
        confirmed: data.filter(b => b.status === 'accepted' || b.status === 'confirmed') || [],
        completed: data.filter(b => b.status === 'completed') || [],
        cancelled: data.filter(b => b.status === 'cancelled' || b.status === 'rejected') || []
      }
      setBookings(groupedBookings)
      setSelectedBooking(null)
    } catch (error) {
      console.error('Failed to accept booking:', error)
      alert('Failed to accept booking. Please try again.')
    }
  }

  const handleRejectBooking = async (bookingId) => {
    try {
      await ProfessionalBookingService.rejectBooking(bookingId)
      // Refresh bookings after rejecting
      const data = await ProfessionalBookingService.getBookings()
      const groupedBookings = {
        pending: data.filter(b => b.status === 'pending') || [],
        confirmed: data.filter(b => b.status === 'accepted' || b.status === 'confirmed') || [],
        completed: data.filter(b => b.status === 'completed') || [],
        cancelled: data.filter(b => b.status === 'cancelled' || b.status === 'rejected') || []
      }
      setBookings(groupedBookings)
      setSelectedBooking(null)
    } catch (error) {
      console.error('Failed to reject booking:', error)
      alert('Failed to reject booking. Please try again.')
    }
  }

  const tabs = ['pending', 'confirmed', 'completed', 'cancelled']
  const currentBookings = bookings[activeTab]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{color: '#111827'}}>Bookings</h1>
        <p className="mt-1" style={{color: '#6B7280'}}>Manage your enquiries and confirmed bookings</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 rounded-xl" style={{backgroundColor: '#F3F4F6'}}>
        {tabs.map(tab => {
          const count = bookings[tab].length
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 px-4 py-2.5 font-medium text-sm transition-all rounded-lg"
              style={{
                backgroundColor: activeTab === tab ? '#FFFFFF' : 'transparent',
                color: activeTab === tab ? '#1E3A8A' : '#6B7280',
                boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {count > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                  backgroundColor: activeTab === tab ? '#DBEAFE' : '#E5E7EB',
                  color: activeTab === tab ? '#1E3A8A' : '#6B7280'
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Bookings List */}
      {currentBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#DBEAFE'}}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{color: '#111827'}}>No {activeTab} bookings</h3>
          <p style={{color: '#6B7280'}}>You don't have any {activeTab} bookings yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentBookings.map(booking => (
            <div key={booking.id} className="p-6 rounded-2xl border cursor-pointer hover:shadow-lg transition-all" style={{backgroundColor: '#FFFFFF', borderColor: '#E5E7EB'}} onClick={() => setSelectedBooking(booking)}>
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: '#DBEAFE'}}>
                      <span className="text-lg font-bold" style={{color: '#1E3A8A'}}>{booking.user?.firstName?.[0] || 'U'}{booking.user?.lastName?.[0] || ''}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold" style={{color: '#111827'}}>{booking.user?.firstName} {booking.user?.lastName}</h3>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{backgroundColor: '#DBEAFE', color: '#1E3A8A'}}>
                        {booking.serviceType}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6B7280'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm" style={{color: '#6B7280'}}>{new Date(booking.startDateTime).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6B7280'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm" style={{color: '#6B7280'}}>{new Date(booking.startDateTime).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6B7280'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm" style={{color: '#6B7280'}}>{booking.location}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold mb-3" style={{color: '#1E3A8A'}}>${booking.price}</p>
                  <button className="px-5 py-2 rounded-xl text-sm font-medium hover:shadow-md transition-all" style={{backgroundColor: '#1E3A8A', color: '#FFFFFF'}}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{color: '#111827'}}>Booking Details</h2>
              <button onClick={() => setSelectedBooking(null)} className="hover:opacity-70 transition-opacity" style={{color: '#9CA3AF'}}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Client Info */}
              <div className="p-4 rounded-xl" style={{backgroundColor: '#F9FAFB'}}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color: '#6B7280'}}>Client Information</h3>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6B7280'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span style={{color: '#111827'}}>{selectedBooking.user?.firstName} {selectedBooking.user?.lastName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6B7280'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span style={{color: '#111827'}}>{selectedBooking.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6B7280'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span style={{color: '#111827'}}>{selectedBooking.user?.phone}</span>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div className="p-4 rounded-xl" style={{backgroundColor: '#F9FAFB'}}>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{color: '#6B7280'}}>Event Information</h3>
                <div className="space-y-2.5 text-sm">
                  <p><span className="font-semibold" style={{color: '#374151'}}>Type:</span> <span style={{color: '#111827'}}>{selectedBooking.serviceType}</span></p>
                  <p><span className="font-semibold" style={{color: '#374151'}}>Date:</span> <span style={{color: '#111827'}}>{new Date(selectedBooking.startDateTime).toLocaleDateString()}</span></p>
                  <p><span className="font-semibold" style={{color: '#374151'}}>Time:</span> <span style={{color: '#111827'}}>{new Date(selectedBooking.startDateTime).toLocaleTimeString()} - {new Date(selectedBooking.endDateTime).toLocaleTimeString()}</span></p>
                  <p><span className="font-semibold" style={{color: '#374151'}}>Location:</span> <span style={{color: '#111827'}}>{selectedBooking.location}</span></p>
                </div>
              </div>

              {/* Payment Status */}
              <div className="p-4 rounded-xl" style={{backgroundColor: '#D1FAE5'}}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{color: '#047857'}}>Total Amount</span>
                  <span className="text-2xl font-bold" style={{color: '#10B981'}}>${selectedBooking.price}</span>
                </div>
              </div>

              {/* Booking Status */}
              <div className="p-4 rounded-xl" style={{backgroundColor: selectedBooking.status === 'accepted' ? '#D1FAE5' : selectedBooking.status === 'pending' ? '#FEF3C7' : '#FEE2E2'}}>
                <div className="flex items-center justify-between">
                  <span className="font-semibold" style={{color: selectedBooking.status === 'accepted' ? '#047857' : selectedBooking.status === 'pending' ? '#92400E' : '#DC2626'}}>Booking Status</span>
                  <span className="text-lg font-bold capitalize" style={{color: selectedBooking.status === 'accepted' ? '#10B981' : selectedBooking.status === 'pending' ? '#F59E0B' : '#EF4444'}}>{selectedBooking.status}</span>
                </div>
              </div>

              {/* Actions - Only show for pending bookings */}
              {selectedBooking.status === 'pending' && (
                <div className="flex space-x-3 pt-2">
                  <button 
                    onClick={() => handleRejectBooking(selectedBooking.id)}
                    className="flex-1 px-4 py-3 rounded-xl border font-medium hover:bg-gray-50 transition-colors" 
                    style={{borderColor: '#E5E7EB', color: '#374151'}}
                  >
                    Decline
                  </button>
                  <button 
                    onClick={() => handleAcceptBooking(selectedBooking.id)}
                    className="flex-1 px-4 py-3 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition-all" 
                    style={{backgroundColor: '#1E3A8A'}}
                  >
                    Accept
                  </button>
                </div>
              )}

              {selectedBooking.status === 'accepted' && (
                <button className="w-full px-4 py-3 rounded-xl border font-medium hover:bg-gray-50 transition-colors" style={{borderColor: '#E5E7EB', color: '#1E3A8A'}}>
                  💬 Contact Client
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}