'use client'
import { useState, useEffect } from 'react'
import professionalService from '../../../../services/professionalService'

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await professionalService.getNotifications()
        setNotifications(data)
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(n => !n.isRead).length
  const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications

  const getIcon = (type) => {
    switch(type) {
      case 'booking':
        return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z'
      case 'message':
        return 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z'
      case 'review':
        return 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.837-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
      case 'payment':
        return 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z'
      default:
        return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }
  }

  const getIconColor = (type) => {
    switch(type) {
      case 'booking': return '#1E3A8A'
      case 'message': return '#0EA5E9'
      case 'review': return '#F59E0B'
      case 'payment': return '#10B981'
      default: return '#6B7280'
    }
  }

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? {...n, isRead: true} : n))
  }

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInHours < 48) return '1 day ago'
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  const getNotificationTitle = (notification) => {
    switch(notification.type) {
      case 'booking_request': return 'New Booking Request'
      case 'booking_accepted': return 'Booking Accepted'
      case 'booking_cancelled': return 'Booking Cancelled'
      case 'payment_received': return 'Payment Received'
      case 'review_received': return 'New Review'
      case 'message': return 'New Message'
      default: return 'Notification'
    }
  }

  const getNotificationMessage = (notification) => {
    const data = notification.data
    switch(notification.type) {
      case 'booking_request':
        return `${data.user?.firstName} ${data.user?.lastName} requested a ${data.serviceType} session`
      case 'booking_accepted':
        return `Your booking for ${data.serviceType} has been accepted`
      case 'booking_cancelled':
        return `Booking for ${data.serviceType} has been cancelled`
      case 'payment_received':
        return `Payment received for ${data.serviceType} session`
      case 'review_received':
        return `${data.user?.firstName} ${data.user?.lastName} left a review`
      default:
        return 'You have a new notification'
    }
  }

  const getNotificationType = (type) => {
    switch(type) {
      case 'booking_request':
      case 'booking_accepted':
      case 'booking_cancelled':
        return 'booking'
      case 'payment_received':
        return 'payment'
      case 'review_received':
        return 'review'
      case 'message':
        return 'message'
      default:
        return 'system'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{color: '#111827'}}>Notifications</h1>
          <p className="mt-1" style={{color: '#6B7280'}}>Stay updated with your bookings and messages</p>
        </div>
        {unreadCount > 0 && (
          <div className="px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-sm" style={{backgroundColor: '#DC2626'}}>
            {unreadCount} unread
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 p-1 rounded-xl" style={{backgroundColor: '#F3F4F6'}}>
        <button
          onClick={() => setFilter('all')}
          className="px-5 py-2.5 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: filter === 'all' ? '#FFFFFF' : 'transparent',
            color: filter === 'all' ? '#1E3A8A' : '#6B7280',
            boxShadow: filter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className="px-5 py-2.5 rounded-lg font-medium transition-all"
          style={{
            backgroundColor: filter === 'unread' ? '#FFFFFF' : 'transparent',
            color: filter === 'unread' ? '#1E3A8A' : '#6B7280',
            boxShadow: filter === 'unread' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#DBEAFE'}}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{color: '#111827'}}>No notifications</h3>
          <p style={{color: '#6B7280'}}>You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <div 
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className="p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg"
              style={{
                backgroundColor: notification.isRead ? '#FFFFFF' : '#F9FAFB',
                border: `2px solid ${notification.isRead ? '#E5E7EB' : '#1E3A8A'}`
              }}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: notification.isRead ? '#F3F4F6' : '#DBEAFE'}}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: getIconColor(getNotificationType(notification.type))}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(getNotificationType(notification.type))} />
                  </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold" style={{color: '#111827'}}>{getNotificationTitle(notification)}</h3>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#1E3A8A'}}></div>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed" style={{color: '#374151'}}>
                    {getNotificationMessage(notification)}
                  </p>
                  <p className="text-xs mt-2 font-medium" style={{color: '#9CA3AF'}}>
                    {formatTimestamp(notification.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}