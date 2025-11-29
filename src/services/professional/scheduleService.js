import BaseApiService from '../api/baseApi'
import { storage } from '../../utils/storage'
import { sanitizeFormData } from '../../utils/securityUtils'

class ScheduleService extends BaseApiService {
  async createSchedule(scheduleData) {
    const sanitizedData = sanitizeFormData(scheduleData)
    const data = await this.post('/schedules/', sanitizedData)
    
    // Invalidate schedules cache
    this.cache.invalidate(/^\/schedules\//);
    
    return this.handleResponse(data, 'Failed to create schedule')
  }

  async getSchedules(page = 1, limit = 10) {
    const user = storage.get('user')
    
    try {
      const data = await this.get(`/schedules/${user.id}?page=${page}&limit=${limit}`, true, 3 * 60 * 1000)
      return this.handlePaginatedResponse(data)
    } catch (error) {
      return { records: [], pagination: null }
    }
  }

  async getSchedule(scheduleId) {
    const user = storage.get('user')
    const data = await this.get(`/schedules/${user.id}/${scheduleId}`)
    return this.handleResponse(data, 'Failed to fetch schedule')
  }

  async updateSchedule(scheduleId, scheduleData) {
    const sanitizedData = sanitizeFormData(scheduleData)
    const data = await this.put(`/schedules/${scheduleId}`, sanitizedData)
    
    // Invalidate schedules cache
    this.cache.invalidate(/^\/schedules\//);
    
    return this.handleResponse(data, 'Failed to update schedule')
  }

  async deleteSchedule(scheduleId) {
    const data = await this.delete(`/schedules/${scheduleId}`)
    
    // Invalidate schedules cache
    this.cache.invalidate(/^\/schedules\//);
    
    return this.handleResponse(data, 'Failed to delete schedule')
  }

  async getProfessionalSchedules(professionalId) {
    try {
      const data = await this.get(`/schedules/${professionalId}`, true, 3 * 60 * 1000)
      return this.handlePaginatedResponse(data)
    } catch (error) {
      return { records: [], pagination: null }
    }
  }
}

export default new ScheduleService()