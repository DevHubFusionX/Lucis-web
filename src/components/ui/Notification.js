import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export default function Notification({ notifications, onClose }) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  }

  const colors = {
    success: { bg: '#10b981', light: '#d1fae5' },
    error: { bg: '#ef4444', light: '#fee2e2' },
    warning: { bg: '#f59e0b', light: '#fef3c7' },
    info: { bg: '#3b82f6', light: '#dbeafe' }
  }

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => {
          const Icon = icons[notification.type]
          const color = colors[notification.type]
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className="bg-white rounded-xl shadow-2xl p-4 pr-12 min-w-[320px] max-w-md border pointer-events-auto"
              style={{ borderColor: color.light }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: color.light }}
                >
                  <Icon className="w-5 h-5" style={{ color: color.bg }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 mb-1">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
                <button
                  onClick={() => onClose(notification.id)}
                  className="absolute top-3 right-3 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
