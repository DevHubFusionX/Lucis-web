'use client'
import { useAuthGuard } from '../../hooks/useAuthGuard'

export default function Layout({ children }) {
  try {
    useAuthGuard()
    return <>{children}</>
  } catch (error) {
    console.error('Auth guard error:', error)
    return <div>Authentication error. Please refresh the page.</div>
  }
}