import { storage } from '../utils/storage'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 

class AuthService {
  async login(credentials, userType = 'client') {
    const endpoint = userType === 'professional' ? '/auth/professionals/login' : '/auth/users/login'
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Login failed')
    }

    if (data.data?.token) {
      storage.set('token', data.data.token)
      storage.set('user', data.data.user)
      storage.set('userType', userType)
    }

    return data.data
  }

  async signup(userData, userType = 'client') {
    const endpoint = userType === 'professional' ? '/auth/professionals/sign-up' : '/auth/users/sign-up'
    
    // Create FormData for multipart/form-data
    const formData = new FormData()
    formData.append('email', userData.email)
    // Password should be sent via JSON body, not FormData
    const { password, ...safeData } = userData
    
    // Handle firstName and lastName properly
    if (safeData.firstName && safeData.lastName) {
      formData.append('firstName', safeData.firstName)
      formData.append('lastName', safeData.lastName)
    } else if (safeData.fullName) {
      const nameParts = safeData.fullName.split(' ')
      formData.append('firstName', nameParts[0] || '')
      formData.append('lastName', nameParts.slice(1).join(' ') || '')
    } else {
      formData.append('firstName', safeData.firstName || '')
      formData.append('lastName', safeData.lastName || '')
    }
    
    if (userType === 'professional') {
      // Professional required fields
      formData.append('phone', safeData.phone || '')
      formData.append('baseCity', safeData.baseCity || '')
      formData.append('longitude', safeData.longitude || '0')
      formData.append('latitude', safeData.latitude || '0')
      
      // Optional professional fields
      if (safeData.bio) formData.append('bio', safeData.bio)
      if (safeData.currentAddress) formData.append('currentAddress', safeData.currentAddress)
      
      // Skills array
      if (safeData.skills && Array.isArray(safeData.skills)) {
        safeData.skills.forEach(skill => {
          formData.append('skills[]', skill)
        })
      }
      
      // Media files
      if (safeData.profilePicture) formData.append('photo', safeData.profilePicture)
      if (safeData.galleryImages) {
        safeData.galleryImages.forEach(image => {
          formData.append('images', image)
        })
      }
      if (safeData.galleryVideos) {
        safeData.galleryVideos.forEach(video => {
          formData.append('videos', video)
        })
      }
    } else {
      // Client fields
      if (safeData.phone) formData.append('phone', safeData.phone)
      formData.append('lat', safeData.latitude || '0')
      formData.append('lng', safeData.longitude || '0')
    }
    
    // Send password securely in JSON body
    formData.append('password', password)
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Signup failed')
    }

    if (data.data?.token) {
      storage.set('token', data.data.token)
      storage.set('user', data.data.user)
      storage.set('userType', userType)
    }

    return data.data
  }

  async logout() {
    try {
      const token = this.getToken()
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      storage.remove('token')
      storage.remove('user')
      storage.remove('userType')
    }
  }

  getToken() {
    return storage.get('token')
  }

  getUser() {
    return storage.get('user')
  }

  getUserType() {
    return storage.get('userType')
  }

  isAuthenticated() {
    return !!this.getToken()
  }

  async fetchUserProfile(userType = null) {
    const currentUserType = userType || this.getUserType()
    const token = this.getToken()
    
    if (!token) {
      throw new Error('No authentication token found')
    }
    
    if (currentUserType === 'professional') {
      const response = await fetch(`${API_BASE_URL}/professionals/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed')
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch profile`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.message || 'Failed to fetch profile')
      }

      if (data.data) {
        storage.set('user', data.data)
      }

      return data.data
    } else {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed')
        }
        throw new Error(`HTTP ${response.status}: Failed to fetch profile`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.message || 'Failed to fetch profile')
      }

      if (data.data) {
        storage.set('user', data.data)
      }

      return data.data
    }
  }

  async updateUser(userData, userType = null) {
    const currentUserType = userType || this.getUserType()
    const endpoint = currentUserType === 'professional' ? '/auth/professionals/profile' : '/auth/users/profile'
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Update failed')
    }

    if (data.data?.user) {
      storage.set('user', data.data.user)
    }

    return data.data
  }

  async uploadProfilePicture(file) {
    const token = this.getToken()
    const formData = new FormData()
    formData.append('photo', file)
    
    const response = await fetch(`${API_BASE_URL}/users/profile-photo`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Upload failed')
    }

    if (data.data) {
      const currentUser = this.getUser()
      const updatedUser = { ...currentUser, profilePicture: data.data }
      storage.set('user', updatedUser)
    }

    return data.data
  }
}

export default new AuthService()