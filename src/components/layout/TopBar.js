import { useAuth } from '../../hooks/useAuth'
import { theme } from '../../lib/theme'
import Image from 'next/image'
import { Bell, Search } from 'lucide-react'

export default function TopBar({ onMenuClick, sidebarOpen }) {
  const { user } = useAuth()

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    }
    return user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'
  }

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user?.firstName || user?.email || 'User'
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        {/* Left Section: Mobile Menu & Logo */}
        <div className="flex items-center gap-1.5 sm:gap-4">
          <button
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent-500 transition-colors" />
              <input
                type="text"
                placeholder="Search anything..."
                className="pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-accent-500 rounded-xl text-sm transition-all focus:ring-4 focus:ring-accent-500/10 outline-none w-64"
              />
            </div>
          </div>

          {!sidebarOpen && (
            <div className="lg:hidden flex items-center">
              <Image src="/Logo/topbar.svg" alt="Lucis" width={70} height={14} className="h-37 w-auto" />
            </div>
          )}
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button className="hidden sm:flex relative p-2.5 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent-500 border-2 border-white rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-100">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900 leading-none mb-1">{getDisplayName()}</span>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Professional</span>
            </div>

            {user?.profilePicture?.url ? (
              <div className="relative group cursor-pointer">
                <img
                  src={user.profilePicture.url}
                  alt="Profile"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-50 group-hover:ring-accent-500/20 transition-all"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-accent-600 text-sm font-bold border-2 border-accent-50 transition-all cursor-pointer hover:bg-accent-50" style={{ backgroundColor: theme.colors.accent[50] }}>
                {getInitials()}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
