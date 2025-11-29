import BaseApiService from '../api/baseApi'
import { storage } from '../../utils/storage'

class ClientNotificationService extends BaseApiService {
  async getNotifications() {
    const user = storage.get('user')
    
    try {
      const data = await this.get(`/notifications/users/${user.id}`)
      return Array.isArray(data.data) ? data.data : []
    } catch (error) {
      return []
    }
  }

  async getNotification(notificationId) {
    const user = storage.get('user')
    const data = await this.get(`/notifications/users/${user.id}/${notificationId}`)
    return this.handleResponse(data, 'Failed to fetch notification')
  }

  async markAsRead(notificationId) {
    const data = await this.patch(`/notifications/${notificationId}/read`)
    return this.handleResponse(data, 'Failed to mark notification as read')
  }

  async markAllAsRead() {
    const data = await this.patch('/notifications/read-all')
    return this.handleResponse(data, 'Failed to mark all notifications as read')
  }

  async deleteNotification(notificationId) {
    const data = await this.delete(`/notifications/${notificationId}`)
    return this.handleResponse(data, 'Failed to delete notification')
  }
}

export default new ClientNotificationService()