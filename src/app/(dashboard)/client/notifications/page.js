'use client'
import { useState, useEffect } from 'react'
import { theme } from '../../../../lib/theme'
import { 
  Bell, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  DollarSign, 
  Clock,
  MoreVertical,
  Check,
  Trash2,
  Inbox,
  X,
  MapPin,
  Camera
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import notificationService from '../../../../services/client/notificationService'

const NOTIFICATION_ICONS = {
  booking: { icon: Calendar, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  payment: { icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  message: { icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-50' },
  alert: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-50' },
  success: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
  default: { icon: Bell, color: 'text-gray-500', bg: 'bg-gray-50' }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedNotif, setSelectedNotif] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await notificationService.getNotifications()
      setNotifications(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDetail = async (notif) => {
    setSelectedNotif(notif)
    setDetailLoading(true)
    try {
      const details = await notificationService.getNotificationDetail(notif.id)
      setSelectedNotif(details)
      if (!notif.isRead) {
        markAsRead(notif.id)
      }
    } catch (err) {
      console.error('Failed to fetch detail:', err)
    } finally {
      setDetailLoading(false)
    }
  }

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (err) {
      console.error('Failed to mark as read:', err)
    }
  }

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead
    return true
  })

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 tracking-tight" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
              Notifications
            </h1>
            <p className="text-gray-500 mt-4 font-medium">
              Stay updated with your bookings, payments, and messages.
            </p>
          </div>

          <div className="flex items-center gap-3">
             <button 
               onClick={markAllRead}
               className="px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-600 hover:text-primary-800 transition-colors"
               style={{ color: theme.colors.primary[600] }}
             >
               Mark all as read
             </button>
             <div className="flex bg-white p-1 rounded-xl border border-gray-100 shadow-sm">
                <button 
                  onClick={() => setFilter('all')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'unread' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Unread
                </button>
             </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-white rounded-3xl animate-pulse border border-gray-100" />
            ))
          ) : filteredNotifications.length > 0 ? (
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((notif, idx) => {
                const typeInfo = NOTIFICATION_ICONS[notif.type?.toLowerCase()] || NOTIFICATION_ICONS.default
                const Icon = typeInfo.icon
                
                return (
                  <motion.div
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    onClick={() => handleOpenDetail(notif)}
                    className={`group bg-white p-6 rounded-[2rem] border border-gray-100 transition-all duration-300 relative flex gap-6 cursor-pointer ${!notif.isRead ? 'shadow-lg border-primary-50 ring-1 ring-primary-50/50' : 'hover:shadow-md'}`}
                  >
                    {!notif.isRead && (
                      <div className="absolute top-6 right-6 w-2 h-2 rounded-full" style={{ backgroundColor: theme.colors.accent[500] }} />
                    )}
                    
                    <div className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${typeInfo.bg} ${typeInfo.color} shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                       <Icon size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                         <span className={`text-[10px] font-black uppercase tracking-widest ${typeInfo.color}`}>
                           {notif.type || 'Notification'}
                         </span>
                         <span className="text-gray-300 font-medium">•</span>
                         <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                            <Clock size={12} />
                            {new Date(notif.createdAt).toLocaleDateString()}
                         </div>
                      </div>
                      
                      <h3 className={`text-lg font-bold text-gray-900 mb-1 ${!notif.isRead ? 'pr-4' : ''}`}>
                        {notif.title || 'New Notification'}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed truncate">
                        {notif.message}
                      </p>
                    </div>

                    <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-gray-300 hover:text-gray-500 transition-colors">
                          <MoreVertical size={20} />
                       </button>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm text-center px-6">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <Inbox size={40} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                All caught up
              </h3>
              <p className="text-gray-500 max-w-xs font-medium">
                You don't have any notifications to show right now.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNotif && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotif(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="absolute top-6 right-6">
                 <button 
                  onClick={() => setSelectedNotif(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors"
                 >
                   <X size={20} />
                 </button>
              </div>

              <div className="p-8 pb-0">
                 {(() => {
                   const typeInfo = NOTIFICATION_ICONS[selectedNotif.type?.toLowerCase()] || NOTIFICATION_ICONS.default
                   const DetailIcon = typeInfo.icon
                   return (
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${typeInfo.bg} ${typeInfo.color}`}>
                        <DetailIcon size={24} />
                     </div>
                   )
                 })()}
                 
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${NOTIFICATION_ICONS[selectedNotif.type?.toLowerCase()]?.color || 'text-gray-400'}`}>
                         {selectedNotif.type || 'Notification'}
                       </span>
                       <span className="text-gray-300">•</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                         {new Date(selectedNotif.createdAt).toLocaleString()}
                       </span>
                    </div>
                    <h2 className="text-3xl font-black text-gray-900" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                      {selectedNotif.title || 'Notification Details'}
                    </h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      {selectedNotif.message}
                    </p>
                 </div>

                 {detailLoading ? (
                    <div className="mt-8 py-10 flex flex-col items-center gap-4 text-gray-400">
                       <div className="w-8 h-8 border-4 border-gray-100 border-t-accent-500 rounded-full animate-spin"></div>
                       <span className="text-xs font-bold uppercase tracking-widest">Loading details...</span>
                    </div>
                 ) : selectedNotif.data && (
                   <div className="mt-8 pt-8 border-t border-gray-50 pb-8">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Related Information</h4>
                      
                      {selectedNotif.data.user && (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                           <img 
                            src={selectedNotif.data.user.profilePicture?.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"} 
                            className="w-12 h-12 rounded-xl object-cover"
                           />
                           <div>
                              <p className="text-sm font-black text-gray-900">{selectedNotif.data.user.firstName} {selectedNotif.data.user.lastName}</p>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                 <MapPin size={10} />
                                 {selectedNotif.data.location || 'Nearby'}
                              </div>
                           </div>
                        </div>
                      )}

                      {selectedNotif.data.serviceType && (
                        <div className="mt-4 grid grid-cols-2 gap-4">
                           <div className="p-4 rounded-2xl bg-gray-50">
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Service Type</p>
                              <p className="text-xs font-black text-gray-900">{selectedNotif.data.serviceType}</p>
                           </div>
                           <div className="p-4 rounded-2xl bg-gray-50">
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                              <span className="inline-flex px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest">
                                {selectedNotif.data.status}
                              </span>
                           </div>
                        </div>
                      )}
                   </div>
                 )}
              </div>

              <div className="p-8 bg-gray-50/50 flex gap-4">
                 <button 
                  onClick={() => setSelectedNotif(null)}
                  className="flex-1 py-4 bg-white border border-gray-300 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
                 >
                   Close
                 </button>
                 {selectedNotif.data?.professionalId && (
                   <button className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all" style={{ backgroundColor: theme.colors.primary[900] }}>
                     View Booking
                   </button>
                 )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
