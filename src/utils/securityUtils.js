export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return input || ''
  
  try {
    return input
      .replace(/[<>]/g, '') // Remove potential XSS characters
      .trim()
      .slice(0, 1000) // Limit input length
  } catch (error) {
    return ''
  }
}

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

export const sanitizeFormData = (formData) => {
  const sanitized = {}
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value)
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item) : item
      )
    } else {
      sanitized[key] = value
    }
  }
  
  return sanitized
}

export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type)
}

export const isValidFileSize = (file, maxSizeMB = 5) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

export const generateCSRFToken = () => {
  return crypto.randomUUID()
}

export const rateLimit = (() => {
  const requests = new Map()
  
  return (key, maxRequests = 10, windowMs = 60000) => {
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!requests.has(key)) {
      requests.set(key, [])
    }
    
    const userRequests = requests.get(key)
    
    // Remove expired requests efficiently
    while (userRequests.length > 0 && userRequests[0] <= windowStart) {
      userRequests.shift()
    }
    
    if (userRequests.length >= maxRequests) {
      return false
    }
    
    userRequests.push(now)
    return true
  }
})()