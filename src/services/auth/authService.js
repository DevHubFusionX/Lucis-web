import BaseApiService from '../api/baseApi'
import { storage } from '../../utils/storage'
import { cookies } from '../../utils/cookies'
import { sanitizeFormData } from '../../utils/securityUtils'

class AuthService extends BaseApiService {
  async login(credentials, userType = 'client') {
    const endpoint = userType === 'professional' ? '/auth/professionals/login' : '/auth/users/login'
    const sanitizedCredentials = sanitizeFormData(credentials)
    
    const data = await this.post(endpoint, sanitizedCredentials)
    
    if (data.data?.token) {
      storage.set('token', data.data.token)
      storage.set('user', data.data.user)
      storage.set('userType', userType)
      cookies.set('auth-token', data.data.token)
    }

    return this.handleResponse(data, 'Login failed')
  }

  async signup(userData, userType = 'client') {
    const endpoint = userType === 'professional' ? '/auth/professionals/sign-up' : '/auth/users/sign-up'
    
    const formData = this._buildSignupFormData(userData, userType)
    
    const data = await this.http.upload(endpoint, formData)
    
    if (data.data?.token) {
      storage.set('token', data.data.token)
      storage.set('user', data.data.user)
      storage.set('userType', userType)
      cookies.set('auth-token', data.data.token)
    }

    return this.handleResponse(data, 'Signup failed')
  }

  async logout() {
    try {
      await this.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      storage.remove('token')
      storage.remove('user')
      storage.remove('userType')
      cookies.remove('auth-token')
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
    
    if (currentUserType === 'professional') {
      const data = await this.post('/professionals/')
      if (data.data) storage.set('user', data.data)
      return this.handleResponse(data, 'Failed to fetch profile')
    } else {
      const data = await this.get('/users/')
      if (data.data) storage.set('user', data.data)
      return this.handleResponse(data, 'Failed to fetch profile')
    }
  }

  async updateUser(userData, userType = null) {
    const currentUserType = userType || this.getUserType()
    const endpoint = currentUserType === 'professional' ? '/auth/professionals/profile' : '/auth/users/profile'
    const sanitizedData = sanitizeFormData(userData)
    
    const data = await this.put(endpoint, sanitizedData)
    
    if (data.data?.user) {
      storage.set('user', data.data.user)
    }

    return this.handleResponse(data, 'Update failed')
  }

  async uploadProfilePicture(file) {
    const formData = new FormData()
    formData.append('photo', file)
    
    const data = await this.http.upload('/users/profile-photo', formData)
    
    if (data.data) {
      const currentUser = this.getUser()
      const updatedUser = { ...currentUser, profilePicture: data.data }
      storage.set('user', updatedUser)
    }

    return this.handleResponse(data, 'Upload failed')
  }

  _buildSignupFormData(userData, userType) {
    const formData = new FormData()
    formData.append('email', userData.email)
    formData.append('password', userData.password)
    
    if (userData.firstName && userData.lastName) {
      formData.append('firstName', userData.firstName)
      formData.append('lastName', userData.lastName)
    } else if (userData.fullName) {
      const nameParts = userData.fullName.split(' ')
      formData.append('firstName', nameParts[0] || '')
      formData.append('lastName', nameParts.slice(1).join(' ') || '')
    }
    
    if (userType === 'professional') {
      // Required fields
      formData.append('phone', userData.phone)
      formData.append('baseCity', userData.baseCity)
      formData.append('longitude', userData.longitude)
      formData.append('latitude', userData.latitude)
      
      // Optional fields
      if (userData.bio) formData.append('bio', userData.bio)
      if (userData.currentAddress) formData.append('currentAddress', userData.currentAddress)
      
      // Skills array
      if (userData.skills?.length) {
        userData.skills.forEach(skill => formData.append('skills[]', skill))
      }
      
      // Media files (up to 6 files: profile picture + gallery)
      if (userData.media?.length) {
        userData.media.forEach(file => formData.append('media', file))
      }
    } else {
      if (userData.phone) formData.append('phone', userData.phone)
      formData.append('lat', userData.latitude || '0')
      formData.append('lng', userData.longitude || '0')
    }
    
    return formData
  }
}

export default new AuthService()