'use client'
import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../../hooks/useAuth'
import { ClientBookingService } from '../../../../services'

export default function BookingsPage() {
  const { user } = useAuth()
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return
      
      try {
        const userBookings = await ClientBookingService.getBookings()
        setBookings(userBookings)
      } catch (error) {
        console.error('Failed to fetch bookings:', error)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user?.id])

  const filteredBookings = useMemo(() => 
    (bookings || []).filter(b => filterStatus === 'all' || b.status === filterStatus),
    [bookings, filterStatus]
  )

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/client" className="hover:underline" style={{color: '#6B7280'}}>Home</Link>
        <span style={{color: '#D1D5DB'}}>/</span>
        <span className="font-medium" style={{color: '#111827'}}>Bookings</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold" style={{color: '#111827'}}>Bookings</h1>
          <p className="mt-2 text-lg" style={{color: '#6B7280'}}>Manage and track your photography sessions</p>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 transition-all"
          style={{borderColor: '#E5E7EB', color: '#111827', backgroundColor: '#FFFFFF'}}
        >
          <option value="all">All Bookings</option>
          <option value="upcoming">Upcoming</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Panel */}
        <div className="lg:col-span-1">
          <div className="p-5 rounded-2xl shadow-sm space-y-5" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold" style={{color: '#111827'}}>Filters</h3>
              <button className="text-sm font-medium hover:underline" style={{color: '#1E3A8A'}}>Clear</button>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Date Range</label>
              <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm mb-2" style={{borderColor: '#E5E7EB'}} />
              <input type="date" className="w-full px-3 py-2 rounded-lg border text-sm" style={{borderColor: '#E5E7EB'}} />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Category</label>
              <div className="space-y-2">
                {['Photography', 'Videography', 'Both'].map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" style={{color: '#1E3A8A'}} />
                    <span className="text-sm" style={{color: '#6B7280'}}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{borderColor: '#E5E7EB'}}
              >
                <option value="newest">Newest → Oldest</option>
                <option value="oldest">Oldest → Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="rating">Rating: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl p-5" style={{backgroundColor: '#F3F4F6'}}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl" style={{backgroundColor: '#E5E7EB'}}></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 rounded" style={{backgroundColor: '#E5E7EB'}}></div>
                      <div className="h-3 rounded w-3/4" style={{backgroundColor: '#E5E7EB'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 rounded" style={{backgroundColor: '#E5E7EB'}}></div>
                    <div className="h-3 rounded w-1/2" style={{backgroundColor: '#E5E7EB'}}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#DBEAFE'}}>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{color: '#111827'}}>You don't have any bookings yet</h3>
              <p className="text-lg mb-6" style={{color: '#6B7280'}}>Start by finding the perfect professional for your needs</p>
              <Link href="/client/search" className="px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all" style={{backgroundColor: '#1E3A8A', color: '#FFFFFF'}}>
                Find a Professional
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredBookings.map(booking => {
                if (!booking || !booking.id) return null
                const isUpcoming = booking.status === 'upcoming' || booking.status === 'confirmed'
                const statusConfig = {
                  confirmed: { bg: '#D1FAE5', color: '#10B981', label: 'Confirmed' },
                  upcoming: { bg: '#DBEAFE', color: '#1E3A8A', label: 'Upcoming' },
                  completed: { bg: '#F3F4F6', color: '#6B7280', label: 'Completed' },
                  cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Cancelled' }
                }
                const status = statusConfig[booking.status] || { bg: '#F3F4F6', color: '#6B7280', label: 'Unknown' }

                return (
                  <div key={booking.id} className="rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
                    {/* Header */}
                    <div className="p-5 flex items-start justify-between gap-4" style={{borderBottom: '1px solid #F3F4F6'}}>
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0" style={{backgroundColor: '#F9FAFB'}}>
                          {booking.image}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold mb-1" style={{color: '#111827'}}>{booking.professional}</h3>
                          <div className="flex items-center gap-1.5 mb-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#F59E0B'}}>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-bold" style={{color: '#111827'}}>{booking.rating}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{backgroundColor: status.bg, color: status.color}}>
                        {status.label}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-4">
                      <div>
                        <h4 className="text-base font-bold mb-3" style={{color: '#111827'}}>{booking.service}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6B7280'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-medium" style={{color: '#374151'}}>{booking.date} at {booking.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6B7280'}}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-medium" style={{color: '#374151'}}>{booking.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3" style={{borderTop: '1px solid #F3F4F6'}}>
                        <div>
                          <p className="text-xs font-medium mb-0.5" style={{color: '#9CA3AF'}}>Total Price</p>
                          <p className="text-2xl font-bold" style={{color: '#1E3A8A'}}>${booking.price}</p>
                          <p className="text-xs font-semibold mt-0.5" style={{color: booking.paymentStatus === 'Paid' ? '#10B981' : '#F59E0B'}}>{booking.paymentStatus}</p>
                        </div>
                        <div className="flex gap-2">
                          {isUpcoming ? (
                            <>
                              <button className="px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all" style={{backgroundColor: '#1E3A8A', color: '#FFFFFF'}}>
                                View Details
                              </button>
                              <button className="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all" style={{backgroundColor: '#F3F4F6', color: '#374151'}}>
                                Message
                              </button>
                            </>
                          ) : booking.status === 'completed' ? (
                            <>
                              <button className="px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all" style={{backgroundColor: '#1E3A8A', color: '#FFFFFF'}}>
                                Leave Review
                              </button>
                              <button className="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all" style={{backgroundColor: '#F3F4F6', color: '#374151'}}>
                                Book Again
                              </button>
                            </>
                          ) : (
                            <button className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm" style={{backgroundColor: '#F3F4F6', color: '#9CA3AF'}} disabled>
                              View Details
                            </button>
                          )}
                        </div>
                      </div>

                      {isUpcoming && (
                        <div className="flex gap-2 pt-2">
                          <button className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all" style={{backgroundColor: '#FEF3C7', color: '#F59E0B'}}>
                            Reschedule
                          </button>
                          <button className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all" style={{backgroundColor: '#FEE2E2', color: '#DC2626'}}>
                            Cancel Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
