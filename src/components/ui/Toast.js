'use client'
import { useNotificationStore } from '../../stores/useNotificationStore'

/**
 * Backward compatibility hook for legacy Toast usage.
 * Redirects calls to the global useNotificationStore.
 */
export const useToast = () => {
  const addNotification = useNotificationStore((state) => state.addNotification)

  return {
    addToast: (message, type = 'info') => {
      addNotification({ message, type, title: type.charAt(0).toUpperCase() + type.slice(1) })
    }
  }
}

// Legacy ToastProvider - now a no-op that just returns children
export function ToastProvider({ children }) {
  return children
}
