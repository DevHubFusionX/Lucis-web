/**
 * LocalStorage wrapper with auto-parsing and error handling
 */
export const storage = {
  get: (key) => {
    if (typeof window === 'undefined') return null
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      
      // Validate JSON before parsing
      if (item.startsWith('{') || item.startsWith('[') || item === 'true' || item === 'false' || item === 'null' || !isNaN(item)) {
        try {
          return JSON.parse(item)
        } catch {
          return item
        }
      }
      return item
    } catch (error) {
      console.warn('Storage get error:', error)
      return null
    }
  },

  set: (key, value) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
    } catch (error) {
      console.error('Storage error:', error)
    }
  },

  remove: (key) => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(key)
  },

  clear: () => {
    if (typeof window === 'undefined') return
    localStorage.clear()
  }
}