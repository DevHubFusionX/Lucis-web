import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cookies } from '../utils/cookies'
import { storage } from '../utils/storage'

export function useAuthGuard() {
  const router = useRouter()

  useEffect(() => {
    const token = cookies.get('auth-token')
    if (!token) {
      const userType = storage.get('userType')
      const redirectPath = userType === 'professional' ? '/professional-login' : '/client-login'
      router.push(redirectPath)
    }
  }, [router])
}