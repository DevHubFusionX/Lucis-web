import BaseApiService from '../api/baseApi'

class FavoriteService extends BaseApiService {
  async getFavorites() {
    try {
      const data = await this.get('/favorites/', true, 3 * 60 * 1000) // 3min cache
      return this.handleArrayResponse(data)
    } catch (error) {
      return []
    }
  }

  async addFavorite(professionalId) {
    const data = await this.post('/favorites/', { professionalId })
    
    // Invalidate favorites cache
    this.cache.invalidate('/favorites/')
    
    return this.handleResponse(data, 'Failed to add favorite')
  }

  async removeFavorite(favoriteId) {
    const data = await this.delete(`/favorites/${favoriteId}`)
    
    // Invalidate favorites cache
    this.cache.invalidate('/favorites/')
    
    return this.handleResponse(data, 'Failed to remove favorite')
  }

  async isFavorite(professionalId) {
    try {
      const favorites = await this.getFavorites()
      return favorites.some(fav => fav.professionalId === professionalId)
    } catch (error) {
      return false
    }
  }
}

export default new FavoriteService()