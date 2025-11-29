'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { AuthService } from '../services'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = AuthService.getToken()
    if (token) {
      setUser(AuthService.getUser())
      setUserType(AuthService.getUserType())
    }
    setLoading(false)
  }, [])

  const login = async (credentials, type = 'client') => {
    try {
      const data = await AuthService.login(credentials, type)
      setUser(data.user)
      setUserType(type)
      
      const dashboardPath = type === 'professional' ? '/photographer' : '/client'
      router.push(dashboardPath)
      
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signup = async (userData, type = 'client') => {
    try {
      const data = await AuthService.signup(userData, type)
      setUser(data.user)
      setUserType(type)
      
      const dashboardPath = type === 'professional' ? '/photographer' : '/client'
      router.push(dashboardPath)
      
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    await AuthService.logout()
    setUser(null)
    setUserType(null)
    router.push('/')
  }

  const updateUser = async (userData) => {
    try {
      const data = await AuthService.updateUser(userData, userType)
      setUser(data.user)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    userType,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}