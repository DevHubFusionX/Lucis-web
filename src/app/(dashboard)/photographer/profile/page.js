'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '../../../../hooks/useAuth'
import professionalService from '../../../../services/professionalService'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    skills: [],
    baseCity: '',
    currentAddress: '',
    profilePicture: null,
    isVerified: false
  })

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        skills: user.skills || [],
        baseCity: user.baseCity || '',
        currentAddress: user.currentAddress || '',
        profilePicture: user.profilePicture || null,
        isVerified: user.isVerified || false,
        longitude: user.longitude || 0,
        latitude: user.latitude || 0,
        gallery: user.gallery || []
      })
    }
    setLoading(false)
  }, [user])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await updateUser({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        bio: profile.bio,
        baseCity: profile.baseCity,
        currentAddress: profile.currentAddress
      }, 'professional')
      setIsEditing(false)
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
      // For now, we'll use a placeholder URL and publicId
      // In a real app, you'd upload to a service like Cloudinary first
      const profilePictureData = {
        publicId: `profile_${Date.now()}`,
        url: URL.createObjectURL(file) // Temporary local URL
      }
      
      await professionalService.uploadProfilePicture(profilePictureData)
      
      // Refresh profile to get updated data
      const updatedProfile = await professionalService.getProfile()
      setProfile(prev => ({ ...prev, profilePicture: updatedProfile.profilePicture }))
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
      {/* Profile Header */}
      <div className="p-8 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              {profile.profilePicture?.url ? (
                <img 
                  src={profile.profilePicture.url} 
                  alt="Profile" 
                  className="w-28 h-28 rounded-2xl object-cover border-2 border-blue-100"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-5xl font-bold" style={{backgroundColor: '#DBEAFE', color: '#1E3A8A'}}>
                  {profile.firstName?.charAt(0) || 'P'}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
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
                className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:opacity-80 transition-opacity"
                style={{backgroundColor: '#1E3A8A'}}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </label>
            </div>
            <div>
              <h1 className="text-3xl font-bold" style={{color: '#111827'}}>
                {profile.firstName} {profile.lastName}
              </h1>
              <p className="text-lg mt-1 font-semibold" style={{color: '#1E3A8A'}}>Professional Photographer</p>
              <div className="flex items-center gap-2 mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#6B7280'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm" style={{color: '#6B7280'}}>{profile.baseCity}</p>
              </div>
              <div className="flex gap-2 mt-3">
                <span className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{
                  backgroundColor: profile.isVerified ? '#D1FAE5' : '#FEF3C7',
                  color: profile.isVerified ? '#10B981' : '#F59E0B'
                }}>
                  {profile.isVerified ? '✓ Verified' : '⏳ Pending Verification'}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
            disabled={saving}
            className="px-6 py-3 rounded-xl font-medium text-white shadow-sm hover:shadow-md transition-all disabled:opacity-50"
            style={{backgroundColor: '#1E3A8A'}}
          >
            {saving ? '💾 Saving...' : isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
          </button>
        </div>
      </div>

      {/* About Me */}
      <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-lg font-semibold" style={{color: '#111827'}}>About Me</h2>
        </div>
        {isEditing ? (
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
            style={{borderColor: '#E5E7EB', color: '#111827'}}
            rows="4"
            placeholder="Tell clients about your photography style and experience..."
          />
        ) : (
          <p className="leading-relaxed" style={{color: '#374151'}}>
            {profile.bio || 'No bio added yet. Click Edit Profile to add your story.'}
          </p>
        )}
      </div>

      {/* Skills */}
      <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h2 className="text-lg font-semibold" style={{color: '#111827'}}>Skills & Specialties</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {profile.skills && profile.skills.length > 0 ? profile.skills.map((skill, i) => (
            <span key={i} className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm" style={{backgroundColor: '#DBEAFE', color: '#1E3A8A'}}>
              {skill}
            </span>
          )) : (
            <p className="text-gray-500">No skills added yet. Update your profile to showcase your specialties.</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h2 className="text-lg font-semibold" style={{color: '#111827'}}>Contact</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: '#6B7280'}}>Email</label>
              <p className="text-gray-900">{profile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: '#6B7280'}}>Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{borderColor: '#E5E7EB', color: '#111827'}}
                />
              ) : (
                <p className="text-gray-900">{profile.phone || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-lg font-semibold" style={{color: '#111827'}}>Location</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: '#6B7280'}}>Base City</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.baseCity}
                  onChange={(e) => setProfile({...profile, baseCity: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{borderColor: '#E5E7EB', color: '#111827'}}
                />
              ) : (
                <p className="text-gray-900">{profile.baseCity || 'Not specified'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{color: '#6B7280'}}>Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.currentAddress}
                  onChange={(e) => setProfile({...profile, currentAddress: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all"
                  style={{borderColor: '#E5E7EB', color: '#111827'}}
                  placeholder="Optional: Studio or business address"
                />
              ) : (
                <p className="text-gray-900">{profile.currentAddress || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <h2 className="text-lg font-semibold" style={{color: '#111827'}}>Social Links</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>📷 Instagram</label>
            {isEditing ? (
              <input
                type="url"
                value={profile.instagram}
                onChange={(e) => setProfile({...profile, instagram: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                style={{borderColor: '#E5E7EB', color: '#111827'}}
              />
            ) : (
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{color: '#1E3A8A'}}>
                {profile.instagram}
              </a>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>🌐 Website</label>
            {isEditing ? (
              <input
                type="url"
                value={profile.website}
                onChange={(e) => setProfile({...profile, website: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                style={{borderColor: '#E5E7EB', color: '#111827'}}
              />
            ) : (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{color: '#1E3A8A'}}>
                {profile.website}
              </a>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>🎨 Portfolio</label>
            {isEditing ? (
              <input
                type="url"
                value={profile.portfolio}
                onChange={(e) => setProfile({...profile, portfolio: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                style={{borderColor: '#E5E7EB', color: '#111827'}}
              />
            ) : (
              <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{color: '#1E3A8A'}}>
                {profile.portfolio}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Studio Location */}
      <div className="p-6 rounded-2xl shadow-sm" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 className="text-lg font-semibold" style={{color: '#111827'}}>Studio Location</h2>
        </div>
        <div className="w-full h-64 rounded-xl overflow-hidden" style={{backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB'}}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{color: '#6B7280'}}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{backgroundColor: '#DBEAFE'}}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-semibold" style={{color: '#374151'}}>{profile.location}</p>
            <p className="text-sm" style={{color: '#9CA3AF'}}>Map integration coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}