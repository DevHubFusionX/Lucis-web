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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [bookings, views, schedules] = await Promise.all([
          professionalService.getBookings(),
          professionalService.getViews(),
          professionalService.getSchedules()
        ])

        const totalBookings = bookings.length
        const pendingInquiries = bookings.filter(b => b.status === 'pending').length
        const upcomingBookings = bookings
          .filter(b => b.status === 'accepted' || b.status === 'confirmed')
          .slice(0, 3)
          .map(b => ({
            client: `${b.user?.firstName} ${b.user?.lastName}`,
            date: new Date(b.startDateTime).toLocaleDateString(),
            time: new Date(b.startDateTime).toLocaleTimeString(),
            status: 'confirmed'
          }))

        const bookedDates = bookings
          .filter(b => b.status === 'accepted' || b.status === 'confirmed')
          .map(b => new Date(b.startDateTime).getDate())

        setDashboardData({
          totalBookings,
          earnings: bookings.reduce((sum, b) => sum + (b.price || 0), 0),
          profileViews: views.records?.length || 0,
          pendingInquiries,
          upcomingBookings
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
          <h3 
            className="text-xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            Calendar Overview
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-600">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i}>{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({length: 35}, (_, i) => {
                const day = i - 6
                const today = new Date().getDate()
                const isToday = day === today
                const hasBooking = calendarData.bookedDates.includes(day)
                
                return (
                  <div 
                    key={i} 
                    className={`
                      aspect-square flex items-center justify-center text-sm rounded-xl transition-all cursor-pointer
                      ${day < 1 ? 'text-gray-300' : 'hover:scale-110'}
                      ${isToday ? 'text-white font-bold shadow-lg' : ''}
                      ${hasBooking && !isToday ? 'font-semibold' : ''}
                    `}
                    style={{
                      background: isToday 
                        ? `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})`
                        : hasBooking 
                        ? '#10B981'
                        : day < 1 
                        ? 'transparent' 
                        : '#F9FAFB',
                      color: isToday || hasBooking ? 'white' : '#111827'
                    }}
                  >
                    {day > 0 ? day : ''}
                  </div>
                )
              })}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
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
                <div className="w-3 h-3 rounded bg-gray-100" />
                <span className="text-xs text-gray-600">Available</span>
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