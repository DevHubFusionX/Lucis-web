'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import TopBar from './TopBar'
import { theme } from '../../lib/theme'
import { 
  LayoutDashboard, 
  Briefcase, 
  Package, 
  Calendar, 
  Image, 
  Clock, 
  Star, 
  Bell, 
  CreditCard, 
  User, 
  LogOut,
  ChevronRight,
  Camera
} from 'lucide-react'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const pathname = usePathname()

  const mainNavigation = [
    { name: 'Dashboard', href: '/photographer', icon: LayoutDashboard },
    { name: 'Portfolio', href: '/photographer/portfolio', icon: Briefcase },
    { name: 'Packages', href: '/photographer/packages', icon: Package },
    { name: 'Bookings', href: '/photographer/bookings', icon: Calendar },
    { name: 'Gallery', href: '/photographer/gallery', icon: Image },
    { name: 'Availability', href: '/photographer/availability', icon: Clock },
    { name: 'Reviews', href: '/photographer/reviews', icon: Star }
  ]

  const systemNavigation = [
    { name: 'Notifications', href: '/photographer/notifications', icon: Bell, badge: 3 },
    { name: 'Payments', href: '/photographer/payments', icon: CreditCard },
    { name: 'Profile', href: '/photographer/profile', icon: User },
    { name: 'Logout', href: '/logout', icon: LogOut }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setSidebarOpen(false)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:flex lg:flex-col
        `}
      >
        {/* Logo Area */}
        <div className="flex items-center h-20 px-6 border-b border-gray-200">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center mr-3"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` 
            }}
          >
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 
              className="font-bold text-xl text-gray-900"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              Lucis
            </h1>
            <p className="text-xs text-gray-500">Professional</p>
          </div>
          <button 
            className="lg:hidden ml-auto text-gray-400 hover:text-gray-600 transition-colors" 
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          {/* Main Section */}
          <div className="mb-8">
            <div 
              className="text-xs font-bold uppercase tracking-wider mb-3 px-3"
              style={{ color: theme.colors.gray[500] }}
            >
              Main
            </div>
            <div className="space-y-1">
              {mainNavigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => setSidebarOpen(false)}
                    className="relative block"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative flex items-center px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'text-white shadow-lg' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      style={{
                        background: isActive 
                          ? `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` 
                          : 'transparent'
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                          style={{ backgroundColor: theme.colors.accent[700] }}
                        />
                      )}
                      <Icon 
                        className={`w-5 h-5 mr-3 transition-transform ${
                          hoveredItem === item.name ? 'scale-110' : 'scale-100'
                        }`}
                      />
                      <span className="font-medium">{item.name}</span>
                      {hoveredItem === item.name && !isActive && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* System Section */}
          <div>
            <div 
              className="text-xs font-bold uppercase tracking-wider mb-3 px-3"
              style={{ color: theme.colors.gray[500] }}
            >
              System
            </div>
            <div className="space-y-1">
              {systemNavigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => setSidebarOpen(false)}
                    className="relative block"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative flex items-center px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'text-white shadow-lg' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                      style={{
                        background: isActive 
                          ? `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` 
                          : 'transparent'
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicatorSystem"
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full"
                          style={{ backgroundColor: theme.colors.accent[700] }}
                        />
                      )}
                      <Icon 
                        className={`w-5 h-5 mr-3 transition-transform ${
                          hoveredItem === item.name ? 'scale-110' : 'scale-100'
                        }`}
                      />
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <span 
                          className="ml-auto px-2 py-0.5 text-xs font-bold rounded-full text-white"
                          style={{ backgroundColor: theme.colors.accent[500] }}
                        >
                          {item.badge}
                        </span>
                      )}
                      {hoveredItem === item.name && !isActive && !item.badge && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Footer Card */}
        <div className="p-4 border-t border-gray-200">
          <div 
            className="p-4 rounded-xl"
            style={{ 
              background: `linear-gradient(135deg, ${theme.colors.accent[50]}, ${theme.colors.accent[100]})`,
              border: `1px solid ${theme.colors.accent[200]}`
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: theme.colors.accent[500] }}
              >
                <Star className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Pro Plan</div>
                <div className="text-xs text-gray-600">Active</div>
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Unlock premium features and boost your visibility
            </p>
            <button 
              className="w-full px-3 py-2 rounded-lg text-xs font-semibold text-white transition-all hover:scale-105"
              style={{ backgroundColor: theme.colors.accent[500] }}
            >
              Upgrade Now
            </button>
          </div>
        </div>
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
