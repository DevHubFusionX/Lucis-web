'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { theme } from '../../../lib/theme'
import professionalService from '../../../services/professionalService'
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
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    earnings: 0,
    profileViews: 0,
    pendingInquiries: 0,
    upcomingBookings: []
  })
  const [calendarData, setCalendarData] = useState({
    schedules: [],
    bookedDates: []
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [hoveredDate, setHoveredDate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookings, views, schedules] = await Promise.all([
          professionalService.getBookings(),
          professionalService.getViews(),
          professionalService.getSchedules()
        ])

        console.log('Bookings:', bookings)

        const totalBookings = bookings.length
        const pendingInquiries = bookings.filter(b => b.status === 'pending').length
        const upcomingBookings = bookings
          .filter(b => b.status === 'accepted' || b.status === 'confirmed')
          .map(b => {
            const startDate = new Date(b.startDateTime)
            console.log('Booking date:', startDate, 'Day:', startDate.getDate(), 'Month:', startDate.getMonth(), 'Year:', startDate.getFullYear())
            return {
              client: `${b.user?.firstName} ${b.user?.lastName}`,
              date: b.startDateTime,
              time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'confirmed'
            }
          })

        const bookedDates = bookings
          .filter(b => b.status === 'accepted' || b.status === 'confirmed')
          .map(b => {
            const startDate = new Date(b.startDateTime)
            return {
              date: startDate.getDate(),
              month: startDate.getMonth(),
              year: startDate.getFullYear(),
              client: `${b.user?.firstName} ${b.user?.lastName}`,
              time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          })

        console.log('Booked dates:', bookedDates)

        setDashboardData({
          totalBookings,
          earnings: bookings.reduce((sum, b) => sum + (b.price || 0), 0),
          profileViews: views.records?.length || 0,
          pendingInquiries,
          upcomingBookings: upcomingBookings.slice(0, 3)
        })

        setCalendarData({
          schedules: schedules.records || [],
          bookedDates
        })
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    return calendarData.bookedDates.filter(booking => 
      booking.date === dayNum && 
      booking.month === month && 
      booking.year === year
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div 
          className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: theme.colors.accent[500], borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  const stats = [
    { 
      title: 'Total Bookings', 
      value: dashboardData.totalBookings.toString(), 
      change: '+12%', 
      icon: Calendar,
      gradient: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})`,
      bgColor: theme.colors.accent[50]
    },
    { 
      title: 'Total Earnings', 
      value: `$${dashboardData.earnings.toLocaleString()}`, 
      change: '+8%', 
      icon: DollarSign,
      gradient: `linear-gradient(135deg, #10B981, #059669)`,
      bgColor: '#D1FAE5'
    },
    { 
      title: 'Profile Views', 
      value: dashboardData.profileViews.toString(), 
      change: 'All time', 
      icon: Eye,
      gradient: `linear-gradient(135deg, #3B82F6, #2563EB)`,
      bgColor: '#DBEAFE'
    },
    { 
      title: 'Pending Inquiries', 
      value: dashboardData.pendingInquiries.toString(), 
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
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 
            className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            Welcome back! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your business today
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button 
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
          >
            <Package className="w-5 h-5" />
            New Package
          </button>
          <button 
            className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 transition-all hover:border-gray-300 hover:shadow-md flex items-center gap-2"
          >
            <ImageIcon className="w-5 h-5" />
            Upload Gallery
          </button>
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
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex gap-2">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-500 mb-2">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
                <div key={i}>{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {(() => {
                const year = currentMonth.getFullYear()
                const month = currentMonth.getMonth()
                const firstDay = new Date(year, month, 1).getDay()
                const daysInMonth = new Date(year, month + 1, 0).getDate()
                const today = new Date()
                const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year
                const todayDate = today.getDate()
                
                return Array.from({length: 42}, (_, i) => {
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
                        aspect-square flex flex-col items-center justify-center text-sm rounded-xl transition-all relative
                        ${isValidDay ? 'cursor-pointer hover:scale-105 hover:shadow-md' : 'text-gray-300 cursor-default'}
                        ${isToday ? 'text-white font-bold shadow-lg ring-2 ring-offset-2' : ''}
                        ${hasBooking && !isToday ? 'font-semibold text-white' : ''}
                        ${hasSchedule && !hasBooking && !isToday ? 'border-2' : ''}
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
                        <div className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-3">
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
            
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
                />
                <span className="text-xs text-gray-600">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500" />
                <span className="text-xs text-gray-600">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border-2" style={{ borderColor: theme.colors.accent[400] }} />
                <span className="text-xs text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gray-100" />
                <span className="text-xs text-gray-600">No Schedule</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Bookings */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 
              className="text-xl font-bold text-gray-900"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              Upcoming Bookings
            </h3>
            <button className="text-sm font-semibold flex items-center gap-1" style={{ color: theme.colors.accent[600] }}>
              View All
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {dashboardData.upcomingBookings.length === 0 ? (
              <div className="text-center py-12">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: theme.colors.accent[50] }}
                >
                  <Calendar className="w-8 h-8" style={{ color: theme.colors.accent[500] }} />
                </div>
                <p className="text-gray-500 font-medium">No upcoming bookings</p>
                <p className="text-gray-400 text-sm mt-1">Your confirmed bookings will appear here</p>
              </div>
            ) : (
              dashboardData.upcomingBookings.map((booking, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
                    >
                      {booking.client.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{booking.client}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4" />
                        {booking.date} at {booking.time}
                      </div>
                    </div>
                  </div>
                  <span 
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700"
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
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: theme.colors.accent[50] }}
              >
                <Icon className="w-6 h-6" style={{ color: theme.colors.accent[600] }} />
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{action.title}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
              <div className="flex items-center gap-1 mt-4 text-sm font-semibold" style={{ color: theme.colors.accent[600] }}>
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