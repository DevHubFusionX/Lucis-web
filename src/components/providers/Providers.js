'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '../../lib/queryClient'
import { GoogleOAuthProvider } from '@react-oauth/google'
import GlobalNotification from '../ui/GlobalNotification'
import { useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'

// Component to initialize auth on mount
function AuthInitializer({ children }) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return children
}

export default function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <AuthInitializer>
          {children}
          <GlobalNotification />
        </AuthInitializer>
      </GoogleOAuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
