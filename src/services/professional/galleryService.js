import BaseApiService from '../api/baseApi'

class GalleryService extends BaseApiService {
  async uploadGalleryItems(galleryItems) {
    const data = await this.post('/professionals/gallery/', { gallery: galleryItems })
    return this.handleResponse(data, 'Failed to upload gallery items')
  }

  async removeGalleryItem(itemId) {
    const data = await this.delete(`/professionals/gallery/${itemId}`)
    return this.handleResponse(data, 'Failed to remove gallery item')
  }
}

export default new GalleryService()