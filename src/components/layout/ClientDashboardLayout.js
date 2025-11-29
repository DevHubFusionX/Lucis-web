'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import authService from '../../services/authService'
import { theme } from '../../lib/theme'

export default function ClientDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const { user, logout } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.fetchUserProfile()
        setProfile(profileData)
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      }
    }

    fetchProfile()
  }, [])

  const navigation = [
    { name: 'Home', href: '/client', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', badge: null },
    { name: 'Search', href: '/client/search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', badge: null },
    { name: 'Bookings', href: '/client/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z', badge: 3 },
    { name: 'Notifications', href: '/client/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', badge: 5 },
    { name: 'Profile', href: '/client/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', badge: null }
  ]

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30">
      {/* Premium Top Bar */}
      <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <Link href="/client" className="flex items-center group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mr-3 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent hidden sm:block">PhotoConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative flex items-center px-4 py-2.5 text-sm rounded-xl transition-all font-semibold group"
                  style={{
                    background: isActive ? 'linear-gradient(135deg, #DBEAFE 0%, #E0E7FF 100%)' : 'transparent',
                    color: isActive ? '#1E3A8A' : '#6B7280'
                  }}
                >
                  <svg className="w-5 h-5 mr-2.5 transition-transform group-hover:scale-110" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24"
                       style={{color: isActive ? '#1E3A8A' : '#9CA3AF'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-pulse">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="relative group">
              <div className="cursor-pointer">
                {profile?.profilePicture?.url ? (
                  <div className="relative">
                    <img 
                      src={profile.profilePicture.url} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-4 group-hover:ring-blue-200 transition-all"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center ring-2 ring-blue-100 group-hover:ring-4 group-hover:ring-blue-200 transition-all shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {profile?.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Enhanced Dropdown Menu */}
              <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-12 transition-all duration-200 z-50">
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <p className="font-bold text-sm text-gray-900">
                    {profile?.firstName} {profile?.lastName}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {profile?.email}
                  </p>
                  {profile?.isVerified && (
                    <div className="flex items-center gap-1 mt-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-semibold text-green-600">Verified Account</span>
                    </div>
                  )}
                </div>
                <Link href="/client/profile" className="flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors text-gray-700 font-medium">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </Link>
                <button 
                  onClick={logout}
                  className="w-full flex items-center px-4 py-3 text-sm hover:bg-red-50 transition-colors text-red-600 font-medium"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto">
        <main className="max-w-7xl mx-auto w-full p-4 lg:p-8 pb-24 lg:pb-8">
          {children}
        </main>

        {/* Premium Mobile Bottom Navigation */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-2xl border-t border-gray-200/50 z-50">
          <div className="flex items-center justify-around h-20 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative flex flex-col items-center justify-center flex-1 h-full group"
                >
                  <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}>
                    <div className={`p-2.5 rounded-2xl transition-all ${isActive ? 'bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg' : 'bg-transparent'}`}>
                      <svg 
                        className="w-6 h-6 transition-colors" 
                        fill={isActive ? 'currentColor' : 'none'}
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{color: isActive ? '#FFFFFF' : '#9CA3AF'}}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold flex items-center justify-center shadow-lg animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs mt-1.5 font-semibold transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
