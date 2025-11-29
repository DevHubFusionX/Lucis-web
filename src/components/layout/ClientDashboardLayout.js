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
    { name: 'Dashboard', href: '/client', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', badge: null },
    { name: 'Discover', href: '/client/search', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', badge: null },
    { name: 'My Bookings', href: '/client/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z', badge: 3 },
    { name: 'Inbox', href: '/client/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', badge: 5 },
    { name: 'Account', href: '/client/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', badge: null }
  ]

  return (
    <div className="flex flex-col h-screen" style={{backgroundColor: theme.colors.neutral.warmGray}}>
      {/* Premium Top Bar */}
      <header className="shadow-sm sticky top-0 z-50" style={{backgroundColor: theme.colors.white, borderBottom: `1px solid ${theme.colors.gray[200]}`}}>
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <Link href="/client" className="flex items-center group">
            <img src="/Logo/topbar.svg" alt="LUCIS" className="w-auto h-45 mr-3 group-hover:scale-105 transition-all" />
           
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
                    backgroundColor: isActive ? theme.colors.primary[100] : 'transparent',
                    color: isActive ? theme.colors.primary[800] : theme.colors.gray[600],
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  <svg className="w-5 h-5 mr-2.5 transition-transform group-hover:scale-110" 
                       fill="none" stroke="currentColor" viewBox="0 0 24 24"
                       style={{color: isActive ? theme.colors.primary[800] : theme.colors.gray[600]}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.name}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-lg animate-pulse" style={{backgroundColor: '#EF4444'}}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-full" style={{backgroundColor: theme.colors.accent[500]}}></div>
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
                      className="w-10 h-10 rounded-full object-cover ring-2 group-hover:ring-4 transition-all"
                      style={{ringColor: theme.colors.primary[200]}}
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white" style={{backgroundColor: '#22C55E'}}></div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center ring-2 group-hover:ring-4 transition-all shadow-lg" style={{backgroundColor: theme.colors.primary[800], ringColor: theme.colors.primary[200]}}>
                    <span className="text-white font-bold text-sm">
                      {profile?.firstName?.charAt(0) || user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Enhanced Dropdown Menu */}
              <div className="absolute right-0 top-14 w-64 rounded-2xl shadow-2xl border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:top-12 transition-all duration-200 z-50" style={{backgroundColor: theme.colors.white, borderColor: theme.colors.gray[200]}}>
                <div className="px-4 py-3 border-b" style={{backgroundColor: theme.colors.primary[50], borderColor: theme.colors.gray[200]}}>
                  <p className="font-bold text-sm" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
                    {profile?.firstName} {profile?.lastName}
                  </p>
                  <p className="text-xs mt-0.5" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
                    {profile?.email}
                  </p>
                  {profile?.isVerified && (
                    <div className="flex items-center gap-1 mt-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#22C55E'}}>
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs font-semibold" style={{color: '#22C55E', fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Verified Account</span>
                    </div>
                  )}
                </div>
                <Link href="/client/profile" className="flex items-center px-4 py-3 text-sm transition-colors font-medium" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: theme.colors.gray[600]}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  View Profile
                </Link>
                <button 
                  onClick={logout}
                  className="w-full flex items-center px-4 py-3 text-sm transition-colors font-medium"
                  style={{color: '#EF4444', fontFamily: theme.typography.fontFamily.sans.join(', ')}}
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
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 shadow-2xl border-t z-50" style={{backgroundColor: theme.colors.white, borderColor: theme.colors.gray[200]}}>
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
                    <div className={`p-2.5 rounded-2xl transition-all`} style={{backgroundColor: isActive ? theme.colors.primary[800] : 'transparent'}}>
                      <svg 
                        className="w-6 h-6 transition-colors" 
                        fill={isActive ? 'currentColor' : 'none'}
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{color: isActive ? '#FFFFFF' : theme.colors.gray[600]}}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center shadow-lg animate-pulse" style={{backgroundColor: '#EF4444'}}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs mt-1.5 font-semibold transition-colors`} style={{color: isActive ? theme.colors.primary[800] : theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full" style={{backgroundColor: theme.colors.accent[500]}}></div>
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
