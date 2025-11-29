import { useAuth } from '../../hooks/useAuth'
import authService from '../../services/authService'

export default function TopBar({ onMenuClick }) {
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
    <header className="bg-white shadow-sm" style={{borderBottom: '1px solid #E5E7EB'}}>
      <div className="flex items-center justify-between h-16 px-6">
        <button 
          className="lg:hidden hover:text-black" 
          style={{color: '#9CA3AF'}}
          onClick={onMenuClick}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <div className="flex items-center space-x-4 ml-auto">
          <div className="flex items-center space-x-3">
            {user?.profilePicture?.url ? (
              <img 
                src={user.profilePicture.url} 
                alt="Profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#1E3A8A'}}>
                <span className="text-white text-sm font-medium">{getInitials()}</span>
              </div>
            )}
            <span className="font-medium" style={{color: '#111827'}}>{getDisplayName()}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-white px-4 py-2 rounded-lg transition-colors hover:opacity-90" 
            style={{backgroundColor: '#DC2626'}}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}