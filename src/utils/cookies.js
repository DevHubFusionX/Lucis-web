export const cookies = {
  set: (name, value, days = 7) => {
    if (typeof document === 'undefined') return
    
    // Sanitize inputs to prevent HTTP Response Splitting
    const sanitizedName = String(name).replace(/[\r\n;,]/g, '')
    const sanitizedValue = String(value).replace(/[\r\n;,]/g, '')
    
    const expires = new Date()
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000))
    
    document.cookie = `${sanitizedName}=${sanitizedValue};expires=${expires.toUTCString()};path=/;secure;samesite=strict`
  },

  get: (name) => {
    if (typeof document === 'undefined') return null
    
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    
    for (let i = 0; i < ca.length; i++) { 
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },

  remove: (name) => {
    if (typeof document === 'undefined') return
    const sanitizedName = String(name).replace(/[\r\n;,]/g, '')
    document.cookie = `${sanitizedName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
  }
}