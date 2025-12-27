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
    // Step 1: Upload the file to get URL and publicId
    const formData = new FormData()
    formData.append('file', file)
    
    const uploadResponse = await this.http.upload('/upload', formData)
    
    if (!uploadResponse.data || !uploadResponse.data.url || !uploadResponse.data.publicId) {
      throw new Error('Failed to upload file')
    }
    
    // Step 2: Update profile photo with the uploaded file info
    const profilePhotoData = {
      url: uploadResponse.data.url,
      publicId: uploadResponse.data.publicId
    }
    
    const data = await this.patch('/users/profile-photo', profilePhotoData)
    
    if (data.data) {
      const currentUser = storage.get('user')
      const updatedUser = { ...currentUser, profilePicture: data.data }
      storage.set('user', updatedUser)
      this.cache.invalidate('/users/')
    }

    return this.handleResponse(data, 'Failed to update profile picture')
  }
}

export default new ClientProfileService()