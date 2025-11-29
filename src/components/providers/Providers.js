'use client'
import { AuthProvider } from '../../hooks/useAuth'
import { ToastProvider } from '../ui/Toast'

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  )
}