import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../stores/authStore'

/**
 * Auth guard hook - redirects to login if not authenticated
 */
export function useAuthGuard() {
  const router = useRouter()
  const { user, userType, loading } = useAuthStore()

  useEffect(() => {
    // Wait for auth to initialize
    if (loading) return

    if (!user) {
      const redirectPath = userType === 'professional' ? '/professional-login' : '/client-login'
      router.push(redirectPath)
    }
  }, [user, userType, loading, router])
}
