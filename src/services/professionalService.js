import { cookies } from '../utils/cookies'
import { storage } from '../utils/storage'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

class ProfessionalService {
  getToken() {
    return cookies.get('auth-token') || storage.get('token')
  }

  async getProfile() {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/professionals/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to fetch profile')
    }

    return data.data
  }

  async getNotifications() {
    const token = this.getToken()
    const user = storage.get('user')
    
    const response = await fetch(`${API_BASE_URL}/notifications/professionals/${user.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      return []
    }

    return Array.isArray(data.data) ? data.data : []
  }

  async getNotification(notificationId) {
    const token = this.getToken()
    const user = storage.get('user')
    
    const response = await fetch(`${API_BASE_URL}/notifications/professionals/${user.id}/${notificationId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to fetch notification')
    }

    return data.data
  }

  async updateProfile(profileData) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/professionals/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to update profile')
    }

    return data.data
  }

  async uploadGalleryItems(galleryItems) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/professionals/gallery/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ gallery: galleryItems })
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to upload gallery items')
    }

    return data.data
  }

  async removeGalleryItem(itemId) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/professionals/gallery/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to remove gallery item')
    }

    return data.data
  }

  async getBookings() {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/bookings/professionals`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      // If booking not found, return empty array instead of throwing error
      if (data.message === 'Booking was not found') {
        return []
      }
      throw new Error(data.message || 'Failed to fetch bookings')
    }

    // Handle both paginated and direct array responses
    if (data.data?.records) {
      return data.data.records
    }
    
    return Array.isArray(data.data) ? data.data : []
  }

  async rejectBooking(bookingId) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/bookings/reject/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to reject booking')
    }

    return data.data
  }

  async acceptBooking(bookingId) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/bookings/accept/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to accept booking')
    }

    return data.data
  }

  async addPackage(packageData) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/packages/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(packageData)
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to add package')
    }

    return data.data
  }

  async getPackages() {
    const token = this.getToken()
    const user = storage.get('user')
    
    const response = await fetch(`${API_BASE_URL}/packages/${user.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      return []
    }

    // Handle both paginated and direct array responses
    if (data.data?.records) {
      return data.data.records
    }
    
    return Array.isArray(data.data) ? data.data : []
  }

  async getPackage(packageId, availabilityId) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/packages/${packageId}/${availabilityId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to fetch package')
    }

    return data.data
  }

  async getPackagesByProfessional(professionalId, page = 1, limit = 10) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/packages/${professionalId}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      return { records: [], pagination: null }
    }

    return data.data
  }

  async updatePackage(packageId, packageData) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/packages/${packageId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(packageData)
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to update package')
    }

    return data.data
  }

  async deletePackage(packageId) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/packages/${packageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      if (data.message?.includes('Invalid reference to related data')) {
        throw new Error('Cannot delete package: It has active bookings or schedules. Please cancel related bookings first.')
      }
      throw new Error(data.message || 'Failed to delete package')
    }

    return data.data
  }

  async createSchedule(scheduleData) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/schedules/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scheduleData)
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to create schedule')
    }

    return data.data
  }

  async getSchedules(page = 1, limit = 10) {
    const token = this.getToken()
    const user = storage.get('user')
    
    const response = await fetch(`${API_BASE_URL}/schedules/${user.id}?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      if (data.message === 'Schedule was not found') {
        return { records: [], pagination: null }
      }
      throw new Error(data.message || 'Failed to fetch schedules')
    }

    return data.data || { records: [], pagination: null }
  }

  async getSchedule(scheduleId) {
    const token = this.getToken()
    const user = storage.get('user')
    
    const response = await fetch(`${API_BASE_URL}/schedules/${user.id}/${scheduleId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to fetch schedule')
    }

    return data.data
  }

  async updateSchedule(scheduleId, scheduleData) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(scheduleData)
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to update schedule')
    }

    return data.data
  }

  async deleteSchedule(scheduleId) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/schedules/${scheduleId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to delete schedule')
    }

    return data.data
  }

  async getReviews() {
    const token = this.getToken()
    const user = storage.get('user')
    
    const response = await fetch(`${API_BASE_URL}/reviews/${user.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      return { records: [], details: { averageRating: 0, totalReviews: 0 } }
    }

    return data.data || { records: [], details: { averageRating: 0, totalReviews: 0 } }
  }

  async getViews() {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/professionals/views/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      return { records: [], pagination: null }
    }

    return data.data || { records: [], pagination: null }
  }

  async uploadProfilePicture(profilePictureData) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/professionals/profile-photo`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
      },
      body: JSON.stringify(profilePictureData)
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      throw new Error(data.message || 'Failed to upload profile picture')
    }

    return data.data
  }

  async getProfessionalSchedules(professionalId) {
    const token = this.getToken()
    
    const response = await fetch(`${API_BASE_URL}/schedules/${professionalId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      return { records: [], pagination: null }
    }

    return data.data || { records: [], pagination: null }
  }
  
}

export default new ProfessionalService()