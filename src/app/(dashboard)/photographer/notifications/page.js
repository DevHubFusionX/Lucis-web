'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { theme } from '../../../../lib/theme'
import {
  useNotifications,
  useNotificationDetail,
  useMarkNotificationRead
} from '../../../../hooks/useProfessional'
import { Bell, Calendar, MessageSquare, Star, DollarSign, Info, Loader2, CheckCircle, X, MapPin, Clock } from 'lucide-react'

export default function NotificationsPage() {
  const [filter, setFilter] = useState('all')
  const { data: notifications = [], isLoading } = useNotifications()
  const [selectedId, setSelectedId] = useState(null)

  const { data: selectedNotification, isLoading: loadingDetail } = useNotificationDetail(selectedId)
  const markReadMutation = useMarkNotificationRead()

  const unreadCount = notifications.filter(n => !n.isRead).length
  const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications

  const getIcon = (type) => {
    switch (type) {
      case 'booking': return Calendar
      case 'message': return MessageSquare
      case 'review': return Star
      case 'payment': return DollarSign
      default: return Info
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'booking': return theme.colors.accent[600]
      case 'message': return '#0EA5E9'
      case 'review': return '#F59E0B'
      case 'payment': return '#10B981'
      default: return '#6B7280'
    }
  }

  const handleNotificationClick = async (id) => {
    setSelectedId(id)
    const notification = notifications.find(n => n.id === id)
    if (notification && !notification.isRead) {
      markReadMutation.mutate(id)
    }
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
    switch (notification.type) {
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
    switch (notification.type) {
      case 'booking_request':
        return `${data?.user?.firstName} ${data?.user?.lastName} requested a ${data?.serviceType} session`
      case 'booking_accepted':
        return `Your booking for ${data?.serviceType} has been accepted`
      case 'booking_cancelled':
        return `Booking for ${data?.serviceType} has been cancelled`
      case 'payment_received':
        return `Payment received for ${data?.serviceType} session`
      case 'review_received':
        return `${data?.user?.firstName} ${data?.user?.lastName} left a review`
      default:
        return 'You have a new notification'
    }
  }

  const getNotificationType = (type) => {
    switch (type) {
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div
          className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: theme.colors.accent[500], borderTopColor: 'transparent' }}
        />
        <p className="text-gray-500 font-medium animate-pulse">Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1
            className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            Notifications
          </h1>
          <p className="text-gray-600 text-lg">Stay updated with your bookings and messages</p>
        </div>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg"
            style={{ backgroundColor: '#DC2626' }}
          >
            {unreadCount} unread
          </motion.div>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 p-1 rounded-xl bg-gray-100"
      >
        <motion.button
          onClick={() => setFilter('all')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-lg font-semibold transition-all"
          style={{
            backgroundColor: filter === 'all' ? 'white' : 'transparent',
            color: filter === 'all' ? theme.colors.accent[600] : '#6B7280',
            boxShadow: filter === 'all' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          All
        </motion.button>
        <motion.button
          onClick={() => setFilter('unread')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-lg font-semibold transition-all"
          style={{
            backgroundColor: filter === 'unread' ? 'white' : 'transparent',
            color: filter === 'unread' ? theme.colors.accent[600] : '#6B7280',
            boxShadow: filter === 'all' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          Unread ({unreadCount})
        </motion.button>
      </motion.div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ backgroundColor: theme.colors.accent[50] }}
          >
            <Bell className="w-10 h-10" style={{ color: theme.colors.accent[500] }} />
          </div>
          <h3
            className="text-2xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            No notifications
          </h3>
          <p className="text-gray-600">You're all caught up!</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => {
            const IconComponent = getIcon(getNotificationType(notification.type))
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileHover={{ scale: 1.01, y: -2 }}
                onClick={() => handleNotificationClick(notification.id)}
                className="p-6 rounded-2xl cursor-pointer transition-all bg-white border-2 shadow-sm hover:shadow-lg"
                style={{
                  borderColor: notification.isRead ? '#E5E7EB' : theme.colors.accent[500]
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: notification.isRead ? '#F3F4F6' : `${getIconColor(getNotificationType(notification.type))}15` }}
                  >
                    <IconComponent className="w-6 h-6" style={{ color: getIconColor(getNotificationType(notification.type)) }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900">{getNotificationTitle(notification)}</h3>
                      {!notification.isRead && (
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.colors.accent[500] }}></div>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700">
                      {getNotificationMessage(notification)}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <p className="text-xs font-medium text-gray-400">
                        {formatTimestamp(notification.createdAt)}
                      </p>
                      {notification.isRead && notification.readAt && (
                        <>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">Read</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Notification Detail Modal */}
      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              {(loadingDetail && !selectedNotification) ? (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="w-12 h-12 animate-spin" style={{ color: theme.colors.accent[500] }} />
                </div>
              ) : selectedNotification ? (
                <>
                  <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div>
                      <h2
                        className="text-2xl font-bold text-gray-900"
                        style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                      >
                        {getNotificationTitle(selectedNotification)}
                      </h2>
                      <p className="text-gray-500 text-sm mt-1">{formatTimestamp(selectedNotification.createdAt)}</p>
                    </div>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="p-8 overflow-y-auto space-y-6">
                    <div className="p-6 rounded-2xl" style={{ backgroundColor: theme.colors.accent[50] }}>
                      <p className="text-gray-800 leading-relaxed">
                        {getNotificationMessage(selectedNotification)}
                      </p>
                    </div>

                    {selectedNotification.data && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                          <Info className="w-4 h-4" /> Details
                        </h3>

                        {selectedNotification.data.user && (
                          <div className="bg-gray-50 rounded-2xl p-6">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Client Information</p>
                            <div className="flex items-center gap-4">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-md"
                                style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
                              >
                                {selectedNotification.data.user.firstName?.[0]}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">
                                  {selectedNotification.data.user.firstName} {selectedNotification.data.user.lastName}
                                </p>
                                <p className="text-sm text-gray-600">{selectedNotification.data.user.email}</p>
                                {selectedNotification.data.user.phone && (
                                  <p className="text-sm text-gray-600">{selectedNotification.data.user.phone}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedNotification.data.serviceType && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl border border-gray-100">
                              <p className="text-sm text-gray-500 mb-1">Service Type</p>
                              <p className="font-bold text-gray-900">{selectedNotification.data.serviceType}</p>
                            </div>
                            {selectedNotification.data.status && (
                              <div className="p-4 rounded-2xl border border-gray-100">
                                <p className="text-sm text-gray-500 mb-1">Status</p>
                                <p className="font-bold text-gray-900 capitalize">{selectedNotification.data.status}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {selectedNotification.data.startDateTime && (
                          <div className="p-4 rounded-2xl border border-gray-100">
                            <p className="text-sm text-gray-500 mb-2">Date & Time</p>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <p className="font-bold text-gray-900">
                                {new Date(selectedNotification.data.startDateTime).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                              <span className="text-gray-400 mx-2">|</span>
                              <Clock className="w-4 h-4 text-gray-400" />
                              <p className="font-bold text-gray-900">
                                {new Date(selectedNotification.data.startDateTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        )}

                        {selectedNotification.data.location && (
                          <div className="p-4 rounded-2xl border border-gray-100">
                            <p className="text-sm text-gray-500 mb-2">Location</p>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <p className="font-bold text-gray-900">{selectedNotification.data.location}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                    <button
                      onClick={() => setSelectedId(null)}
                      className="px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:shadow-xl"
                      style={{ background: theme.colors.accent[500] }}
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
