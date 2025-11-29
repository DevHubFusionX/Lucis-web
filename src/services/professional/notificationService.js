import BaseApiService from '../api/baseApi'
import { storage } from '../../utils/storage'

class NotificationService extends BaseApiService {
  async getNotifications() {
    const user = storage.get('user')
    
    if (!user?.id) {
      throw new Error('User not authenticated')
    }
    
    try {
      const data = await this.get(`/notifications/professionals/${user.id}`)
      return Array.isArray(data.data) ? data.data : []
    } catch (error) {
      return []
    }
  }

  async getNotification(notificationId) {
    const user = storage.get('user')
    
    if (!user?.id) {
      throw new Error('User not authenticated')
    }
    
    if (!notificationId) {
      throw new Error('Notification ID is required')
    }
    
    const data = await this.get(`/notifications/professionals/${user.id}/${notificationId}`)
    return this.handleResponse(data, 'Failed to fetch notification')
  }
}

export default new NotificationService()