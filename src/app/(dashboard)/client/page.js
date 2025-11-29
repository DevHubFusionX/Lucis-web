'use client'
import Link from 'next/link'
import { useAuth } from '../../../hooks/useAuth'
import { useState, useEffect, useMemo } from 'react'
import { ClientBookingService } from '../../../services/client'
import { theme } from '../../../lib/theme'

const StatCard = ({ stat }) => (
  <div 
    className="group relative overflow-hidden rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    style={{backgroundColor: theme.colors.white}}
  >
    <div className="absolute inset-0 opacity-50 group-hover:opacity-70 transition-opacity" style={{backgroundColor: stat.lightColor}}></div>
    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{backgroundColor: stat.lightColor}}>
          <svg className="w-6 h-6" fill="none" stroke={stat.color} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
          </svg>
        </div>
        <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{backgroundColor: stat.color}}>
          {stat.trend}
        </span>
      </div>
      <p className="text-sm font-semibold mb-1" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{stat.label}</p>
      <p className="text-4xl font-bold" style={{color: stat.color, fontFamily: theme.typography.fontFamily.display.join(', ')}}>
        {stat.value}
      </p>
    </div>
  </div>
)

const BookingItem = ({ booking }) => (
  <div className="group relative overflow-hidden rounded-xl p-5 hover:shadow-md transition-all" style={{backgroundColor: theme.colors.gray[50], border: `1px solid ${theme.colors.gray[200]}`}}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="font-bold text-lg" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
          {booking.professional?.firstName} {booking.professional?.lastName}
        </p>
        <p className="text-sm" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
          Photography Session
        </p>
        <div className="flex items-center gap-4 text-sm mt-3" style={{color: theme.colors.gray[600]}}>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
            </svg>
            <span style={{fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{new Date(booking.startDateTime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{new Date(booking.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        </div>
      </div>
      <span className="px-4 py-2 rounded-full text-xs font-bold shadow-sm text-white" style={{backgroundColor: booking.status === 'confirmed' ? '#22C55E' : '#F59E0B', fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1) || 'Pending'}
      </span>
    </div>
  </div>
)

const ActivityItem = ({ activity }) => (
  <div className="flex gap-4 group">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{backgroundColor: theme.colors.primary[100]}}>
        <svg className="w-5 h-5" fill="none" stroke={theme.colors.primary[800]} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={activity.icon} />
        </svg>
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-bold" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{activity.action}</p>
      <p className="text-xs mt-1" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{activity.detail}</p>
      <p className="text-xs mt-1" style={{color: theme.colors.gray[400], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{activity.time}</p>
    </div>
  </div>
)

const QuickActionLink = ({ href, icon, label, description, color }) => (
  <Link href={href} className="group relative overflow-hidden flex items-center gap-4 p-5 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1" style={{backgroundColor: theme.colors.gray[50], border: `1px solid ${theme.colors.gray[200]}`}}>
    <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg" style={{backgroundColor: color}}>
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
    </div>
    <div>
      <p className="font-bold" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{label}</p>
      <p className="text-xs" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{description}</p>
    </div>
  </Link>
)

export default function ClientDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

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

  const stats = useMemo(() => {
    const active = bookings.filter(b => b.status === 'confirmed' || b.status === 'upcoming').length
    const completed = bookings.filter(b => b.status === 'completed').length
    return {
      activeBookings: active,
      completed: completed,
      favorites: 0,
      messages: 0
    }
  }, [bookings])

  const upcomingBookings = useMemo(() => 
    bookings.filter(b => b.status === 'confirmed' || b.status === 'upcoming').slice(0, 2),
    [bookings]
  )

  const statsCards = [
    { 
      label: 'Active Sessions', 
      value: stats.activeBookings, 
      icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z',
      color: theme.colors.primary[800],
      lightColor: theme.colors.primary[100],
      trend: '+12%'
    },
    { 
      label: 'Completed', 
      value: stats.completed, 
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      color: '#22C55E',
      lightColor: '#D1FAE5',
      trend: '+8%'
    },
    { 
      label: 'Saved Pros', 
      value: stats.favorites, 
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
      color: theme.colors.accent[500],
      lightColor: theme.colors.accent[100],
      trend: '+5%'
    },
    { 
      label: 'Unread Messages', 
      value: stats.messages, 
      icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z',
      color: '#3B82F6',
      lightColor: '#DBEAFE',
      trend: '+15%'
    }
  ]

  const recentActivity = [
    { id: 1, action: 'Dashboard accessed', detail: 'You logged into your account', time: '5 hours ago', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl p-8 shadow-2xl" style={{background: `linear-gradient(135deg, ${theme.colors.primary[800]} 0%, ${theme.colors.primary[600]} 100%)`}}>
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30 shadow-xl">
              <span className="text-4xl font-bold text-white">
                {user?.firstName?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2" style={{fontFamily: theme.typography.fontFamily.display.join(', ')}}>
                Welcome back, {user?.firstName || 'User'}! 👋
              </h1>
              <p className="text-white/80 text-lg" style={{fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Discover exceptional photography talent today</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow" style={{backgroundColor: theme.colors.white}}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>Upcoming Sessions</h2>
            <Link href="/client/bookings" className="text-sm font-semibold flex items-center gap-1 group" style={{color: theme.colors.primary[800], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingBookings.length > 0 ? upcomingBookings.map(booking => (
              <BookingItem key={booking.id} booking={booking} />
            )) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{backgroundColor: theme.colors.primary[100]}}>
                  <svg className="w-10 h-10" fill="none" stroke={theme.colors.primary[800]} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="mb-4" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>No upcoming sessions yet</p>
                <Link href="/client/search" className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold hover:shadow-lg transition-all" style={{backgroundColor: theme.colors.primary[800], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Discover Photographers
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow" style={{backgroundColor: theme.colors.white}}>
          <h2 className="text-2xl font-bold mb-6" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>Recent Activity</h2>
          <div className="space-y-5">
            {recentActivity.map(activity => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow" style={{backgroundColor: theme.colors.white}}>
        <h2 className="text-2xl font-bold mb-6" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickActionLink 
            href="/client/search" 
            icon="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            label="Discover Talent"
            description="Browse photographers"
            color={theme.colors.primary[800]}
          />
          <QuickActionLink 
            href="/client/bookings" 
            icon="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z"
            label="My Sessions"
            description="View all bookings"
            color="#22C55E"
          />
          <QuickActionLink 
            href="/client/notifications" 
            icon="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            label="Notifications"
            description="Check updates"
            color={theme.colors.accent[500]}
          />
        </div>
      </div>
    </div>
  )
}
