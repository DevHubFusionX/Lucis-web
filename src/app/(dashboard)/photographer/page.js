'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { theme } from '../../../lib/theme'
import { useProfessionalDashboard } from '../../../hooks/useProfessional'
import {
  Calendar,
  DollarSign,
  Eye,
  MessageSquare,
  TrendingUp,
  Clock,
  Star,
  ArrowUpRight,
  Package,
  Image as ImageIcon
} from 'lucide-react'

export default function PhotographerDashboard() {
  const { data, isLoading } = useProfessionalDashboard()

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [hoveredDate, setHoveredDate] = useState(null)

  const changeMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const handleDateClick = (dayNum) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum)
    setSelectedDate(clickedDate)
  }

  const getBookingsForDate = (dayNum) => {
    if (!data?.calendar?.bookedDates) return []
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    return data.calendar.bookedDates.filter(booking =>
      booking.date === dayNum &&
      booking.month === month &&
      booking.year === year
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: theme.colors.accent[500], borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  const { stats: dashboardStats, calendar: calendarData } = data || {
    stats: { totalBookings: 0, earnings: 0, profileViews: 0, pendingInquiries: 0, upcomingBookings: [] },
    calendar: { schedules: [], bookedDates: [] }
  }

  const stats = [
    {
      title: 'Total Bookings',
      value: dashboardStats.totalBookings.toString(),
      change: '+12%',
      icon: Calendar,
      gradient: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})`,
      bgColor: theme.colors.accent[50]
    },
    {
      title: 'Total Earnings',
      value: `₦${dashboardStats.earnings.toLocaleString()}`,
      change: '+8%',
      icon: DollarSign,
      gradient: `linear-gradient(135deg, #10B981, #059669)`,
      bgColor: '#D1FAE5'
    },
    {
      title: 'Profile Views',
      value: dashboardStats.profileViews.toString(),
      change: 'All time',
      icon: Eye,
      gradient: `linear-gradient(135deg, #3B82F6, #2563EB)`,
      bgColor: '#DBEAFE'
    },
    {
      title: 'Pending Inquiries',
      value: dashboardStats.pendingInquiries.toString(),
      change: 'Awaiting',
      icon: MessageSquare,
      gradient: `linear-gradient(135deg, #F59E0B, #D97706)`,
      bgColor: '#FEF3C7'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0"
      >
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-1 md:mb-2"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Here's what's happening with your business today
          </p>
        </div>
        <div className="grid grid-cols-2 sm:flex gap-3">
          <Link
            href="/photographer/packages"
            className="px-4 md:px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
            style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
          >
            <Package className="w-4 h-4 md:w-5 md:h-5" />
            <span className="truncate">New Package</span>
          </Link>
          <Link
            href="/photographer/gallery"
            className="px-4 md:px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 transition-all hover:border-gray-300 hover:shadow-md flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <ImageIcon className="w-4 h-4 md:w-5 md:h-5" />
            <span className="truncate">Upload Gallery</span>
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all group overflow-hidden"
            >
              {/* Background gradient on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity"
                style={{ background: stat.gradient }}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.gradient.match(/#[0-9A-F]{6}/i)?.[0] }} />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    {stat.change}
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                <p
                  className="text-3xl font-bold text-gray-900"
                  style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                >
                  {stat.value}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Calendar + Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-lg md:text-xl font-bold text-gray-900"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-90"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-90"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center text-[10px] md:text-xs font-bold text-gray-500 mb-2">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
                <div key={i}>{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 text-center">
              {(() => {
                const year = currentMonth.getFullYear()
                const month = currentMonth.getMonth()
                const firstDay = new Date(year, month, 1).getDay()
                const daysInMonth = new Date(year, month + 1, 0).getDate()
                const today = new Date()
                const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year
                const todayDate = today.getDate()

                return Array.from({ length: 42 }, (_, i) => {
                  const dayNum = i - firstDay + 1
                  const isValidDay = dayNum > 0 && dayNum <= daysInMonth
                  const isToday = isCurrentMonth && isValidDay && dayNum === todayDate
                  const hasBooking = isValidDay && calendarData.bookedDates.some(bd =>
                    bd.date === dayNum && bd.month === month && bd.year === year
                  )
                  const dayBookings = isValidDay ? getBookingsForDate(dayNum) : []
                  const hasSchedule = isValidDay && calendarData.schedules.some(s => {
                    const dayOfWeekMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 }
                    const scheduleDayOfWeek = dayOfWeekMap[s.dayOfWeek.toLowerCase()]
                    const currentDate = new Date(year, month, dayNum)
                    const currentDayOfWeek = currentDate.getDay()

                    const validFrom = new Date(s.validFrom)
                    const validUntil = new Date(s.validUntil)
                    validFrom.setHours(0, 0, 0, 0)
                    validUntil.setHours(23, 59, 59, 999)
                    currentDate.setHours(12, 0, 0, 0)

                    return scheduleDayOfWeek === currentDayOfWeek &&
                      s.isActive &&
                      currentDate >= validFrom &&
                      currentDate <= validUntil
                  })
                  const isSelected = selectedDate && isValidDay &&
                    selectedDate.getDate() === dayNum &&
                    selectedDate.getMonth() === month &&
                    selectedDate.getFullYear() === year

                  return (
                    <div
                      key={i}
                      onClick={() => isValidDay && handleDateClick(dayNum)}
                      onMouseEnter={() => isValidDay && setHoveredDate(dayNum)}
                      onMouseLeave={() => setHoveredDate(null)}
                      className={`
                        aspect-square flex flex-col items-center justify-center text-xs md:text-sm rounded-lg md:rounded-xl transition-all relative
                        ${isValidDay ? 'cursor-pointer hover:scale-110' : 'text-gray-300 cursor-default'}
                        ${isToday ? 'text-white font-bold ring-2 ring-offset-1' : ''}
                        ${hasBooking && !isToday ? 'font-semibold text-white' : ''}
                        ${hasSchedule && !hasBooking && !isToday ? 'border' : ''}
                        ${isSelected && !isToday ? 'ring-2 ring-offset-1' : ''}
                      `}
                      style={{
                        background: isToday
                          ? `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})`
                          : hasBooking
                            ? '#10B981'
                            : isValidDay
                              ? '#F9FAFB'
                              : 'transparent',
                        color: isToday || hasBooking ? 'white' : '#111827',
                        borderColor: hasSchedule && !hasBooking && !isToday ? theme.colors.accent[400] : 'transparent',
                        ringColor: isToday ? theme.colors.accent[300] : isSelected ? theme.colors.accent[400] : 'transparent'
                      }}
                    >
                      {isValidDay && (
                        <>
                          <span>{dayNum}</span>
                          {(hasBooking || hasSchedule) && (
                            <div className="flex gap-0.5 mt-0.5">
                              {hasBooking && <div className="w-1 h-1 rounded-full bg-white" />}
                              {hasSchedule && !hasBooking && <div className="w-1 h-1 rounded-full" style={{ backgroundColor: theme.colors.accent[500] }} />}
                            </div>
                          )}
                        </>
                      )}
                      {hoveredDate === dayNum && dayBookings.length > 0 && (
                        <div className="hidden md:block absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3">
                          <div className="space-y-2">
                            {dayBookings.map((booking, idx) => (
                              <div key={idx} className="text-left">
                                <p className="text-xs font-semibold text-gray-900">{booking.client}</p>
                                <p className="text-xs text-gray-600">{booking.time}</p>
                              </div>
                            ))}
                          </div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45" />
                        </div>
                      )}
                    </div>
                  )
                })
              })()}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
                />
                <span className="text-[10px] md:text-xs font-medium text-gray-600">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-[10px] md:text-xs font-medium text-gray-600">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full border-2" style={{ borderColor: theme.colors.accent[400] }} />
                <span className="text-[10px] md:text-xs font-medium text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-100" />
                <span className="text-[10px] md:text-xs font-medium text-gray-600">No Schedule</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Bookings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-lg md:text-xl font-bold text-gray-900"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              Upcoming Bookings
            </h3>
            <button className="text-xs md:text-sm font-bold flex items-center gap-1 transition-colors hover:opacity-70" style={{ color: theme.colors.accent[600] }}>
              View All
              <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {dashboardStats.upcomingBookings.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <div
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.accent[50] }}
                >
                  <Calendar className="w-7 h-7 md:w-8 md:h-8" style={{ color: theme.colors.accent[500] }} />
                </div>
                <p className="text-gray-500 font-semibold text-sm md:text-base">No upcoming bookings</p>
                <p className="text-gray-400 text-xs md:text-sm mt-1 px-4">Your confirmed bookings will appear here</p>
              </div>
            ) : (
              dashboardStats.upcomingBookings.map((booking, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer group hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                    <div
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 text-sm md:text-base"
                      style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
                    >
                      {booking.client.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-bold text-gray-900 text-sm md:text-base truncate">{booking.client}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="truncate">{new Date(booking.date).toLocaleDateString()} • {booking.time}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-lg text-[10px] md:text-xs font-bold bg-green-100 text-green-700 shrink-0"
                  >
                    Confirmed
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
      >
        {[
          { title: 'Manage Packages', description: 'Update your pricing and offerings', icon: Package, link: '/photographer/packages' },
          { title: 'Upload to Gallery', description: 'Showcase your latest work', icon: ImageIcon, link: '/photographer/gallery' },
          { title: 'View Reviews', description: 'See what clients are saying', icon: Star, link: '/photographer/reviews' }
        ].map((action, index) => {
          const Icon = action.icon
          return (
            <a
              key={action.title}
              href={action.link}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: theme.colors.accent[50] }}
              >
                <Icon className="w-6 h-6" style={{ color: theme.colors.accent[600] }} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-base md:text-lg">{action.title}</h4>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{action.description}</p>
              <div className="flex items-center gap-1 text-sm font-bold" style={{ color: theme.colors.accent[600] }}>
                Get Started
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
            </a>
          )
        })}
      </motion.div>
    </div>
  )
}