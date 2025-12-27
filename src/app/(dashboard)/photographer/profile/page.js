'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../../../hooks/useAuth'
import professionalService from '../../../../services/professionalService'
import { theme } from '../../../../lib/theme'
import { Camera, User, Mail, Phone, MapPin, Globe, Instagram, Briefcase, Award, Edit3, Save, X, Clock } from 'lucide-react'

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
        isVerified: user.isVerified || false
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
      const profilePictureData = {
        publicId: `profile_${Date.now()}`,
        url: URL.createObjectURL(file)
      }
      
      await professionalService.uploadProfilePicture(profilePictureData)
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
        <div 
          className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: theme.colors.accent[500], borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 
            className="text-4xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            My Profile
          </h1>
          <p className="text-gray-600 text-lg">Manage your professional information</p>
        </div>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
          >
            <Edit3 className="w-5 h-5" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-200 transition-all hover:border-gray-300 flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
            <button 
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50"
              style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture */}
          <div className="relative">
            {profile.profilePicture?.url ? (
              <img 
                src={profile.profilePicture.url} 
                alt="Profile" 
                className="w-32 h-32 rounded-2xl object-cover border-4"
                style={{ borderColor: theme.colors.accent[100] }}
              />
            ) : (
              <div 
                className="w-32 h-32 rounded-2xl flex items-center justify-center text-5xl font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
              >
                {profile.firstName?.charAt(0) || 'P'}
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
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
              className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all hover:scale-110"
              style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
            >
              <Camera className="w-6 h-6 text-white" />
            </label>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 
                  className="text-3xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                >
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-lg font-semibold mb-3" style={{ color: theme.colors.accent[600] }}>
                  Professional Photographer
                </p>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.baseCity || 'Location not set'}</span>
                </div>
              </div>
              <span 
                className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"
                style={{
                  backgroundColor: profile.isVerified ? '#D1FAE5' : '#FEF3C7',
                  color: profile.isVerified ? '#059669' : '#D97706'
                }}
              >
                {profile.isVerified ? (
                  <>
                    <Award className="w-4 h-4" />
                    Verified
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Pending
                  </>
                )}
              </span>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <User className="w-4 h-4" />
                About Me
              </label>
              {isEditing ? (
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:outline-none transition-colors text-gray-900"
                  rows="4"
                  placeholder="Tell clients about your photography style and experience..."
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {profile.bio || 'No bio added yet. Click Edit Profile to add your story.'}
                </p>
              )}
            </div>

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <Briefcase className="w-4 h-4" />
                  Skills & Specialties
                </label>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-4 py-2 rounded-lg text-sm font-semibold"
                      style={{ backgroundColor: theme.colors.accent[50], color: theme.colors.accent[700] }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Contact & Location Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Mail className="w-5 h-5" style={{ color: theme.colors.accent[600] }} />
            Contact Information
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{profile.email}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:outline-none transition-colors text-gray-900"
                  placeholder="+234 XXX XXX XXXX"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.phone || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5" style={{ color: theme.colors.accent[600] }} />
            Location Details
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Base City</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.baseCity}
                  onChange={(e) => setProfile({...profile, baseCity: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:outline-none transition-colors text-gray-900"
                  placeholder="e.g., Lagos, Nigeria"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.baseCity || 'Not specified'}</span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Studio Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.currentAddress}
                  onChange={(e) => setProfile({...profile, currentAddress: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-accent-500 focus:outline-none transition-colors text-gray-900"
                  placeholder="Optional: Studio or business address"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{profile.currentAddress || 'Not provided'}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
