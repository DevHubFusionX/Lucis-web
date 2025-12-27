import BaseApiService from '../api/baseApi'
import { storage } from '../../utils/storage'
import { cookies } from '../../utils/cookies'
import { sanitizeFormData } from '../../utils/securityUtils'

class AuthService extends BaseApiService {
  async login(credentials, userType = 'client') {
    const endpoint = userType === 'professional' ? '/auth/professionals/login' : '/auth/users/login'
    const sanitizedCredentials = sanitizeFormData(credentials)
    
    console.log('🔐 Login Attempt:', {
      userType,
      endpoint,
      credentials: { ...sanitizedCredentials, password: '***' }
    })
    
    const data = await this.post(endpoint, sanitizedCredentials)
    
    console.log('🔐 Login Response:', {
      hasToken: !!data.data?.token,
      hasUser: !!data.data?.user,
      data: { ...data, data: { ...data.data, token: data.data?.token ? '***' : null } }
    })
    
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
    
    console.log('📝 AuthService.signup called:', {
      userType,
      endpoint,
      userData: { ...userData, password: '***' }
    })
    
    const formData = this._buildSignupFormData(userData, userType)
    
    console.log('📋 FormData built, entries:')
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, key === 'password' ? '***' : value)
    }
    
    console.log('📤 Calling http.upload...')
    const data = await this.http.upload(endpoint, formData)
    console.log('📥 Upload response:', data)
    
    if (data.data?.token) {
      console.log('✅ Token received, storing auth data...')
      storage.set('token', data.data.token)
      storage.set('user', data.data.user)
      storage.set('userType', userType)
      cookies.set('auth-token', data.data.token)
      console.log('✅ Auth data stored successfully')
    } else {
      console.log('⚠️ No token in response')
    }

    return this.handleResponse(data, 'Signup failed')
  }

  async googleLogin(credential, userType = 'client') {
    // Decode JWT to get user info
    const payload = JSON.parse(atob(credential.split('.')[1]))
    const userData = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub
    }

    // Try Google endpoint first, fallback to regular signup/login
    try {
      const endpoint = userType === 'professional' ? '/auth/professionals/google-login' : '/auth/users/google-login'
      const data = await this.post(endpoint, { credential })
      
      if (data.data?.token) {
        storage.set('token', data.data.token)
        storage.set('user', data.data.user)
        storage.set('userType', userType)
        cookies.set('auth-token', data.data.token)
      }
      return this.handleResponse(data, 'Google login failed')
    } catch (error) {
      // Fallback: try regular login first, then signup
      try {
        return await this.login({ email: userData.email, password: userData.googleId }, userType)
      } catch (loginError) {
        // If login fails, try signup
        return await this.signup({ 
          email: userData.email, 
          password: userData.googleId,
          firstName: userData.name?.split(' ')[0] || '',
          lastName: userData.name?.split(' ').slice(1).join(' ') || '',
          fullName: userData.name
        }, userType)
      }
    }
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