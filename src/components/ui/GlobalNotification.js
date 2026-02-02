'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useNotificationStore } from '../../stores/useNotificationStore'

/**
 * Global Notification component that renders all active notifications from the store.
 * Should be placed at the root of the application (e.g., in Providers or RootLayout).
 */
export default function GlobalNotification() {
    const { notifications, removeNotification } = useNotificationStore()

    const icons = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info
    }

    const colors = {
        success: { bg: '#10b981', light: '#d1fae5', text: '#065f46' },
        error: { bg: '#ef4444', light: '#fee2e2', text: '#991b1b' },
        warning: { bg: '#f59e0b', light: '#fef3c7', text: '#92400e' },
        info: { bg: '#3b82f6', light: '#dbeafe', text: '#1e40af' }
    }

    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none w-full max-w-sm md:max-w-md">
            <AnimatePresence>
                {notifications.map((notification) => {
                    const Icon = icons[notification.type] || Info
                    const color = colors[notification.type] || colors.info

                    return (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.9, transition: { duration: 0.2 } }}
                            layout
                            className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-4 pr-12 border pointer-events-auto relative overflow-hidden group"
                            style={{ borderColor: color.light }}
                        >
                            {/* Progress bar (Optional visual cue) */}
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: (notification.duration || 5000) / 1000, ease: 'linear' }}
                                className="absolute bottom-0 left-0 h-1 opacity-20"
                                style={{ backgroundColor: color.bg }}
                            />

                            <div className="flex items-start gap-3">
                                <div
                                    className="p-2.5 rounded-xl flex-shrink-0"
                                    style={{ backgroundColor: color.light }}
                                >
                                    <Icon className="w-5 h-5" style={{ color: color.bg }} />
                                </div>
                                <div className="flex-1 min-w-0 pt-0.5">
                                    {notification.title && (
                                        <p className="font-bold text-gray-900 text-sm mb-0.5">{notification.title}</p>
                                    )}
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                        {notification.message}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeNotification(notification.id)}
                                    className="absolute top-3 right-3 p-1.5 rounded-xl hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}
