'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import authService from '../../services/authService'
import { theme } from '../../lib/theme'

// Modular Components
import Sidebar from './client/Sidebar'
import Topbar from './client/Topbar'
import MobileNav from './client/MobileNav'

export default function ClientDashboardLayout({ children }) {
  const [profile, setProfile] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { logout, user } = useAuth()

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

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900" style={{ fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar 
          user={user}
          profile={profile}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          logout={logout}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-100 p-4 md:p-6 pb-32 md:pb-6">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}
