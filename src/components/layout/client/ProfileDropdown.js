import Link from 'next/link'
import { Settings, Heart, LogOut, ChevronDown } from 'lucide-react'

export default function ProfileDropdown({ user, profile, isDropdownOpen, setIsDropdownOpen, logout }) {
  return (
    <div className="relative">
      <div 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-3 bg-white/5 pl-1 pr-3 py-1 rounded-full border border-gray-700/50 hover:bg-white/10 transition-all cursor-pointer"
      >
        <img
          className="h-8 w-8 rounded-full object-cover border border-gray-600"
          src={user?.avatar || profile?.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
          alt="User avatar"
        />
        <div className="hidden sm:flex flex-col">
          <span className="text-xs font-bold text-white leading-none">
            {user?.firstName || profile?.firstName || 'Sarah'}
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
