import { create } from 'zustand'

/**
 * Global store for managing notifications and toasts across the application.
 * Replaces Context-based ToastProvider and local page notifications.
 */
export const useNotificationStore = create((set) => ({
    notifications: [],

    /**
     * Add a new notification to the stack
     * @param {Object} notification - The notification object
     * @param {string} notification.title - Optional title
     * @param {string} notification.message - Required message
     * @param {string} notification.type - 'success' | 'error' | 'warning' | 'info'
     * @param {number} notification.duration - Optional duration in ms (default: 5000)
     */
    addNotification: (notification) => {
        const id = Date.now()
        const type = notification.type || 'info'
        const duration = notification.duration || 5000

        set((state) => ({
            notifications: [
                ...state.notifications,
                { id, ...notification, type }
            ]
        }))

        // Auto-remove after duration
        if (duration !== Infinity) {
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id)
                }))
            }, duration)
        }

        return id
    },

    /**
     * Remove a notification by ID
     * @param {number} id - Notification ID
     */
    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id)
        }))
    },

    /**
     * Clear all active notifications
     */
    clearAll: () => set({ notifications: [] })
}))

// Shorthand helpers
export const useNotify = () => {
    const add = useNotificationStore((state) => state.addNotification)

    return {
        success: (message, title = 'Success') => add({ type: 'success', message, title }),
        error: (message, title = 'Error') => add({ type: 'error', message, title }),
        warning: (message, title = 'Warning') => add({ type: 'warning', message, title }),
        info: (message, title = 'Info') => add({ type: 'info', message, title }),
    }
}
