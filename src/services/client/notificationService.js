import BaseApiService from '../api/baseApi'

class ClientNotificationService extends BaseApiService {
  async getNotifications() {
    try {
      const data = await this.get('/notifications/users')
      if (Array.isArray(data)) return data
      if (data.data && Array.isArray(data.data)) return data.data
      if (data.data && typeof data.data === 'object') return [data.data]
      return []
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      return []
    }
  }

  async markAsRead(notificationId) {
    try {
      const data = await this.patch(`/notifications/users/${notificationId}/read`)
      return this.handleResponse(data, 'Failed to mark notification as read')
    } catch (error) {
      console.error('Failed to mark as read:', error)
      throw error
    }
  }

  async markAllAsRead() {
    try {
      const data = await this.patch('/notifications/users/read-all')
      return this.handleResponse(data, 'Failed to mark all notifications as read')
    } catch (error) {
      console.error('Failed to mark all as read:', error)
      throw error
    }
  }
}

export default new ClientNotificationService()
