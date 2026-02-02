import httpClient from './api/httpClient'
import { storage } from '../utils/storage'

/**
 * Authentication and user management service
 */
class AuthService {
  /**
   * Login for clients or professionals
   */
  async login(credentials, userType = 'client') {
    const endpoint = userType === 'professional'
      ? '/auth/professionals/login'
      : '/auth/users/login'

    const data = await httpClient.post(endpoint, credentials, {
      requestId: 'login',
      retryAttempts: 1 // Don't retry auth failures
    })

    if (data.error) {
      throw new Error(data.message || 'Login failed')
    }

    // Store auth data
    if (data.data?.token) {
      storage.set('token', data.data.token)
      if (data.data.refreshToken) {
        storage.set('refreshToken', data.data.refreshToken)
      }
      storage.set('user', data.data.user)
      storage.set('userType', userType)
    }

    return data.data
  }

  /**
   * Signup for clients or professionals
   */
  async signup(userData, userType = 'client') {
    const endpoint = userType === 'professional'
      ? '/auth/professionals/sign-up'
      : '/auth/users/sign-up'

    // Create FormData for multipart/form-data
    const formData = new FormData()
    formData.append('email', userData.email)

    // Handle firstName and lastName properly
    if (userData.firstName && userData.lastName) {
      formData.append('firstName', userData.firstName)
      formData.append('lastName', userData.lastName)
    } else if (userData.fullName) {
      const nameParts = userData.fullName.split(' ')
      formData.append('firstName', nameParts[0] || '')
      formData.append('lastName', nameParts.slice(1).join(' ') || '')
    }

    if (userType === 'professional') {
      // Professional required fields
      formData.append('phone', String(userData.phone || ''))
      formData.append('baseCity', userData.baseCity || '')
      formData.append('longitude', String(userData.longitude || '0'))
      formData.append('latitude', String(userData.latitude || '0'))

      // Optional professional fields
      if (userData.bio) formData.append('bio', userData.bio)
      if (userData.currentAddress) formData.append('currentAddress', userData.currentAddress)

      // Skills array
      if (userData.skills && Array.isArray(userData.skills)) {
        userData.skills.forEach(skill => {
          formData.append('skills[]', skill)
        })
      }

      // Media files
      if (userData.profilePicture) formData.append('photo', userData.profilePicture)
      if (userData.galleryImages) {
        userData.galleryImages.forEach(image => {
          formData.append('images', image)
        })
      }
      if (userData.galleryVideos) {
        userData.galleryVideos.forEach(video => {
          formData.append('videos', video)
        })
      }
    } else {
      // Client fields
      formData.append('phone', String(userData.phone || ''))
      formData.append('lat', String(userData.latitude || '0'))
      formData.append('lng', String(userData.longitude || '0'))
    }

    // Add password
    formData.append('password', userData.password)

    const data = await httpClient.upload(endpoint, formData, {
      requestId: 'signup',
      retryAttempts: 0 // Don't retry signup
    })

    if (data.error) {
      throw new Error(data.message || 'Signup failed')
    }

    // Store auth data
    if (data.data?.token) {
      storage.set('token', data.data.token)
      if (data.data.refreshToken) {
        storage.set('refreshToken', data.data.refreshToken)
      }
      storage.set('user', data.data.user)
      storage.set('userType', userType)
    }

    return data.data
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      const token = this.getToken()
      if (token) {
        await httpClient.post('/auth/logout', {}, {
          requestId: 'logout',
          retryAttempts: 0
        })
      }
    } catch (error) {
      // Log error silently
    } finally {
      storage.remove('token')
      storage.remove('refreshToken')
      storage.remove('user')
      storage.remove('userType')
    }
  }

  /**
   * Google Login/Signup
   */
  async googleLogin(credential, userType = 'client') {
    const endpoint = userType === 'professional'
      ? '/auth/professionals/google-login'
      : '/auth/users/google-login'

    const data = await httpClient.post(endpoint, { credential }, {
      requestId: 'google-login',
      retryAttempts: 0
    })

    if (data.error) {
      throw new Error(data.message || 'Google login failed')
    }

    // Store auth data
    if (data.data?.token) {
      storage.set('token', data.data.token)
      if (data.data.refreshToken) {
        storage.set('refreshToken', data.data.refreshToken)
      }
      storage.set('user', data.data.user)
      storage.set('userType', userType)
    }

    return data.data
  }

  /**
   * Get stored token
   */
  getToken() {
    return storage.get('token')
  }

  /**
   * Get stored user
   */
  getUser() {
    return storage.get('user')
  }

  /**
   * Get stored user type
   */
  getUserType() {
    return storage.get('userType')
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!this.getToken()
  }

  /**
   * Fetch user profile
   */
  async fetchUserProfile(userType = null) {
    const currentUserType = userType || this.getUserType()

    if (!this.getToken()) {
      throw new Error('No authentication token found')
    }

    const endpoint = currentUserType === 'professional'
      ? '/professionals'
      : '/users'


    const data = await httpClient.get(endpoint, {
      requestId: `profile-${currentUserType}`,
      retryAttempts: 2
    })

    if (data.error) {
      if (data.message && data.message.includes('401')) {
        throw new Error('Authentication failed')
      }
      throw new Error(data.message || 'Failed to fetch profile')
    }

    if (data.data) {
      storage.set('user', data.data)
    }

    return data.data
  }

  /**
   * Update user profile
   */
  async updateUser(userData, userType = null) {
    const currentUserType = userType || this.getUserType()
    const endpoint = currentUserType === 'professional'
      ? '/professionals'
      : '/users'


    const data = await httpClient.put(endpoint, userData, {
      requestId: 'update-profile',
      retryAttempts: 1
    })

    if (data.error) {
      throw new Error(data.message || 'Update failed')
    }

    if (data.data) {
      storage.set('user', data.data)
    }

    return data.data
  }


  /**
   * Update profile picture metadata (PATCH)
   */
  async updateProfilePhoto(photoData, userType = 'client') {
    const endpoint = userType === 'professional'
      ? '/professionals/profile-photo'
      : '/users/profile-photo'

    const data = await httpClient.patch(endpoint, photoData, {
      requestId: 'update-profile-photo'
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to update profile photo')
    }

    if (data.data) {
      const currentUser = this.getUser()
      const updatedUser = { ...currentUser, profilePicture: data.data }
      storage.set('user', updatedUser)
    }

    return data.data
  }

  /**
   * Delete profile photo (DELETE)
   */
  async deleteProfilePhoto(userType = 'client') {
    const endpoint = userType === 'professional'
      ? '/professionals/profile-photo'
      : '/users/profile-photo'

    const data = await httpClient.delete(endpoint, {
      requestId: 'delete-profile-photo'
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to delete profile photo')
    }

    const currentUser = this.getUser()
    const updatedUser = { ...currentUser, profilePicture: null }
    storage.set('user', updatedUser)

    return data.data
  }


  /**
   * Cancel all auth-related requests
   */
  cancelAuthRequests() {
    httpClient.cancelRequest('login')
    httpClient.cancelRequest('signup')
    httpClient.cancelRequest('logout')
    httpClient.cancelRequest('update-profile')
  }
}

export default new AuthService()