import BaseApiService from '../api/baseApi'

class GalleryService extends BaseApiService {
  /**
   * Upload gallery files to Cloudinary
   * @param {File[]} files - Array of files to upload
   * @param {Function} onProgress - Progress callback
   * @returns {Promise<Array<{url: string, publicId: string, type: string, thumbnail: string}>>}
   */
  async uploadGalleryFiles(files, onProgress) {
    // Import Cloudinary service dynamically
    const { uploadToCloudinary, isCloudinaryConfigured } = await import('../cloudinaryService')

    if (!isCloudinaryConfigured()) {
      throw new Error('Cloudinary is not configured. Please add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to your .env.local file.')
    }

    const results = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Upload to Cloudinary with progress
      const cloudinaryResult = await uploadToCloudinary(file, {
        folder: 'lucis/professionals/gallery',
        onProgress: (filePercent) => {
          if (onProgress) {
            // Calculate overall progress
            const completedPercent = (i / files.length) * 100
            const currentFileContribution = (filePercent / files.length)
            const totalPercent = Math.round(completedPercent + currentFileContribution)

            onProgress({
              current: i + 1,
              total: files.length,
              percent: totalPercent,
              currentFilePercent: filePercent
            })
          }
        }
      })

      // Format duration for videos
      let duration = null
      if (cloudinaryResult.duration) {
        const mins = Math.floor(cloudinaryResult.duration / 60)
        const secs = Math.floor(cloudinaryResult.duration % 60)
        duration = `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }

      results.push({
        url: cloudinaryResult.url,
        publicId: cloudinaryResult.publicId,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        thumbnail: cloudinaryResult.thumbnail || cloudinaryResult.url,
        ...(duration && { duration })
      })
    }

    // Final progress update
    if (onProgress) {
      onProgress({ current: files.length, total: files.length, percent: 100 })
    }

    return results
  }

  /**
   * Fetch professional gallery
   * @returns {Promise<Array>}
   */
  async getGallery() {
    const data = await this.get('/professionals/work-gallery')
    return this.handleResponse(data, 'Failed to fetch gallery')
  }

  /**
   * Save multiple gallery items
   * @param {Array} galleryItems 
   * @returns {Promise<Object>}
   */
  async uploadGalleryItems(galleryItems) {
    const data = await this.post('/professionals/work-gallery/files', { files: galleryItems })
    return this.handleResponse(data, 'Failed to upload gallery items')
  }

  /**
   * Save a single gallery item
   * @param {Object} item 
   * @returns {Promise<Object>}
   */
  async uploadGalleryItem(item) {
    const data = await this.post('/professionals/work-gallery/file', item)
    return this.handleResponse(data, 'Failed to upload gallery item')
  }



  /**
   * Remove a single gallery item
   * @param {string} itemId 
   * @returns {Promise<Object>}
   */
  async removeGalleryItem(itemId) {
    const data = await this.delete(`/professionals/work-gallery/file/${itemId}`)
    return this.handleResponse(data, 'Failed to remove gallery item')
  }

  /**
   * Remove multiple gallery items
   * @param {string[]} itemIds 
   * @returns {Promise<Object>}
   */
  async removeGalleryItems(itemIds) {
    const queryParams = itemIds.map(id => `ids=${id}`).join('&')
    const data = await this.delete(`/professionals/work-gallery/files?${queryParams}`)
    return this.handleResponse(data, 'Failed to remove gallery items')
  }


}

export default new GalleryService()