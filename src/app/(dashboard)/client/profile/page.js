'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../../../hooks/useAuth'
import { ClientProfileService } from '../../../../services/client'
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  CreditCard, 
  Shield, 
  Lock, 
  Smartphone, 
  Bell, 
  Check, 
  ChevronRight,
  Loader2,
  Trash2,
  Plus
} from 'lucide-react'
import { theme } from '../../../../lib/theme'

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
    profilePicture: null,
    isVerified: false,
    createdAt: null
  })
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    bookingReminders: true,
    marketingEmails: false
  })

  // Mock payment methods for visual consistency
  const paymentMethods = [
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', default: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '09/26', default: false }
  ]

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await ClientProfileService.getProfile()
        setProfile({
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          profilePicture: profileData.profilePicture || null,
          isVerified: profileData.isVerified || false,
          createdAt: profileData.createdAt || null
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
      await ClientProfileService.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone
      })
      // Update auth context
      updateUser({
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

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB.')
      return
    }

    setUploading(true)
    try {
      const result = await ClientProfileService.uploadProfilePicture(file)
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
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex h-full p-4 md:p-8" style={{ fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
      <div className="w-full max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>Settings</h1>
            <p className="text-gray-500 mt-1">Manage your account information and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          
          {/* Profile Card */}
          <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                <User size={20} style={{ color: theme.colors.accent[600] }} />
                Profile Information
              </h2>
              <button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-5 py-2 rounded-xl font-bold text-sm transition-all"
                style={{
                  backgroundColor: isEditingProfile ? theme.colors.gray[100] : theme.colors.accent[50],
                  color: isEditingProfile ? theme.colors.gray[600] : theme.colors.accent[700]
                }}
              >
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group cursor-pointer">
                  <div 
                    className="w-32 h-32 rounded-full overflow-hidden border-4 relative bg-gray-50 flex items-center justify-center"
                    style={{ borderColor: theme.colors.accent[50] }}
                  >
                    {profile.profilePicture?.url ? (
                      <img src={profile.profilePicture.url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold" style={{ color: theme.colors.accent[300] }}>{profile.firstName?.charAt(0)}</span>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="pfp-upload" 
                    className="absolute bottom-1 right-1 text-white p-2.5 rounded-full shadow-lg transition-all cursor-pointer ring-4 ring-white"
                    style={{ backgroundColor: theme.colors.accent[600] }}
                  >
                    <Camera size={16} />
                  </label>
                  <input id="pfp-upload" type="file" className="hidden" accept="image/*" onChange={handleProfilePictureUpload} disabled={uploading} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-gray-900">{profile.firstName} {profile.lastName}</p>
                  <p className="text-xs text-gray-500 font-medium">Client Account</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">First Name</label>
                  {isEditingProfile ? (
                    <input 
                      type="text" 
                      value={profile.firstName} 
                      onChange={e => setProfile({...profile, firstName: e.target.value})} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none transition-all font-medium" 
                      style={{ focusBorderColor: theme.colors.accent[500] }}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50/50 border border-transparent rounded-xl text-gray-900 font-bold">{profile.firstName}</div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Last Name</label>
                  {isEditingProfile ? (
                    <input 
                      type="text" 
                      value={profile.lastName} 
                      onChange={e => setProfile({...profile, lastName: e.target.value})} 
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none transition-all font-medium"
                      style={{ focusBorderColor: theme.colors.accent[500] }}
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50/50 border border-transparent rounded-xl text-gray-900 font-bold">{profile.lastName}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <div className="relative">
                    <input type="email" value={profile.email} disabled className="w-full px-4 py-3 pl-10 bg-gray-50/50 border-transparent rounded-xl text-gray-500 font-medium cursor-not-allowed" />
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Phone Number</label>
                  <div className="relative">
                    {isEditingProfile ? (
                      <input 
                        type="tel" 
                        value={profile.phone} 
                        onChange={e => setProfile({...profile, phone: e.target.value})} 
                        className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white outline-none transition-all font-medium"
                        style={{ focusBorderColor: theme.colors.accent[500] }}
                      />
                    ) : (
                      <div className="px-4 py-3 pl-10 bg-gray-50/50 border border-transparent rounded-xl text-gray-900 font-bold">{profile.phone || 'No phone added'}</div>
                    )}
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {isEditingProfile && (
                  <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-50 mt-2">
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="px-6 py-2.5 rounded-xl font-bold bg-gray-900 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                      style={{ backgroundColor: theme.colors.primary[900] }}
                    >
                      {saving && <Loader2 size={16} className="animate-spin" />}
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Secondary Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Notification Settings */}
            <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm h-full">
               <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                 <Bell size={20} style={{ color: theme.colors.accent[600] }} />
                 Notifications
               </h2>
               <div className="space-y-6">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive booking updates via email' },
                    { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Get text messages for important updates' },
                    { key: 'bookingReminders', label: 'Booking Reminders', desc: 'Reminders before your sessions' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings[item.key]} onChange={(e) => setSettings({...settings, [item.key]: e.target.checked})} className="sr-only peer" />
                        <div 
                          className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{ 
                            backgroundColor: settings[item.key] ? theme.colors.accent[600] : theme.colors.gray[200]
                          }}
                        ></div>
                      </label>
                    </div>
                  ))}
               </div>
            </section>

            {/* Payment & Security combined for balance */}
            <div className="space-y-8 h-full flex flex-col">
              {/* Payment Methods */}
              <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm flex-1">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                      <CreditCard size={20} style={{ color: theme.colors.accent[600] }} />
                      Payment
                    </h2>
                    <button 
                      className="hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      style={{ color: theme.colors.accent[600] }}
                    >
                      <Plus size={20} />
                    </button>
                 </div>
                 
                 <div className="space-y-3">
                   {paymentMethods.map(method => (
                     <div key={method.id} className="p-3 border border-gray-100 rounded-2xl flex items-center justify-between hover:border-gray-300 transition-colors group">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-600 font-bold text-xs">
                           {method.type === 'Visa' ? 'VISA' : 'MC'}
                         </div>
                         <div>
                           <p className="font-bold text-gray-900 text-sm">•••• {method.last4}</p>
                           <p className="text-xs text-gray-400">Expires {method.expiry}</p>
                         </div>
                       </div>
                       {method.default && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase tracking-wide">Default</span>}
                     </div>
                   ))}
                 </div>
              </section>

              {/* Security Actions */}
              <section className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm">
                 <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                   <Shield size={20} style={{ color: theme.colors.accent[600] }} />
                   Security
                 </h2>
                 <div className="space-y-2">
                   <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                      <span className="font-bold text-gray-700 text-sm flex items-center gap-3">
                        <Lock size={16} className="text-gray-400 group-hover:text-gray-600" /> Change Password
                      </span>
                      <ChevronRight size={16} className="text-gray-400" />
                   </button>
                   <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                      <span className="font-bold text-gray-700 text-sm flex items-center gap-3">
                        <Smartphone size={16} className="text-gray-400 group-hover:text-gray-600" /> Two-Factor Auth
                      </span>
                      <ChevronRight size={16} className="text-gray-400" />
                   </button>
                 </div>
              </section>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
