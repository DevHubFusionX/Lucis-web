'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import TopBar from './TopBar'
import { dashboardTheme } from '../../lib/dashboardTheme'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const mainNavigation = [
    { name: 'Dashboard', href: '/photographer', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z' },
    { name: 'Portfolio', href: '/portfolio', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Packages', href: '/photographer/packages', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { name: 'Bookings', href: '/photographer/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z' },
    { name: 'Gallery', href: '/photographer/gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Availability', href: '/photographer/availability', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { name: 'Reviews', href: '/photographer/reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.837-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' }
  ]

  const systemNavigation = [
    { name: 'Notifications', href: '/photographer/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { name: 'Payments', href: '/photographer/payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { name: 'Profile', href: '/photographer/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { name: 'Logout', href: '/logout', icon: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' }
  ]

  return (
    <div className="flex h-screen" style={{backgroundColor: dashboardTheme.colors.main.bg}}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-65 shadow-xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform lg:translate-x-0 lg:relative lg:flex lg:flex-col lg:w-65`} style={{backgroundColor: dashboardTheme.colors.sidebar.bg}}>
        {/* Logo Area */}
        <div className="flex items-center h-[70px] px-[18px]" style={{borderBottom: `1px solid ${dashboardTheme.colors.sidebar.border}`}}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3" style={{backgroundColor: dashboardTheme.colors.primary[600]}}>
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium text-lg" style={{color: dashboardTheme.colors.sidebar.text}}>PhotoConnect</span>
          <button className="lg:hidden ml-auto hover:text-white" style={{color: dashboardTheme.colors.sidebar.textSecondary}} onClick={() => setSidebarOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {/* Main Section */}
          <div className="px-[18px] pt-5 pb-3">
            <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{color: dashboardTheme.colors.sidebar.textSecondary}}>MAIN</div>
            <div className="space-y-1">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center px-[18px] py-3 text-sm rounded-lg transition-all duration-200 group font-medium`}
                    style={{
                      backgroundColor: isActive ? dashboardTheme.colors.primary[600] : dashboardTheme.colors.nav.inactiveBg,
                      color: isActive ? dashboardTheme.colors.nav.activeText : dashboardTheme.colors.nav.inactiveText
                    }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r" style={{backgroundColor: dashboardTheme.colors.accent[600]}}></div>
                    )}
                    <svg className={`w-5 h-5 mr-3 transition-colors`} 
                         style={{color: isActive ? dashboardTheme.colors.nav.activeText : dashboardTheme.colors.sidebar.textSecondary}}
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* System Section */}
          <div className="px-[18px] pt-5 pb-3">
            <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{color: dashboardTheme.colors.sidebar.textSecondary}}>SYSTEM</div>
            <div className="space-y-1">
              {systemNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`relative flex items-center px-[18px] py-3 text-sm rounded-lg transition-all duration-200 group font-medium`}
                    style={{
                      backgroundColor: isActive ? dashboardTheme.colors.primary[600] : dashboardTheme.colors.nav.inactiveBg,
                      color: isActive ? dashboardTheme.colors.nav.activeText : dashboardTheme.colors.nav.inactiveText
                    }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r" style={{backgroundColor: dashboardTheme.colors.accent[600]}}></div>
                    )}
                    <svg className={`w-5 h-5 mr-3 transition-colors`}
                         style={{color: isActive ? dashboardTheme.colors.nav.activeText : dashboardTheme.colors.sidebar.textSecondary}}
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
