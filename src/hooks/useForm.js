/**
 * @typedef {Object} ValidationRule
 * @property {boolean} [required] - Field is required
 * @property {number} [minLength] - Minimum string length
 * @property {number} [maxLength] - Maximum string length
 * @property {number} [min] - Minimum number value
 * @property {number} [max] - Maximum number value
 * @property {RegExp|string} [pattern] - Regex pattern to match
 * @property {(value: any) => boolean} [custom] - Custom validation function
 * @property {string} [message] - Error message
 */

/**
 * @typedef {Object.<string, ValidationRule>} ValidationSchema
 */

'use client'
import { useState, useCallback } from 'react'

// Built-in validation patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\s\-\+\(\)]+$/,
  url: /^https?:\/\/.+/,
  number: /^\d+$/
}

// Built-in validation rules
const validators = {
  required: (value, message = 'This field is required') => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    return null
  },

  email: (value, message = 'Invalid email address') => {
    if (value && !patterns.email.test(value)) {
      return message
    }
    return null
  },

  phone: (value, message = 'Invalid phone number') => {
    if (value && !patterns.phone.test(value)) {
      return message
    }
    return null
  },

  minLength: (value, min, message) => {
    if (value && value.length < min) {
      return message || `Must be at least ${min} characters`
    }
    return null
  },

  maxLength: (value, max, message) => {
    if (value && value.length > max) {
      return message || `Must be no more than ${max} characters`
    }
    return null
  },

  min: (value, min, message) => {
    if (value !== '' && Number(value) < min) {
      return message || `Must be at least ${min}`
    }
    return null
  },

  max: (value, max, message) => {
    if (value !== '' && Number(value) > max) {
      return message || `Must be no more than ${max}`
    }
    return null
  },

  pattern: (value, pattern, message = 'Invalid format') => {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern
    if (value && !regex.test(value)) {
      return message
    }
    return null
  }
}

/**
 * Enhanced form hook with validation
 * @param {Object} initialValues - Initial form values
 * @param {ValidationSchema} [validationSchema] - Validation rules
 */
export function useForm(initialValues = {}, validationSchema = {}) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Validate a single field
   * @param {string} name - Field name
   * @param {any} value - Field value
   * @returns {string|null} Error message or null
   */
  const validateField = useCallback((name, value) => {
    const rules = validationSchema[name]
    if (!rules) return null

    // Required check
    if (rules.required) {
      const error = validators.required(value, rules.message)
      if (error) return error
    }

    // Skip other validations if empty and not required
    if (!value && !rules.required) return null

    // Email
    if (rules.email) {
      const error = validators.email(value, rules.message)
      if (error) return error
    }

    // Phone
    if (rules.phone) {
      const error = validators.phone(value, rules.message)
      if (error) return error
    }

    // Min/max length
    if (rules.minLength) {
      const error = validators.minLength(value, rules.minLength, rules.message)
      if (error) return error
    }

    if (rules.maxLength) {
      const error = validators.maxLength(value, rules.maxLength, rules.message)
      if (error) return error
    }

    // Min/max value
    if (rules.min !== undefined) {
      const error = validators.min(value, rules.min, rules.message)
      if (error) return error
    }

    if (rules.max !== undefined) {
      const error = validators.max(value, rules.max, rules.message)
      if (error) return error
    }

    // Pattern
    if (rules.pattern) {
      const error = validators.pattern(value, rules.pattern, rules.message)
      if (error) return error
    }

    // Custom validation
    if (rules.custom && typeof rules.custom === 'function') {
      const isValid = rules.custom(value)
      if (!isValid) {
        return rules.message || 'Invalid value'
      }
    }

    return null
  }, [validationSchema])

  /**
   * Validate all fields
   * @returns {{isValid: boolean, errors: Object}}
   */
  const validateAll = useCallback(() => {
    const newErrors = {}
    let isValid = true

    Object.keys(validationSchema).forEach(name => {
      const error = validateField(name, values[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return { isValid, errors: newErrors }
  }, [values, validateField, validationSchema])

  /**
   * Set field value
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }, [errors])

  /**
   * Handle field change
   * @param {Event|{target: {name: string, value: any}}} e
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value
    setValue(name, fieldValue)
  }, [setValue])

  /**
   * Handle field blur
   * @param {Event|{target: {name: string}}} e
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))

    // Validate on blur
    const error = validateField(name, values[name])
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }, [values, validateField])

  /**
   * Submit handler
   * @param {(values: Object) => Promise<any>} onSubmit
   */
  const handleSubmit = useCallback(async (onSubmit) => {
    setIsSubmitting(true)
    setTouched(Object.keys(validationSchema).reduce((acc, key) => ({ ...acc, [key]: true }), {}))

    const validation = validateAll()
    
    if (!validation.isValid) {
      setIsSubmitting(false)
      return { success: false, errors: validation.errors }
    }

    try {
      const result = await onSubmit(values)
      setIsSubmitting(false)
      return result
    } catch (error) {
      setIsSubmitting(false)
      return { success: false, error: error.message }
    }
  }, [values, validateAll, validationSchema])

  /**
   * Reset form
   */
  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  /**
   * Set field error manually
   * @param {string} name - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }, [])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldError,
    handleChange,
    handleBlur,
    handleSubmit,
    validateAll,
    reset
  }
}