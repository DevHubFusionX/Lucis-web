'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { ClientBookingService } from '../../../../services/client'
import { theme } from '../../../../lib/theme'
import BookingDetailsModal from '../../../../components/BookingDetailsModal'

const STATUS_CONFIG = {
  confirmed: { bg: '#D1FAE5', color: '#10B981', label: 'Confirmed' },
  upcoming: { bg: theme.colors.primary[100], color: theme.colors.primary[800], label: 'Upcoming' },
  completed: { bg: theme.colors.gray[100], color: theme.colors.gray[600], label: 'Completed' },
  cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Cancelled' }
}

const getStatusConfig = (status) => STATUS_CONFIG[status] || { bg: theme.colors.gray[100], color: theme.colors.gray[600], label: status || 'Unknown' }

const sortBookings = (bookings, sortBy) => {
  return [...bookings].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date)
    const dateB = new Date(b.createdAt || b.date)
    const priceA = a.totalPrice || 0
    const priceB = b.totalPrice || 0

    switch(sortBy) {
      case 'newest': return dateB - dateA
      case 'oldest': return dateA - dateB
      case 'price-low': return priceA - priceB
      case 'price-high': return priceB - priceA
      default: return 0
    }
  })
}

const BookingCard = ({ booking, onViewDetails, loadingBookingId }) => {
  const status = getStatusConfig(booking.status)
  const duration = Math.round((new Date(booking.endDateTime) - new Date(booking.startDateTime)) / 60000)
  const isLoading = loadingBookingId === booking.id

  return (
    <div className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300" style={{backgroundColor: theme.colors.white, border: `1px solid ${theme.colors.gray[200]}`}}>
      <div className="p-5 flex items-start justify-between gap-4" style={{borderBottom: `1px solid ${theme.colors.gray[100]}`}}>
        <div className="flex items-start gap-4 flex-1">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0" style={{backgroundColor: theme.colors.gray[50]}}>
            {booking.professional?.firstName?.charAt(0) || '📷'}
          </div>
          <div>
            <h3 className="text-lg font-bold mb-1" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
              {booking.professional?.firstName} {booking.professional?.lastName}
            </h3>
            <span className="text-sm" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
              Booking #{booking.id.slice(0, 8)}
            </span>
          </div>
        </div>
        <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{backgroundColor: status.bg, color: status.color, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
          {status.label}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h4 className="text-base font-bold mb-3" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Session Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: theme.colors.gray[400]}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium" style={{color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
                {new Date(booking.startDateTime).toLocaleDateString()} at {new Date(booking.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: theme.colors.gray[400]}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium" style={{color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
                {duration} mins
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3" style={{borderTop: `1px solid ${theme.colors.gray[100]}`}}>
          <div>
            <p className="text-xs font-medium mb-0.5" style={{color: theme.colors.gray[400], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Total Price</p>
            <p className="text-2xl font-bold" style={{color: theme.colors.primary[800], fontFamily: theme.typography.fontFamily.display.join(', ')}}>
              ${booking.totalPrice || 0}
            </p>
          </div>
          <button 
            onClick={() => onViewDetails(booking.id)}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50" 
            style={{backgroundColor: theme.colors.primary[800], color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ')}}
          >
            {isLoading ? 'Loading...' : 'View Details'}
          </button>
        </div>
      </div>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-5">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="animate-pulse rounded-2xl p-5" style={{backgroundColor: theme.colors.gray[50]}}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl" style={{backgroundColor: theme.colors.gray[200]}}></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded" style={{backgroundColor: theme.colors.gray[200]}}></div>
            <div className="h-3 rounded w-3/4" style={{backgroundColor: theme.colors.gray[200]}}></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 rounded" style={{backgroundColor: theme.colors.gray[200]}}></div>
          <div className="h-3 rounded w-1/2" style={{backgroundColor: theme.colors.gray[200]}}></div>
        </div>
      </div>
    ))}
  </div>
)

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed" style={{backgroundColor: theme.colors.gray[50], borderColor: theme.colors.gray[200]}}>
    <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: theme.colors.primary[100]}}>
      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: theme.colors.primary[800]}}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </div>
    <h3 className="text-2xl font-bold mb-2" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>No sessions found</h3>
    <p className="text-lg mb-6" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Start by discovering exceptional talent for your next project</p>
    <Link href="/client/search" className="px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all" style={{backgroundColor: theme.colors.primary[800], color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
      Discover Talent
    </Link>
  </div>
)

export default function BookingsPage() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loadingBookingId, setLoadingBookingId] = useState(null)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await ClientBookingService.getBookings()
        setBookings(data || [])
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const handleViewDetails = useCallback(async (bookingId) => {
    setLoadingBookingId(bookingId)
    try {
      const details = await ClientBookingService.getBooking(bookingId)
      setSelectedBooking(details)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Failed to fetch booking details:', error)
      alert('Failed to load booking details')
    } finally {
      setLoadingBookingId(null)
    }
  }, [])

  const filteredBookings = useMemo(() => 
    bookings.filter(b => filterStatus === 'all' || b.status === filterStatus),
    [bookings, filterStatus]
  )

  const sortedBookings = useMemo(() => sortBookings(filteredBookings, sortBy), [filteredBookings, sortBy])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/client" className="hover:underline" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Dashboard</Link>
        <span style={{color: theme.colors.gray[300]}}>/</span>
        <span className="font-medium" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>My Sessions</span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>My Sessions</h1>
          <p className="mt-2 text-lg" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Manage and track your photography sessions</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 transition-all"
          style={{borderColor: theme.colors.gray[200], color: theme.colors.neutral.deepGray, backgroundColor: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ')}}
        >
          <option value="all">All Sessions</option>
          <option value="upcoming">Upcoming</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="p-5 rounded-2xl shadow-sm space-y-5" style={{backgroundColor: theme.colors.white, border: `1px solid ${theme.colors.gray[200]}`}}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>Filters</h3>
              <button 
                onClick={() => { setFilterStatus('all'); setSortBy('newest'); }}
                className="text-sm font-medium hover:underline" 
                style={{color: theme.colors.primary[800], fontFamily: theme.typography.fontFamily.sans.join(', ')}}
              >
                Reset
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{borderColor: theme.colors.gray[200], fontFamily: theme.typography.fontFamily.sans.join(', ')}}
              >
                <option value="newest">Newest → Oldest</option>
                <option value="oldest">Oldest → Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {loading ? (
            <LoadingSkeleton />
          ) : sortedBookings.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-5">
              {sortedBookings.map(booking => (
                <BookingCard 
                  key={booking.id} 
                  booking={booking} 
                  onViewDetails={handleViewDetails}
                  loadingBookingId={loadingBookingId}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BookingDetailsModal 
        booking={selectedBooking} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
