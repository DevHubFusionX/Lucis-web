import BaseApiService from '../api/baseApi'
import { storage } from '../../utils/storage'
import { sanitizeFormData } from '../../utils/securityUtils'

class PackageService extends BaseApiService {
  async addPackage(packageData) {
    const sanitizedData = sanitizeFormData(packageData)
    const data = await this.post('/packages/', sanitizedData)
    
    // Invalidate packages cache
    this.cache.invalidate(/^\/packages\//);
    
    return this.handleResponse(data, 'Failed to add package')
  }

  async getPackages() {
    const user = storage.get('user')
    
    try {
      const data = await this.get(`/packages/${user.id}`, true, 3 * 60 * 1000) // 3min cache
      return this.handleArrayResponse(data)
    } catch (error) {
      return []
    }
  }

  async getPackage(packageId, availabilityId) {
    const data = await this.get(`/packages/${packageId}/${availabilityId}`)
    return this.handleResponse(data, 'Failed to fetch package')
  }

  async getPackagesByProfessional(professionalId, page = 1, limit = 10) {
    try {
      const data = await this.get(`/packages/${professionalId}?page=${page}&limit=${limit}`, true, 3 * 60 * 1000)
      return this.handlePaginatedResponse(data)
    } catch (error) {
      return { records: [], pagination: null }
    }
  }

  async updatePackage(packageId, packageData) {
    const sanitizedData = sanitizeFormData(packageData)
    const data = await this.put(`/packages/${packageId}`, sanitizedData)
    
    // Invalidate packages cache
    this.cache.invalidate(/^\/packages\//);
    
    return this.handleResponse(data, 'Failed to update package')
  }

  async deletePackage(packageId) {
    try {
      const data = await this.delete(`/packages/${packageId}`)
      
      // Invalidate packages cache
      this.cache.invalidate(/^\/packages\//);
      
      return this.handleResponse(data, 'Failed to delete package')
    } catch (error) {
      if (error.message?.includes('Invalid reference to related data')) {
        throw new Error('Cannot delete package: It has active bookings or schedules. Please cancel related bookings first.')
      }
      throw error
    }
  }
}

export default new PackageService()