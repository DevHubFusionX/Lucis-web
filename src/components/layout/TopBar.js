import { useAuth } from '../../hooks/useAuth'
import authService from '../../services/authService'
import { theme } from '../../lib/theme'
import Image from 'next/image'

export default function TopBar({ onMenuClick, sidebarOpen }) {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await authService.logout()
      logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

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
    <header className="shadow-md" style={{background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})`, borderBottom: `1px solid ${theme.colors.accent[700]}`}}>
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden text-white hover:text-white/80 transition-colors" 
            onClick={onMenuClick}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {!sidebarOpen && (
            <Image src="/Logo/logo.svg" alt="Lucis" width={120} height={32} className="h-48 w-auto lg:hidden" />
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            {user?.profilePicture?.url ? (
              <img 
                src={user.profilePicture.url} 
                alt="Profile" 
                className="w-9 h-9 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-white/30" style={{backgroundColor: 'rgba(255,255,255,0.2)'}}>
                {getInitials()}
              </div>
            )}
            <span className="font-semibold text-white hidden sm:block">{getDisplayName()}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all font-medium backdrop-blur-sm border border-white/30" 
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
