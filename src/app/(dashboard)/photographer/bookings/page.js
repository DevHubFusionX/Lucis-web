'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProfessionalBookingService } from '../../../../services'
import { theme } from '../../../../lib/theme'
import Notification from '../../../../components/ui/Notification'
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  User,
  Mail,
  Phone,
  X,
  Check,
  MessageSquare,
  Filter,
  Search,
  ChevronRight,
  AlertCircle,
  Loader2
} from 'lucide-react'

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [bookings, setBookings] = useState({
    pending: [],
    confirmed: [],
    completed: [],
    cancelled: []
  })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetchBookings()
  }, [])

  const addNotification = (type, title, message) => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, type, title, message }])
    setTimeout(() => removeNotification(id), 5000)
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await ProfessionalBookingService.getBookings()

      console.log('📋 Fetched bookings:', data)

      const groupedBookings = {
        pending: data.filter(b => b.status === 'pending') || [],
        confirmed: data.filter(b => b.status === 'accepted' || b.status === 'confirmed') || [],
        completed: data.filter(b => b.status === 'completed') || [],
        cancelled: data.filter(b => b.status === 'cancelled' || b.status === 'rejected') || []
      }

      setBookings(groupedBookings)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      addNotification('error', 'Error', 'Failed to load bookings. Please try again.')
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

  const handleAcceptBooking = async (bookingId) => {
    try {
      setActionLoading(true)
      await ProfessionalBookingService.acceptBooking(bookingId)
      addNotification('success', 'Booking Accepted', 'The booking has been successfully accepted.')
      await fetchBookings()
      setSelectedBooking(null)
    } catch (error) {
      console.error('Failed to accept booking:', error)
      addNotification('error', 'Action Failed', 'Failed to accept booking. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRejectBooking = async (bookingId) => {
    try {
      setActionLoading(true)
      await ProfessionalBookingService.rejectBooking(bookingId)
      addNotification('info', 'Booking Declined', 'The booking has been declined.')
      await fetchBookings()
      setSelectedBooking(null)
    } catch (error) {
      console.error('Failed to reject booking:', error)
      addNotification('error', 'Action Failed', 'Failed to decline booking. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const tabs = [
    { id: 'all', label: 'All', icon: Calendar, color: theme.colors.primary[500] },
    { id: 'upcoming', label: 'Upcoming', icon: Clock, color: '#2563eb' },
    { id: 'past', label: 'Past', icon: Calendar, color: '#6b7280' },
    { id: 'pending', label: 'Pending', icon: AlertCircle, color: '#d97706' },
    { id: 'confirmed', label: 'Confirmed', icon: Check, color: '#16a34a' },
    { id: 'cancelled', label: 'Cancelled', icon: X, color: '#dc2626' }
  ]

  const getFilteredBookings = () => {
    const allBookings = [...bookings.pending, ...bookings.confirmed, ...bookings.completed, ...bookings.cancelled]
    const now = new Date()

    let filtered = []

    if (activeTab === 'all') {
      filtered = allBookings
    } else if (activeTab === 'upcoming') {
      filtered = allBookings.filter(b => new Date(b.startDateTime) >= now)
    } else if (activeTab === 'past') {
      filtered = allBookings.filter(b => new Date(b.startDateTime) < now)
    } else {
      filtered = bookings[activeTab]
    }

    return filtered.filter(booking =>
      booking.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceType?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  const filteredBookings = getFilteredBookings()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: theme.colors.accent[500], borderTopColor: 'transparent' }}
        />
        <p className="text-gray-500 font-medium animate-pulse">Loading bookings...</p>
      </div>
    )
  }

  return (
    <>
      <Notification notifications={notifications} onClose={removeNotification} />
      <div className="space-y-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-3xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              Bookings
            </h1>
            <p className="text-gray-600">Manage your enquiries and schedule</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-gray-200 bg-white focus:ring-2 focus:ring-opacity-20 transition-all outline-none"
              style={{
                borderColor: 'transparent',
                boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                ['--tw-ring-color']: theme.colors.accent[500]
              }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-2">
          {tabs.map(tab => {
            const allBookings = [...bookings.pending, ...bookings.confirmed, ...bookings.completed, ...bookings.cancelled]
            const now = new Date()

            let count = 0
            if (tab.id === 'all') {
              count = allBookings.length
            } else if (tab.id === 'upcoming') {
              count = allBookings.filter(b => new Date(b.startDateTime) >= now).length
            } else if (tab.id === 'past') {
              count = allBookings.filter(b => new Date(b.startDateTime) < now).length
            } else {
              count = bookings[tab.id]?.length || 0
            }

            const isActive = activeTab === tab.id
            const Icon = tab.icon

            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300
                ${isActive ? 'shadow-md transform scale-105' : 'hover:bg-white hover:shadow-sm'}
              `}
                style={{
                  backgroundColor: isActive ? 'white' : 'transparent',
                  color: isActive ? tab.color : '#6B7280'
                }}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
                {count > 0 && (
                  <span
                    className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor: isActive ? `${tab.color}15` : '#E5E7EB',
                      color: isActive ? tab.color : '#6B7280'
                    }}
                  >
                    {count}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* Bookings Grid */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredBookings.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-20 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50/50"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: theme.colors.accent[50] }}
                >
                  <Calendar className="w-10 h-10" style={{ color: theme.colors.accent[500] }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No {activeTab} bookings</h3>
                <p className="text-gray-500">You don't have any {activeTab} bookings matching your search.</p>
              </motion.div>
            ) : (
              filteredBookings.map(booking => {
                console.log('💳 Card booking:', booking.id, 'price:', booking.price, 'totalPrice:', booking.totalPrice)
                return (
                  <motion.div
                    key={booking.id}
                    variants={itemVariants}
                    onClick={() => setSelectedBooking(booking)}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Visual Status Indicator */}
                    <div
                      className="absolute top-0 right-0 w-24 h-24 -mr-10 -mt-10 rounded-full opacity-10 transition-transform group-hover:scale-150"
                      style={{ backgroundColor: tabs.find(t => t.id === activeTab).color }}
                    />

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          {booking.user?.profilePicture?.url ? (
                            <img
                              src={booking.user.profilePicture.url}
                              alt={`${booking.user.firstName} ${booking.user.lastName}`}
                              className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-gray-100"
                            />
                          ) : (
                            <div
                              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg"
                              style={{
                                background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})`
                              }}
                            >
                              {booking.user?.firstName?.[0] || '?'}{booking.user?.lastName?.[0] || ''}
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">
                              {booking.user?.firstName || 'Unknown'} {booking.user?.lastName || 'User'}
                            </h3>
                            <span
                              className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600"
                            >
                              {booking.serviceType}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="p-2 rounded-lg bg-gray-50 text-gray-500">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <span className="font-medium">{new Date(booking.startDateTime).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="p-2 rounded-lg bg-gray-50 text-gray-500">
                            <Clock className="w-4 h-4" />
                          </div>
                          <span className="font-medium">
                            {new Date(booking.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="p-2 rounded-lg bg-gray-50 text-gray-500">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <span className="font-medium truncate">{booking.location}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold" style={{ color: theme.colors.accent[600] }}>₦</span>
                          <span className="text-2xl font-bold" style={{ color: theme.colors.accent[600] }}>{(booking.price || booking.totalPrice || 0).toLocaleString()}</span>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-semibold text-gray-400 group-hover:text-gray-900 transition-colors">
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        </AnimatePresence>

        {/* Booking Details Modal */}
        <AnimatePresence>
          {selectedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedBooking(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div>
                    <h2
                      className="text-2xl font-bold text-gray-900"
                      style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                    >
                      Booking Details
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">ID: #{selectedBooking.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                  {/* Client Section */}
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                      <User className="w-4 h-4" /> Client Information
                    </h3>
                    <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4">
                        {selectedBooking.user?.profilePicture?.url ? (
                          <img
                            src={selectedBooking.user.profilePicture.url}
                            alt={`${selectedBooking.user.firstName} ${selectedBooking.user.lastName}`}
                            className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"
                          />
                        ) : (
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md"
                            style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
                          >
                            {selectedBooking.user?.firstName?.[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900 text-lg">
                            {selectedBooking.user?.firstName} {selectedBooking.user?.lastName}
                          </p>
                          <p className="text-gray-500 text-sm">Client</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{selectedBooking.user?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{selectedBooking.user?.phone || 'No phone provided'}</span>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Event Details */}
                  <section>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Event Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <p className="text-sm text-gray-500 mb-1">Service Type</p>
                        <p className="font-bold text-gray-900">{selectedBooking.serviceType}</p>
                      </div>
                      <div className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
                        <p className="text-sm text-gray-500 mb-1">Date & Time</p>
                        <p className="font-bold text-gray-900">
                          {new Date(selectedBooking.startDateTime).toLocaleDateString()}
                          <span className="text-gray-400 mx-2">|</span>
                          {new Date(selectedBooking.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors col-span-full">
                        <p className="text-sm text-gray-500 mb-1">Location</p>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <p className="font-bold text-gray-900">{selectedBooking.location}</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Status & Price */}
                  <section>
                    <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-white border border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Total Amount</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold" style={{ color: theme.colors.accent[600] }}>₦</span>
                          <p className="text-4xl font-bold" style={{ color: theme.colors.accent[600], fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                            {(selectedBooking.price || selectedBooking.totalPrice || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span
                        className="px-4 py-2 rounded-xl text-sm font-bold capitalize shadow-sm"
                        style={{
                          backgroundColor: `${tabs.find(t => t.id === selectedBooking.status)?.color || theme.colors.gray[500]}20`,
                          color: tabs.find(t => t.id === selectedBooking.status)?.color || theme.colors.gray[600]
                        }}
                      >
                        {selectedBooking.status}
                      </span>
                    </div>
                  </section>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
                  {selectedBooking.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleRejectBooking(selectedBooking.id)}
                        disabled={actionLoading}
                        className="px-6 py-3 rounded-xl font-bold bg-white text-red-500 border border-red-100 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {actionLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Decline Booking
                      </button>
                      <button
                        onClick={() => handleAcceptBooking(selectedBooking.id)}
                        disabled={actionLoading}
                        className="px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-green-200 hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        style={{ background: '#16a34a' }}
                      >
                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        {actionLoading ? 'Processing...' : 'Accept Booking'}
                      </button>
                    </>
                  ) : (
                    <button
                      className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:shadow-xl flex items-center justify-center gap-2 hover:translate-y-[-2px]"
                      style={{ background: theme.colors.accent[500] }}
                    >
                      <MessageSquare className="w-5 h-5" />
                      Message Client
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}