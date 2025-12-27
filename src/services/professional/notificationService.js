import BaseApiService from '../api/baseApi'

class NotificationService extends BaseApiService {
  async getNotifications() {
    try {
      const data = await this.get('/notifications/professionals', true)
      return Array.isArray(data.data) ? data.data : []
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      return []
    }
  }

  async getNotification(notificationId) {
    try {
      const data = await this.get(`/notifications/professionals/${notificationId}`, true)
      return data.data
    } catch (error) {
      console.error('Failed to fetch notification:', error)
      throw error
    }
  }

  async markAsRead(notificationId) {
    try {
      const data = await this.patch(`/notifications/${notificationId}/read`, {})
      return this.handleResponse(data, 'Failed to mark notification as read')
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
      throw error
    }
  }
}

export default new NotificationService()