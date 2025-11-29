'use client'
import { useState } from 'react'

export const useForm = (initialValues = {}, validationFn = null) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const setFieldError = (name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const validate = () => {
    if (!validationFn) return { isValid: true, errors: {} }
    
    const validation = validationFn(values)
    setErrors(validation.errors || {})
    return validation
  }

  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true)
    
    const validation = validate()
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
  }

  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setIsSubmitting(false)
  }

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    setFieldError,
    validate,
    handleSubmit,
    reset
  }
}