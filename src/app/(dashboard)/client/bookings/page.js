'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { ClientBookingService } from '../../../../services/client'
import { theme } from '../../../../lib/theme'
import BookingDetailsModal from '../../../../components/BookingDetailsModal'
import { Calendar, MapPin, Clock, DollarSign, ChevronRight, Camera, Search, Filter } from 'lucide-react'

const STATUS_CONFIG = {
  confirmed: { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', label: 'Confirmed', border: 'rgba(34, 197, 94, 0.2)' },
  upcoming: { bg: theme.colors.primary[50], color: theme.colors.primary[600], label: 'Upcoming', border: theme.colors.primary[100] },
  completed: { bg: theme.colors.gray[50], color: theme.colors.gray[500], label: 'Completed', border: theme.colors.gray[100] },
  cancelled: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'Cancelled', border: 'rgba(239, 68, 68, 0.2)' }
}

const getStatusConfig = (status) => STATUS_CONFIG[status?.toLowerCase()] || { bg: theme.colors.gray[50], color: theme.colors.gray[500], label: status || 'Unknown', border: theme.colors.gray[100] }

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
  const statusConfig = getStatusConfig(booking.status)
  const duration = Math.round((new Date(booking.endDateTime) - new Date(booking.startDateTime)) / 60000)
  const isLoading = loadingBookingId === booking.id
  const dateObj = new Date(booking.startDateTime)

  return (
    <div className="bg-white rounded-lg border hover:shadow-md transition-all duration-200 overflow-hidden" style={{ borderColor: theme.colors.gray[200] }}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Date */}
          <div className="flex-shrink-0">
            <div className="text-center">
              <div className="text-sm font-medium" style={{ color: theme.colors.gray[500] }}>
                {dateObj.toLocaleDateString(undefined, { month: 'short' })}
              </div>
              <div className="text-3xl font-semibold text-gray-900">
                {dateObj.getDate()}
              </div>
              <div className="text-xs" style={{ color: theme.colors.gray[400] }}>
                {dateObj.toLocaleDateString(undefined, { year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Professional Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {booking.professional?.profilePicture ? (
                  <img src={booking.professional.profilePicture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ color: theme.colors.gray[300] }}>
                    <Camera size={24} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium mb-1" style={{ color: theme.colors.primary[600] }}>
                  {booking.serviceType || 'Photography Session'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {booking.professional?.firstName} {booking.professional?.lastName}
                </h3>
                
                <div className="flex flex-wrap gap-4 text-sm" style={{ color: theme.colors.gray[600] }}>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{typeof duration === 'number' && !isNaN(duration) ? duration : 60} min</span>
                  </div>
                  {booking.location && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="truncate">{booking.location.address || 'TBD'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status & Price */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4">
            <div className="text-right">
              <div className="text-2xl font-semibold text-gray-900 mb-2">
                ₦{(booking.price || booking.totalPrice || 0).toLocaleString()}
              </div>
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: statusConfig.bg, color: statusConfig.color }}
              >
                {statusConfig.label}
              </span>
            </div>
            
            <button 
              onClick={() => onViewDetails(booking.id)}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: theme.colors.primary[700] }}
            >
              {isLoading ? 'Loading...' : 'View Details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-[2.5rem] p-6 border border-gray-100 flex flex-col md:flex-row gap-6 animate-pulse">
         <div className="w-20 h-24 bg-gray-50 rounded-2xl shrink-0"></div>
         <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
               <div className="w-16 h-16 bg-gray-50 rounded-2xl"></div>
               <div className="flex-1 space-y-2 py-2">
                 <div className="w-24 h-3 bg-gray-50 rounded"></div>
                 <div className="w-32 h-5 bg-gray-50 rounded"></div>
               </div>
            </div>
            <div className="space-y-3 py-2">
               <div className="w-32 h-4 bg-gray-50 rounded"></div>
               <div className="w-40 h-4 bg-gray-50 rounded"></div>
            </div>
         </div>
         <div className="w-full md:w-32 flex flex-col items-end gap-3">
            <div className="w-20 h-6 bg-gray-50 rounded-full"></div>
            <div className="w-24 h-8 bg-gray-50 rounded"></div>
         </div>
      </div>
    ))}
  </div>
)

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
    <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
      <Camera className="w-12 h-12 text-blue-500" />
    </div>
    <h3 className="text-2xl font-black text-gray-900 mb-3" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>No sessions yet</h3>
    <p className="text-lg text-gray-400 mb-8 max-w-md font-medium">You haven't booked any photography sessions yet. Start exploring to find the perfect professional for your next event.</p>
    <Link 
      href="/client/search" 
      className="px-8 py-4 rounded-2xl font-black text-sm text-white shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-2"
      style={{ backgroundColor: theme.colors.primary[900] }}
    >
      <Search size={20} />
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

  const filteredBookings = useMemo(() => {
    const now = new Date()
    
    // Separate bookings into upcoming and past
    const upcomingBookings = bookings.filter(b => new Date(b.startDateTime) >= now)
    const pastBookings = bookings.filter(b => new Date(b.startDateTime) < now)
    
    if (filterStatus === 'all') return [...upcomingBookings, ...pastBookings]
    if (filterStatus === 'upcoming') return upcomingBookings.filter(b => b.status === 'pending' || b.status === 'accepted' || b.status === 'confirmed')
    if (filterStatus === 'past') return pastBookings
    if (filterStatus === 'confirmed') return bookings.filter(b => b.status === 'accepted' || b.status === 'confirmed')
    return bookings.filter(b => b.status === filterStatus)
  }, [bookings, filterStatus])

  const sortedBookings = useMemo(() => sortBookings(filteredBookings, sortBy), [filteredBookings, sortBy])

  return (
    <div className="min-h-full bg-gray-50/50 font-sans p-4 sm:p-6 lg:p-10 pb-32">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-1" style={{ fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
              My Bookings
            </h1>
            <p className="text-sm text-gray-500">
              Manage and track your photography sessions
            </p>
          </div>
          
          <Link 
            href="/client/search" 
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ backgroundColor: theme.colors.primary[700] }}
          >
            <Search size={18} />
            Book Session
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['all', 'upcoming', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all whitespace-nowrap ${
                filterStatus === status 
                  ? 'text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              style={filterStatus === status ? { backgroundColor: theme.colors.primary[700] } : {}}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sort */}
            <div className="bg-white p-6 rounded-lg border" style={{ borderColor: theme.colors.gray[200] }}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ borderColor: theme.colors.gray[200], focusRing: theme.colors.primary[500] }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Stats */}
            <div className="bg-white p-6 rounded-lg border" style={{ borderColor: theme.colors.gray[200] }}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs" style={{ color: theme.colors.gray[500] }}>Total Spent</div>
                  <div className="text-2xl font-semibold text-gray-900">
                    ₦{bookings.reduce((sum, b) => sum + (b.price || b.totalPrice || 0), 0).toLocaleString()}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: theme.colors.gray[100] }}>
                  <div>
                    <div className="text-xs" style={{ color: theme.colors.gray[500] }}>Completed</div>
                    <div className="text-xl font-semibold text-gray-900">{bookings.filter(b => b.status === 'completed').length}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: theme.colors.gray[500] }}>Upcoming</div>
                    <div className="text-xl font-semibold text-gray-900">{bookings.filter(b => b.status === 'upcoming' || b.status === 'confirmed' || b.status === 'accepted').length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="lg:col-span-3">
             {loading ? (
                <div className="flex flex-col gap-4">
                   <LoadingSkeleton />
                </div>
             ) : sortedBookings.length > 0 ? (
                <div className="flex flex-col gap-4">
                   {sortedBookings.map(booking => (
                     <BookingCard 
                       key={booking.id} 
                       booking={booking} 
                       onViewDetails={handleViewDetails}
                       loadingBookingId={loadingBookingId}
                     />
                   ))}
                </div>
             ) : (
                <EmptyState />
             )}
          </div>
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
