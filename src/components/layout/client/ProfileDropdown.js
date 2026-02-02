import Link from 'next/link'
import Image from 'next/image'
import { Settings, Heart, LogOut, ChevronDown, User } from 'lucide-react'
import { theme } from '../../../lib/theme'

export default function ProfileDropdown({ user, profile, isDropdownOpen, setIsDropdownOpen, logout }) {
  // Get profile picture URL from various possible sources
  const profilePictureUrl =
    user?.profilePicture?.url ||
    profile?.profilePicture?.url ||
    user?.avatar ||
    profile?.avatar ||
    null

  // Get user's first name for display and initials
  const firstName = user?.firstName || profile?.firstName || 'User'
  const lastName = user?.lastName || profile?.lastName || ''
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <div className="relative">
      <div
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 bg-white/5 pl-1 pr-3 py-1 rounded-full border border-gray-700/50 hover:bg-white/10 transition-all cursor-pointer"
      >
        {/* Profile Picture or Initials */}
        {profilePictureUrl ? (
          <div className="h-8 w-8 relative rounded-full overflow-hidden border border-gray-600">
            <Image
              fill
              src={profilePictureUrl}
              alt={`${firstName}'s avatar`}
              className="object-cover"
              sizes="32px"
            />
          </div>
        ) : (
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold border border-gray-600"
            style={{ backgroundColor: theme.colors.accent[600] }}
          >
            {initials || <User size={14} />}
          </div>
        )}

        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-bold text-white leading-none">
            {firstName}
          </span>
        </div>
        <ChevronDown size={14} className={`text-gray-500 hidden sm:block transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </div>

      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsDropdownOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl z-20 py-1 overflow-hidden backdrop-blur-xl bg-gray-900/90">
            {/* User Info Header */}
            <div className="px-4 py-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                {profilePictureUrl ? (
                  <div className="h-10 w-10 relative rounded-full overflow-hidden">
                    <Image
                      fill
                      src={profilePictureUrl}
                      alt={`${firstName}'s avatar`}
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: theme.colors.accent[600] }}
                  >
                    {initials}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-white">{firstName} {lastName}</p>
                  <p className="text-xs text-gray-400">{user?.email || profile?.email || ''}</p>
                </div>
              </div>
            </div>

            <Link
              href="/client/profile"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Settings size={16} />
              <span>Profile Settings</span>
            </Link>
            <Link
              href="/client/favorites"
              onClick={() => setIsDropdownOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Heart size={16} />
              <span>My Favorites</span>
            </Link>
            <div className="h-px bg-gray-800 my-1"></div>
            <button
              onClick={() => {
                setIsDropdownOpen(false)
                logout()
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={16} />
              <span>Log out</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
