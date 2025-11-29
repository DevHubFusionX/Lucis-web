import BaseApiService from '../api/baseApi'
import { storage } from '../../utils/storage'
import { sanitizeFormData } from '../../utils/securityUtils'

class ClientProfileService extends BaseApiService {
  async getProfile() {
    const data = await this.get('/users/', true, 5 * 60 * 1000) // 5min cache
    return this.handleResponse(data, 'Failed to fetch profile')
  }

  async updateProfile(profileData) {
    const sanitizedData = sanitizeFormData(profileData)
    const data = await this.put('/users/', sanitizedData)
    
    // Update local storage and invalidate cache
    if (data.data) storage.set('user', data.data)
    this.cache.invalidate('/users/')
    
    return this.handleResponse(data, 'Failed to update profile')
  }

  async uploadProfilePicture(file) {
    const formData = new FormData()
    formData.append('photo', file)
    
    const data = await this.http.upload('/users/profile-photo', formData)
    
    if (data.data) {
      const currentUser = storage.get('user')
      const updatedUser = { ...currentUser, profilePicture: data.data }
      storage.set('user', updatedUser)
    }

    return this.handleResponse(data, 'Failed to upload profile picture')
  }
}

export default new ClientProfileService()