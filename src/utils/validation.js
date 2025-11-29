export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password, minLength = 8) => {
  if (!password || typeof password !== 'string') return false
  return password.length >= minLength
}

const comparePasswords = (pass1, pass2) => {
  return pass1 === pass2
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validateLoginForm = (formData) => {
  const errors = {}

  if (!formData.email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!formData.password) {
    errors.password = 'Password is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateSignupForm = (formData, isProfessional = false) => {
  const errors = {}

  if (!formData.fullName?.trim()) {
    errors.fullName = 'Full name is required'
  }

  if (isProfessional && !formData.businessName?.trim()) {
    errors.businessName = 'Business name is required'
  }

  if (!formData.email) {
    errors.email = 'Email is required'
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (isProfessional && formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Please enter a valid phone number'
  }

  if (!formData.password) {
    errors.password = 'Password is required'
  } else if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 8 characters long'
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password'
  } else if (formData.password && formData.confirmPassword && !comparePasswords(formData.password, formData.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and privacy policy'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}