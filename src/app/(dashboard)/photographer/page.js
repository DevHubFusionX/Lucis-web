'use client'
import { useState, useEffect } from 'react'
import professionalService from '../../../services/professionalService'

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

        console.log('🔍 DEBUG: Dashboard data:', { bookings, views, schedules })

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

        // Extract booked dates from bookings
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
        console.error('❌ Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{color: '#111827'}}>Welcome back, Franklin Studios</h1>
          <p className="mt-1" style={{color: '#6B7280'}}>Here's what's happening with your business today</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="text-white px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-medium" style={{backgroundColor: '#1E3A8A'}}>
            Add New Package
          </button>
          <button className="border px-5 py-2.5 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md font-medium" style={{backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', color: '#111827'}}>
            Upload New Gallery Set
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Bookings', value: dashboardData.totalBookings.toString(), change: '+12%', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z', bgColor: '#DBEAFE', iconColor: '#1E3A8A' },
          { title: 'Earnings (Total)', value: `$${dashboardData.earnings.toLocaleString()}`, change: '+8%', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1', bgColor: '#D1FAE5', iconColor: '#10B981' },
          { title: 'Profile Views', value: dashboardData.profileViews.toString(), change: 'All time', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', bgColor: '#E0F2FE', iconColor: '#0EA5E9' },
          { title: 'Pending Inquiries', value: dashboardData.pendingInquiries.toString(), change: 'Awaiting response', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z', bgColor: '#FEF3C7', iconColor: '#F59E0B' }
        ].map((card, i) => (
          <div key={i} className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{color: '#6B7280'}}>{card.title}</p>
                <p className="text-3xl font-bold mt-2" style={{color: '#111827'}}>{card.value}</p>
                <p className="text-sm font-medium mt-2 flex items-center" style={{color: '#10B981'}}>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                  {card.change}
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{backgroundColor: card.bgColor}}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: card.iconColor}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar + Booking Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
          <h3 className="text-lg font-semibold mb-4" style={{color: '#111827'}}>Calendar Overview</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-3 font-medium" style={{color: '#6B7280'}}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({length: 35}, (_, i) => {
                const day = i - 6
                const today = new Date().getDate()
                const isToday = day === today
                const hasBooking = calendarData.bookedDates.includes(day)
                const hasSchedule = calendarData.schedules.some(s => {
                  const scheduleDay = new Date().getDay()
                  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
                  return s.isActive && s.dayOfWeek === dayNames[scheduleDay] && day === today
                })
                return (
                  <div key={i} className="p-3 text-center text-sm rounded-xl transition-all duration-200 cursor-pointer" style={{
                    backgroundColor: isToday ? '#1E3A8A' : hasBooking ? '#10B981' : hasSchedule ? '#DBEAFE' : day < 1 ? 'transparent' : '#FFFFFF',
                    color: isToday ? '#FFFFFF' : hasBooking ? '#FFFFFF' : hasSchedule ? '#1E3A8A' : day < 1 ? '#9CA3AF' : '#111827',
                    fontWeight: hasBooking || hasSchedule ? '500' : 'normal',
                    border: hasSchedule && !hasBooking ? '1px solid #1E3A8A' : 'none'
                  }}>
                    {day > 0 ? day : ''}
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{backgroundColor: '#1E3A8A'}}></div>
                <span style={{color: '#6B7280'}}>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border" style={{borderColor: '#1E3A8A', backgroundColor: '#DBEAFE'}}></div>
                <span style={{color: '#6B7280'}}>Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{backgroundColor: '#10B981'}}></div>
                <span style={{color: '#6B7280'}}>Booked</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
          <h3 className="text-lg font-semibold mb-4" style={{color: '#111827'}}>Upcoming Bookings</h3>
          <div className="space-y-3">
            {dashboardData.upcomingBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No upcoming bookings</p>
                <p className="text-gray-400 text-sm mt-1">Your confirmed bookings will appear here</p>
              </div>
            ) : (
              dashboardData.upcomingBookings.map((booking, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl transition-colors duration-200" style={{backgroundColor: '#F3F4F6'}}>
                <div>
                  <p className="font-semibold" style={{color: '#111827'}}>{booking.client}</p>
                  <p className="text-sm mt-1" style={{color: '#6B7280'}}>{booking.date} at {booking.time}</p>
                </div>
                <span className="px-3 py-1.5 rounded-xl text-xs font-semibold" style={{
                  backgroundColor: booking.status === 'confirmed' ? '#D1FAE5' : '#FEF3C7',
                  color: booking.status === 'confirmed' ? '#10B981' : '#F59E0B'
                }}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              ))
            )}
            {calendarData.schedules.length > 0 && (
              <div className="mt-4 p-3 rounded-lg" style={{backgroundColor: '#F3F4F6'}}>
                <h4 className="text-sm font-semibold mb-2" style={{color: '#111827'}}>Active Schedule</h4>
                <div className="space-y-1">
                  {calendarData.schedules
                    .filter(s => s.isActive)
                    .slice(0, 3)
                    .map((schedule, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span style={{color: '#6B7280', textTransform: 'capitalize'}}>{schedule.dayOfWeek}</span>
                      <span style={{color: '#111827'}}>{schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
          <h3 className="text-lg font-semibold mb-4" style={{color: '#111827'}}>Bookings per Month</h3>
          <div className="h-64 flex items-end justify-between space-x-3">
            {[12, 18, 15, 22, 28, 24].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full rounded-t-lg transition-all" style={{height: `${height * 3}px`, backgroundColor: '#1E3A8A'}}></div>
                <span className="text-xs mt-3 font-medium" style={{color: '#6B7280'}}>{['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
          <h3 className="text-lg font-semibold mb-4" style={{color: '#111827'}}>Earnings Trend</h3>
          <div className="h-64 flex items-center">
            <svg className="w-full h-full" viewBox="0 0 300 200">
              <defs>
                <linearGradient id="earningsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path fill="url(#earningsGradient)" d="M20,150 L70,120 L120,100 L170,80 L220,60 L270,40 L270,180 L20,180 Z" />
              <polyline fill="none" stroke="#10B981" strokeWidth="3" points="20,150 70,120 120,100 170,80 220,60 270,40" />
              <circle cx="270" cy="40" r="5" fill="#10B981" />
            </svg>
          </div>
        </div>
      </div>

      {/* Latest Reviews */}
      <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
        <h3 className="text-lg font-semibold mb-6" style={{color: '#111827'}}>Latest Reviews</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Sarah Johnson', rating: 5, review: 'Absolutely amazing work! Franklin captured our wedding perfectly.', avatar: 'SJ' },
            { name: 'Mike Chen', rating: 5, review: 'Professional, creative, and delivered beyond expectations.', avatar: 'MC' },
            { name: 'Emma Davis', rating: 4, review: 'Great experience and beautiful photos. Highly recommend!', avatar: 'ED' }
          ].map((review, i) => (
            <div key={i} className="p-5 rounded-xl" style={{backgroundColor: '#F3F4F6'}}>
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{backgroundColor: '#1E3A8A'}}>
                  <span className="text-white text-sm font-semibold">{review.avatar}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold" style={{color: '#111827'}}>{review.name}</h4>
                  <div className="flex mt-1">
                    {Array.from({length: 5}, (_, starIndex) => (
                      <svg key={starIndex} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: starIndex < review.rating ? '#F59E0B' : '#D1D5DB'}}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{color: '#6B7280'}}>{review.review}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}