'use client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from '../../hooks/useAuth'
import { ToastProvider } from '../ui/Toast'

export default function Providers({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}