'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Clock,
  ChevronRight,
  Camera,
  Search,
  Filter,
  Loader2,
  ArrowUpRight,
  ArrowRight,
  CreditCard,
  CheckCircle2,
  Check,
  XCircle,
  Clock3,
  SlidersHorizontal,
  X,
  CreditCard as PaymentIcon,
  ShoppingBag
} from 'lucide-react'

import { useClientBookings } from '../../../../hooks/useBookings'
import { theme } from '../../../../lib/theme'
import BookingDetailsModal from '../../../../components/BookingDetailsModal'

const STATUS_CONFIG = {
  confirmed: {
    bg: '#ecfdf5',
    color: '#059669',
    label: 'Confirmed',
    icon: CheckCircle2,
  },
  upcoming: {
    bg: '#eff6ff',
    color: '#2563eb',
    label: 'Upcoming',
    icon: Clock3,
  },
  completed: {
    bg: '#f8fafc',
    color: '#64748b',
    label: 'Completed',
    icon: CheckCircle2,
  },
  cancelled: {
    bg: '#fef2f2',
    color: '#dc2626',
    label: 'Cancelled',
    icon: XCircle,
  },
  pending: {
    bg: '#fff7ed',
    color: '#ea580c',
    label: 'Pending',
    icon: Clock3,
  }
}

const getStatusConfig = (status) => STATUS_CONFIG[status?.toLowerCase()] || {
  bg: '#f8fafc',
  color: '#64748b',
  label: status || 'Unknown',
  icon: Clock3,
}

const FilterSection = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-400" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>{title}</h3>
    {children}
  </div>
)

const BookingCard = ({ booking, onClick }) => {
  const statusConfig = getStatusConfig(booking.status)
  const dateObj = new Date(booking.startDateTime)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 flex flex-col md:flex-row cursor-pointer"
      onClick={onClick}
    >
      {/* Visual Area */}
      <div className="relative h-48 md:h-auto md:w-64 shrink-0 bg-gray-50 overflow-hidden">
        {booking.professional?.profilePicture?.url ? (
          <Image
            fill
            src={booking.professional.profilePicture.url}
            alt=""
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 256px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <Camera size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-black/20"></div>

        {/* Date Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-2xl p-2.5 min-w-[60px] text-center shadow-lg">
          <p className="text-[10px] font-bold uppercase text-gray-400 leading-none mb-1">{dateObj.toLocaleDateString(undefined, { month: 'short' })}</p>
          <p className="text-xl font-black text-gray-900 leading-none">{dateObj.getDate().toString().padStart(2, '0')}</p>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-white/20"
            style={{ backgroundColor: statusConfig.bg + 'CC', color: statusConfig.color }}
          >
            <statusConfig.icon size={14} />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: theme.colors.accent[500] }}>
              {booking.serviceType || 'Photography Session'}
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 truncate" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
              {booking.professional?.firstName} {booking.professional?.lastName}
            </h3>
          </div>
          <div className="text-right ml-4">
            <p className="text-2xl font-black text-gray-900">₦{(booking.totalPrice || 0).toLocaleString()}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Price</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
            <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
              <Clock size={16} />
            </div>
            <span>{dateObj.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })} • {booking.package?.duration || 60} mins</span>
          </div>
          {booking.location && (
            <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
              <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                <MapPin size={16} />
              </div>
              <span className="truncate">{booking.location.address || 'Location TBD'}</span>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
          <p className="text-xs text-gray-400 font-medium tracking-wide">
            Booked on {new Date(booking.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:gap-2 transition-all">
            View details <ArrowRight size={14} />
          </div>
        </div>

      </div>
    </motion.div>
  )
}

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
    <div className="p-4 rounded-2xl" style={{ backgroundColor: color + '10', color: color }}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-xl font-black text-gray-900">{value}</p>
    </div>
  </div>
)

export default function BookingsPage() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const { data: bookings = [], isLoading } = useClientBookings()

  const sortedBookings = useMemo(() => {
    let result = [...bookings]

    if (filterStatus !== 'all') {
      if (filterStatus === 'upcoming') {
        result = result.filter(b => new Date(b.startDateTime) >= new Date() && b.status !== 'cancelled')
      } else if (filterStatus === 'past') {
        result = result.filter(b => new Date(b.startDateTime) < new Date())
      } else {
        result = result.filter(b => b.status === filterStatus)
      }
    }

    return result.sort((a, b) => {
      const dateA = new Date(a.startDateTime)
      const dateB = new Date(b.startDateTime)
      if (sortBy === 'newest') return dateB - dateA
      if (sortBy === 'oldest') return dateA - dateB
      if (sortBy === 'price-high') return b.totalPrice - a.totalPrice
      if (sortBy === 'price-low') return a.totalPrice - b.totalPrice
      return 0
    })
  }, [bookings, filterStatus, sortBy])

  const stats = useMemo(() => ({
    total: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    count: bookings.length,
    upcoming: bookings.filter(b => new Date(b.startDateTime) >= new Date() && b.status !== 'cancelled').length
  }), [bookings])

  return (
    <div className="flex flex-col md:flex-row font-sans min-h-screen bg-gray-50/30" style={{ fontFamily: theme.typography.fontFamily.sans.join(', ') }}>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden sticky top-4 z-40 px-4 pt-4">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="w-full text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center justify-center gap-2 min-h-[48px] active:scale-95 transition-transform"
          style={{ backgroundColor: theme.colors.primary[900] }}
        >
          <SlidersHorizontal size={20} />
          <span>Filters & Stats</span>
        </button>
      </div>

      {/* Sidebar - Matches Search Style */}
      <AnimatePresence>
        {(showMobileFilters || true) && (
          <aside className={`fixed inset-y-0 left-0 z-50 w-full sm:w-80 bg-white border-r border-gray-100 transform transition-transform duration-300 md:translate-x-0 md:relative md:block ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="h-full overflow-y-auto p-8">
              <div className="flex items-center justify-between mb-8 md:hidden">
                <h2 className="text-xl font-bold" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>Overview</h2>
                <button onClick={() => setShowMobileFilters(false)}><X /></button>
              </div>

              <div className="space-y-8">
                {/* Stats in Sidebar */}
                <FilterSection title="Account Overview">
                  <div className="space-y-4">
                    <div className="p-5 bg-blue-50/50 rounded-3xl border border-blue-100">
                      <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Total Booked</p>
                      <p className="text-2xl font-black text-blue-900">₦{stats.total.toLocaleString()}</p>
                    </div>
                    <div className="p-5 bg-orange-50/50 rounded-3xl border border-orange-100">
                      <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest mb-1">Upcoming Events</p>
                      <p className="text-2xl font-black text-orange-900">{stats.upcoming}</p>
                    </div>
                  </div>
                </FilterSection>

                <FilterSection title="Status Filter">
                  <div className="flex flex-col gap-1">
                    {['all', 'upcoming', 'past', 'confirmed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold capitalize transition-all ${filterStatus === status
                          ? 'bg-gray-900 text-white shadow-lg'
                          : 'text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        {status}
                        {filterStatus === status && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Sort Bookings">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-700 appearance-none focus:ring-2 ring-blue-500/10 cursor-pointer"
                  >
                    <option value="newest">Most Recent</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-high">Highest Price</option>
                    <option value="price-low">Lowest Price</option>
                  </select>
                </FilterSection>
              </div>

              {showMobileFilters && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full text-white py-4 rounded-xl font-bold shadow-lg"
                    style={{ backgroundColor: theme.colors.primary[900] }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 lg:p-12">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <header className="mb-10 md:mb-14">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
              My Bookings
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <ShoppingBag size={18} className="text-gray-400" />
                <span>{stats.count} total sessions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 font-medium">
                <Calendar size={18} className="text-gray-400" />
                <span>{stats.upcoming} upcoming</span>
              </div>
            </div>
          </header>

          {/* Bookings List */}
          <div className="space-y-6 md:space-y-8">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
              ))
            ) : sortedBookings.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {sortedBookings.map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onClick={() => {
                      setSelectedBooking(booking)
                      setIsModalOpen(true)
                    }}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                  <Camera size={32} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>No bookings yet</h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't booked any sessions yet. Find the perfect professional to capture your next moment.</p>
                <Link
                  href="/client/search"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:-translate-y-1 transition-all"
                >
                  Start Exploring <ArrowRight size={18} />
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
