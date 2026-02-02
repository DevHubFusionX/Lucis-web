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

  /**
   * Upload profile picture
   * @param {File|Object} input - Either a File object to upload via Cloudinary, or an object with {url, publicId} to update directly
   * @returns {Promise<Object>} - Updated profile picture data
   */
  async uploadProfilePicture(input) {
    // If input is a File, upload to Cloudinary first
    if (input instanceof File) {
      // Import Cloudinary service dynamically
      const { uploadToCloudinary, isCloudinaryConfigured } = await import('../cloudinaryService')
      const { compressImage } = await import('../../utils/imageValidation')

      if (!isCloudinaryConfigured()) {
        throw new Error('Cloudinary is not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local file.')
      }

      // Compress the image
      let fileToUpload = input
      try {
        fileToUpload = await compressImage(input, {
          quality: 0.9,
          maxWidth: 500,
          maxHeight: 500
        })
      } catch (err) {
        console.warn('Compression failed, using original:', err)
      }

      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(fileToUpload, {
        folder: 'lucis/professionals/profiles'
      })

      // Update profile with Cloudinary URL
      const data = await this.put('/professionals/profile-photo', {
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId
      })

      // Invalidate profile cache
      this.cache.invalidate('/professionals/')

      return this.handleResponse(data, 'Failed to upload profile picture')
    }

    // If input is an object with url/publicId, just update the profile
    const sanitizedData = sanitizeFormData(input)
    const data = await this.put('/professionals/profile-photo', sanitizedData)

    // Invalidate profile cache
    this.cache.invalidate('/professionals/')

    return this.handleResponse(data, 'Failed to upload profile picture')
  }
}

export default new ProfileService()