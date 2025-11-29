'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { ClientNotificationService } from '../../../../services/client'
import { theme } from '../../../../lib/theme'

const ICON_CONFIG = {
  booking: { path: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z', color: theme.colors.primary[800], bg: theme.colors.primary[100] },
  message: { path: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z', color: '#3B82F6', bg: '#E0F2FE' },
  review: { path: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.837-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z', color: theme.colors.accent[500], bg: theme.colors.accent[50] },
  default: { path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', color: theme.colors.gray[600], bg: theme.colors.gray[100] }
}

const getIconConfig = (type) => ICON_CONFIG[type?.toLowerCase()] || ICON_CONFIG.default

const NotificationCard = ({ notification, onMarkAsRead }) => {
  const icon = getIconConfig(notification.type)
  const isRead = notification.isRead

  return (
    <div 
      className="p-5 rounded-2xl cursor-pointer transition-all hover:shadow-lg"
      style={{
        backgroundColor: isRead ? theme.colors.white : theme.colors.gray[50],
        border: `1px solid ${isRead ? theme.colors.gray[200] : theme.colors.primary[200]}`
      }}
      onClick={() => !isRead && onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{backgroundColor: icon.bg}}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: icon.color}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon.path} />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
              {notification.title || notification.type || 'Notification'}
            </h3>
            {!isRead && <div className="w-2 h-2 rounded-full" style={{backgroundColor: theme.colors.primary[800]}}></div>}
          </div>
          <p className="text-sm leading-relaxed mb-2" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
            {notification.message || (notification.data?.message) || 'You have a new notification'}
          </p>
          <p className="text-xs font-medium" style={{color: theme.colors.gray[400], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>

        {!isRead && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMarkAsRead(notification.id)
            }}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:shadow-md"
            style={{backgroundColor: theme.colors.primary[800], color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ')}}
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-5 rounded-2xl animate-pulse" style={{backgroundColor: theme.colors.gray[50]}}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl" style={{backgroundColor: theme.colors.gray[200]}}></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded w-1/4" style={{backgroundColor: theme.colors.gray[200]}}></div>
            <div className="h-3 rounded w-3/4" style={{backgroundColor: theme.colors.gray[200]}}></div>
          </div>
        </div>
      </div>
    ))}
  </div>
)

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed" style={{backgroundColor: theme.colors.gray[50], borderColor: theme.colors.gray[200]}}>
    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: theme.colors.primary[100]}}>
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: theme.colors.primary[800]}}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold mb-2" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>No notifications</h3>
    <p style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>You're all caught up!</p>
  </div>
)

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const data = await ClientNotificationService.getNotifications()
      setNotifications(data)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = useCallback(async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: true} : n))
    try {
      await ClientNotificationService.markAsRead(id)
    } catch (error) {
      console.error('Failed to mark as read:', error)
      setNotifications(prev => prev.map(n => n.id === id ? {...n, isRead: false} : n))
    }
  }, [])

  const handleMarkAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({...n, isRead: true})))
    try {
      await ClientNotificationService.markAllAsRead()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      fetchNotifications()
    }
  }, [])

  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link href="/client" className="hover:underline" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Dashboard</Link>
        <span style={{color: theme.colors.gray[300]}}>/</span>
        <span className="font-medium" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Inbox</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>Notifications</h1>
          <p className="mt-1" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Stay updated with your bookings and messages</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-md"
            style={{backgroundColor: theme.colors.primary[800], color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ')}}
          >
            Mark all as read
          </button>
        )}
      </div>

      {unreadCount > 0 && (
        <div className="px-4 py-2 rounded-xl inline-block" style={{backgroundColor: '#FEE2E2'}}>
          <span className="text-sm font-semibold" style={{color: '#DC2626', fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
            {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <LoadingSkeleton />
        ) : notifications.length === 0 ? (
          <EmptyState />
        ) : (
          notifications.map(notification => (
            <NotificationCard 
              key={notification.id || Math.random()} 
              notification={notification} 
              onMarkAsRead={handleMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  )
}
