import BaseApiService from '../api/baseApi'
import { sanitizeFormData } from '../../utils/securityUtils'

class ProfileService extends BaseApiService {
  async getProfile() {
    const data = await this.get('/professionals/', true, 5 * 60 * 1000) // 5min cache
    return this.handleResponse(data, 'Failed to fetch profile')
  }

  async updateProfile(profileData) {
    const sanitizedData = sanitizeFormData(profileData)
    const data = await this.put('/professionals/', sanitizedData)
    
    // Invalidate profile cache
    this.cache.invalidate('/professionals/')
    
    return this.handleResponse(data, 'Failed to update profile')
  }

  async uploadProfilePicture(profilePictureData) {
    const sanitizedData = sanitizeFormData(profilePictureData)
    const data = await this.patch('/professionals/profile-photo', sanitizedData)
    
    // Invalidate profile cache
    this.cache.invalidate('/professionals/')
    
    return this.handleResponse(data, 'Failed to upload profile picture')
  }
}

export default new ProfileService()