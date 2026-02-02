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
    // Import Cloudinary service dynamically

    const { uploadToCloudinary, isCloudinaryConfigured } = await import('../cloudinaryService')
    const { compressImage } = await import('../../utils/imageValidation')

    // Check Cloudinary configuration
    if (!isCloudinaryConfigured()) {
      const error = 'Cloudinary is not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local file.'
      throw new Error(error)
    }


    // Compress the image
    let fileToUpload = file
    try {
      fileToUpload = await compressImage(file, {
        quality: 0.9,
        maxWidth: 500,
        maxHeight: 500
      })
    } catch (err) {
      // Ignore compression errors
    }


    // Step 1: Upload directly to Cloudinary
    let cloudinaryResult
    try {
      cloudinaryResult = await uploadToCloudinary(fileToUpload, {
        folder: 'lucis/clients/profiles',
        onProgress: (percent) => { }
      })
    } catch (err) {
      throw err
    }


    // Step 2: Update profile photo with the Cloudinary URL (PATCH)
    const profilePhotoData = {
      url: cloudinaryResult.url,
      publicId: cloudinaryResult.publicId
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

  async deleteProfilePhoto() {
    const data = await this.delete('/users/profile-photo')

    if (!data.error) {
      const currentUser = storage.get('user')
      const updatedUser = { ...currentUser, profilePicture: null }
      storage.set('user', updatedUser)
      this.cache.invalidate('/users/')
    }

    return this.handleResponse(data, 'Failed to delete profile photo')
  }
}


export default new ClientProfileService()