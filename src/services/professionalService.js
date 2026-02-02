import httpClient from './api/httpClient'
import { apiCache } from './api/cache'
import { storage } from '../utils/storage'

/**
 * Service for professional profile management and operations
 */
class ProfessionalService {
  /**
   * Get professional profile
   */
  async getProfile() {
    const data = await httpClient.get('/professionals', {
      requestId: 'pro-profile',
      retryAttempts: 2
    })
    // ...
    return data.data
  }

  /**
   * Update professional profile
   */
  async updateProfile(profileData) {
    const data = await httpClient.put('/professionals', profileData, {
      requestId: 'update-pro-profile',
      retryAttempts: 1
    })


    if (data.error) {
      throw new Error(data.message || 'Failed to update profile')
    }

    return data.data
  }

  /**
   * Update profile picture (PATCH)
   */
  async updateProfilePhotoMetadata(profilePictureData) {
    const data = await httpClient.patch('/professionals/profile-photo', profilePictureData, {
      requestId: 'upload-pro-photo',
      retryAttempts: 0
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to update profile picture')
    }

    if (data.data) {
      const currentUser = storage.get('user')
      const updatedUser = { ...currentUser, profilePicture: data.data }
      storage.set('user', updatedUser)
    }

    return data.data

  }

  /**
   * Complete flow: Upload file to Cloudinary and update metadata
   */
  async uploadProfilePicture(file) {
    const { uploadToCloudinary, isCloudinaryConfigured } = await import('./cloudinaryService')
    const { compressImage } = await import('../utils/imageValidation')

    if (!isCloudinaryConfigured()) {
      throw new Error('Cloudinary is not configured.')
    }

    let fileToUpload = file
    try {
      fileToUpload = await compressImage(file, { quality: 0.9, maxWidth: 500, maxHeight: 500 })
    } catch (err) { }

    const cloudinaryResult = await uploadToCloudinary(fileToUpload, {
      folder: 'lucis/professionals/profiles'
    })

    const metadata = {
      url: cloudinaryResult.url,
      publicId: cloudinaryResult.publicId
    }

    return this.updateProfilePhotoMetadata(metadata)
  }


  /**
   * Delete profile photo (DELETE)
   */
  async deleteProfilePhoto() {
    const data = await httpClient.delete('/professionals/profile-photo', {
      requestId: 'delete-pro-photo'
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to delete profile photo')
    }

    return data.data
  }


  /**
   * Get notifications for professional
   */
  async getNotifications() {
    const user = storage.get('user')

    if (!user?.id) {
      return []
    }

    const data = await httpClient.get(`/notifications/professionals/${user.id}`, {
      requestId: 'pro-notifications',
      retryAttempts: 1
    })

    if (data.error) {
      return []
    }

    return Array.isArray(data.data) ? data.data : []
  }

  /**
   * Get single notification
   */
  async getNotification(notificationId) {
    const user = storage.get('user')

    const data = await httpClient.get(`/notifications/professionals/${user.id}/${notificationId}`, {
      requestId: `notification-${notificationId}`
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to fetch notification')
    }

    return data.data
  }

  /**
   * Upload gallery items
   */
  async uploadGalleryItems(galleryItems) {
    const data = await httpClient.post('/professionals/gallery/', { gallery: galleryItems }, {
      requestId: 'upload-gallery',
      retryAttempts: 0
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to upload gallery items')
    }

    return data.data
  }

  /**
   * Remove gallery item
   */
  async removeGalleryItem(itemId) {
    const data = await httpClient.delete(`/professionals/gallery/${itemId}`, {
      requestId: `remove-gallery-${itemId}`
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to remove gallery item')
    }

    return data.data
  }

  /**
   * Get bookings for professional
   */
  async getBookings() {
    const data = await httpClient.get('/bookings/professionals', {
      requestId: 'pro-bookings',
      retryAttempts: 2
    })

    // Handle "not found" gracefully
    if (data.error && data.message === 'Booking was not found') {
      return []
    }

    if (data.error) {
      throw new Error(data.message || 'Failed to fetch bookings')
    }

    // Handle different response formats
    if (data.data?.records) {
      return data.data.records
    }

    return Array.isArray(data.data) ? data.data : []
  }

  /**
   * Accept a booking
   */
  async acceptBooking(bookingId) {
    const data = await httpClient.patch(`/bookings/accept/${bookingId}`, null, {
      requestId: `accept-booking-${bookingId}`,
      retryAttempts: 1
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to accept booking')
    }

    return data.data
  }

  /**
   * Reject a booking
   */
  async rejectBooking(bookingId) {
    const data = await httpClient.patch(`/bookings/reject/${bookingId}`, null, {
      requestId: `reject-booking-${bookingId}`,
      retryAttempts: 1
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to reject booking')
    }

    return data.data
  }

  /**
   * Add a package
   */
  async addPackage(packageData) {
    const data = await httpClient.post('/packages/', packageData, {
      requestId: 'add-package',
      retryAttempts: 1
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to add package')
    }

    return data.data
  }

  /**
   * Get packages for current professional
   */
  async getPackages() {
    const user = storage.get('user')

    if (!user?.id) {
      return []
    }

    const endpoint = `/packages/${user.id}`
    const cacheKey = apiCache.generateKey(endpoint)

    // Check cache
    const cached = apiCache.get(cacheKey)
    if (cached) {
      return cached
    }

    const data = await httpClient.get(endpoint, {
      requestId: 'pro-packages',
      retryAttempts: 2
    })

    if (data.error) {
      return []
    }

    const packages = data.data?.records || (Array.isArray(data.data) ? data.data : [])

    // Cache for 2 minutes
    apiCache.set(cacheKey, packages, 2 * 60 * 1000)

    return packages
  }

  /**
   * Get single package
   */
  async getPackage(packageId, availabilityId) {
    const data = await httpClient.get(`/packages/${packageId}/${availabilityId}`, {
      requestId: `package-${packageId}`
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to fetch package')
    }

    return data.data
  }

  /**
   * Get packages by professional ID
   */
  async getPackagesByProfessional(professionalId, page = 1, limit = 10) {
    const data = await httpClient.get(`/packages/${professionalId}?page=${page}&limit=${limit}`, {
      requestId: `packages-${professionalId}`,
      retryAttempts: 2
    })

    if (data.error) {
      return { records: [], pagination: null }
    }

    return data.data
  }

  /**
   * Update a package
   */
  async updatePackage(packageId, packageData) {
    const data = await httpClient.put(`/packages/${packageId}`, packageData, {
      requestId: `update-package-${packageId}`,
      retryAttempts: 1
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to update package')
    }

    // Invalidate cache
    const user = storage.get('user')
    if (user?.id) {
      apiCache.invalidate(`/packages/${user.id}`)
    }

    return data.data
  }

  /**
   * Delete a package
   */
  async deletePackage(packageId) {
    const data = await httpClient.delete(`/packages/${packageId}`, {
      requestId: `delete-package-${packageId}`
    })

    if (data.error) {
      if (data.message?.includes('Invalid reference to related data')) {
        throw new Error('Cannot delete package: It has active bookings or schedules. Please cancel related bookings first.')
      }
      throw new Error(data.message || 'Failed to delete package')
    }

    // Invalidate cache
    const user = storage.get('user')
    if (user?.id) {
      apiCache.invalidate(`/packages/${user.id}`)
    }

    return data.data
  }

  /**
   * Create a schedule
   */
  async createSchedule(scheduleData) {
    const data = await httpClient.post('/schedules/', scheduleData, {
      requestId: 'create-schedule',
      retryAttempts: 1
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to create schedule')
    }

    return data.data
  }

  /**
   * Get schedules for current professional
   */
  async getSchedules(page = 1, limit = 10) {
    const user = storage.get('user')

    if (!user?.id) {
      return { records: [], pagination: null }
    }

    const data = await httpClient.get(`/schedules/${user.id}?page=${page}&limit=${limit}`, {
      requestId: 'pro-schedules',
      retryAttempts: 2
    })

    if (data.error && data.message === 'Schedule was not found') {
      return { records: [], pagination: null }
    }

    if (data.error) {
      throw new Error(data.message || 'Failed to fetch schedules')
    }

    return data.data || { records: [], pagination: null }
  }

  /**
   * Get single schedule
   */
  async getSchedule(scheduleId) {
    const user = storage.get('user')

    const data = await httpClient.get(`/schedules/${user.id}/${scheduleId}`, {
      requestId: `schedule-${scheduleId}`
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to fetch schedule')
    }

    return data.data
  }

  /**
   * Get schedules for a specific professional
   */
  async getProfessionalSchedules(professionalId) {
    const data = await httpClient.get(`/schedules/${professionalId}`, {
      requestId: `schedules-${professionalId}`,
      retryAttempts: 2
    })

    if (data.error) {
      return { records: [], pagination: null }
    }

    return data.data || { records: [], pagination: null }
  }

  /**
   * Update a schedule
   */
  async updateSchedule(scheduleId, scheduleData) {
    const data = await httpClient.put(`/schedules/${scheduleId}`, scheduleData, {
      requestId: `update-schedule-${scheduleId}`,
      retryAttempts: 1
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to update schedule')
    }

    return data.data
  }

  /**
   * Delete a schedule
   */
  async deleteSchedule(scheduleId) {
    const data = await httpClient.delete(`/schedules/${scheduleId}`, {
      requestId: `delete-schedule-${scheduleId}`
    })

    if (data.error) {
      throw new Error(data.message || 'Failed to delete schedule')
    }

    return data.data
  }

  /**
   * Get reviews for current professional
   */
  async getReviews() {
    const user = storage.get('user')

    if (!user?.id) {
      return { records: [], details: { averageRating: 0, totalReviews: 0 } }
    }

    const data = await httpClient.get(`/reviews/${user.id}`, {
      requestId: 'pro-reviews',
      retryAttempts: 2
    })

    if (data.error) {
      return { records: [], details: { averageRating: 0, totalReviews: 0 } }
    }

    return data.data || { records: [], details: { averageRating: 0, totalReviews: 0 } }
  }

  /**
   * Get profile views
   */
  async getViews() {
    const data = await httpClient.get('/professionals/views/', {
      requestId: 'pro-views',
      retryAttempts: 2
    })

    if (data.error) {
      return { records: [], pagination: null }
    }

    return data.data || { records: [], pagination: null }
  }

  /**
   * Cancel all professional requests
   */
  cancelRequests() {
    httpClient.cancelRequest('pro-profile')
    httpClient.cancelRequest('pro-bookings')
    httpClient.cancelRequest('pro-packages')
    httpClient.cancelRequest('pro-schedules')
    httpClient.cancelRequest('pro-reviews')
    httpClient.cancelRequest('pro-notifications')
  }
}

export default new ProfessionalService()