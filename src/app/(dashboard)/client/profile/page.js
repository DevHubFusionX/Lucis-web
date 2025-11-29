'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../../../hooks/useAuth'
import authService from '../../../../services/authService'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profilePicture: null
  })
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    marketingEmails: false
  })

  const paymentMethods = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', default: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '09/26', default: false }
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.fetchUserProfile()
        setProfile({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          profilePicture: profileData.profilePicture || null
        })
      } catch (error) {
        console.error('Failed to fetch profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await updateUser({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone
      })
      setIsEditingProfile(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await authService.uploadProfilePicture(file)
      setProfile(prev => ({ ...prev, profilePicture: result }))
    } catch (error) {
      console.error('Failed to upload profile picture:', error)
      alert('Failed to upload profile picture. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{color: '#111827'}}>My Profile</h1>
        <p className="mt-1" style={{color: '#6B7280'}}>Manage your account settings and preferences</p>
      </div>

      {/* Profile Info */}
      <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{color: '#111827'}}>Profile Information</h2>
          <button 
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2 rounded-xl font-medium text-sm transition-all hover:shadow-md"
            style={{backgroundColor: isEditingProfile ? '#F3F4F6' : '#1E3A8A', color: isEditingProfile ? '#374151' : '#FFFFFF'}}
          >
            {isEditingProfile ? 'Cancel' : '✏️ Edit'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {profile.profilePicture?.url ? (
                <img 
                  src={profile.profilePicture.url} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold" style={{backgroundColor: '#DBEAFE', color: '#1E3A8A'}}>
                  {profile.firstName?.charAt(0) || 'U'}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
                id="profile-picture-upload"
                disabled={uploading}
              />
              <label
                htmlFor="profile-picture-upload"
                className="text-sm font-semibold cursor-pointer hover:underline disabled:opacity-50"
                style={{color: uploading ? '#9CA3AF' : '#1E3A8A'}}
              >
                {uploading ? 'Uploading...' : 'Change Photo'}
              </label>
            </div>
          </div>

          {/* Profile Fields */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>First Name</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{borderColor: '#E5E7EB', color: '#111827'}}
                  />
                ) : (
                  <p className="text-lg" style={{color: '#111827'}}>{profile.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Last Name</label>
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                    style={{borderColor: '#E5E7EB', color: '#111827'}}
                  />
                ) : (
                  <p className="text-lg" style={{color: '#111827'}}>{profile.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Email</label>
              <div className="flex items-center gap-2">
                <p className="text-lg" style={{color: '#111827'}}>{profile.email}</p>
                <span className="text-xs px-2 py-1 rounded-full" style={{backgroundColor: '#FEF3C7', color: '#F59E0B'}}>
                  Cannot be changed
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Phone</label>
              {isEditingProfile ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{borderColor: '#E5E7EB', color: '#111827'}}
                />
              ) : (
                <p className="text-lg" style={{color: '#111827'}}>{profile.phone}</p>
              )}
            </div>



            {isEditingProfile && (
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 px-4 py-3 rounded-xl font-medium transition-all hover:bg-gray-50"
                  style={{backgroundColor: '#F3F4F6', color: '#374151'}}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="flex-1 px-4 py-3 rounded-xl font-medium transition-all hover:shadow-md disabled:opacity-50"
                  style={{backgroundColor: '#1E3A8A', color: '#FFFFFF'}}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold" style={{color: '#111827'}}>Payment Methods</h2>
          <button className="px-4 py-2 rounded-xl font-medium text-sm transition-all hover:shadow-md" style={{backgroundColor: '#1E3A8A', color: '#FFFFFF'}}>
            + Add Card
          </button>
        </div>

        <div className="space-y-3">
          {paymentMethods.map(method => (
            <div key={method.id} className="p-4 rounded-xl flex items-center justify-between" style={{backgroundColor: '#F9FAFB'}}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: '#DBEAFE'}}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold" style={{color: '#111827'}}>{method.type} •••• {method.last4}</p>
                    {method.default && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{backgroundColor: '#D1FAE5', color: '#10B981'}}>
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{color: '#6B7280'}}>Expires {method.expiry}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{backgroundColor: '#F3F4F6', color: '#6B7280'}}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg hover:opacity-80 transition-opacity" style={{backgroundColor: '#FEE2E2', color: '#DC2626'}}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
        <h2 className="text-lg font-bold mb-6" style={{color: '#111827'}}>Notification Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl" style={{backgroundColor: '#F9FAFB'}}>
            <div>
              <p className="font-semibold" style={{color: '#111827'}}>Email Notifications</p>
              <p className="text-sm" style={{color: '#6B7280'}}>Receive booking updates via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{backgroundColor: settings.emailNotifications ? '#1E3A8A' : '#D1D5DB'}}></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl" style={{backgroundColor: '#F9FAFB'}}>
            <div>
              <p className="font-semibold" style={{color: '#111827'}}>SMS Notifications</p>
              <p className="text-sm" style={{color: '#6B7280'}}>Get text messages for important updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({...settings, smsNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{backgroundColor: settings.smsNotifications ? '#1E3A8A' : '#D1D5DB'}}></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl" style={{backgroundColor: '#F9FAFB'}}>
            <div>
              <p className="font-semibold" style={{color: '#111827'}}>Booking Reminders</p>
              <p className="text-sm" style={{color: '#6B7280'}}>Reminders before your sessions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.bookingReminders}
                onChange={(e) => setSettings({...settings, bookingReminders: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{backgroundColor: settings.bookingReminders ? '#1E3A8A' : '#D1D5DB'}}></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl" style={{backgroundColor: '#F9FAFB'}}>
            <div>
              <p className="font-semibold" style={{color: '#111827'}}>Marketing Emails</p>
              <p className="text-sm" style={{color: '#6B7280'}}>Receive tips and special offers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={(e) => setSettings({...settings, marketingEmails: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" style={{backgroundColor: settings.marketingEmails ? '#1E3A8A' : '#D1D5DB'}}></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
        <h2 className="text-lg font-bold mb-6" style={{color: '#111827'}}>Security</h2>
        
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-all" style={{backgroundColor: '#F9FAFB'}}>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              <span className="font-semibold" style={{color: '#111827'}}>Change Password</span>
            </div>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#9CA3AF'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-xl hover:shadow-md transition-all" style={{backgroundColor: '#F9FAFB'}}>
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-semibold" style={{color: '#111827'}}>Two-Factor Authentication</span>
            </div>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#9CA3AF'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
