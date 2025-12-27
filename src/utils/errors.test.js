import { describe, it, expect } from 'vitest'
import { AppError, AuthError, ValidationError, NetworkError, getErrorMessage } from './errors'

describe('Error Utilities', () => {
  it('should create an AppError with default values', () => {
    const error = new AppError('test error')
    expect(error.message).toBe('test error')
    expect(error.code).toBe('UNKNOWN_ERROR')
    expect(error.statusCode).toBe(500)
    expect(error.name).toBe('AppError')
  })

  it('should create specialized errors', () => {
    const authError = new AuthError('unauthorized')
    expect(authError.statusCode).toBe(401)
    expect(authError.code).toBe('AUTH_ERROR')

    const validationError = new ValidationError('invalid', { email: 'invalid' })
    expect(validationError.statusCode).toBe(400)
    expect(validationError.fields).toEqual({ email: 'invalid' })

    const networkError = new NetworkError('timeout')
    expect(networkError.statusCode).toBe(0)
  })

  it('should extract friendly error messages', () => {
    expect(getErrorMessage('string error')).toBe('string error')
    expect(getErrorMessage(new Error('native error'))).toBe('native error')
    expect(getErrorMessage(new AppError('custom error'))).toBe('custom error')
    expect(getErrorMessage(null)).toBe('An unexpected error occurred')
  })

  it('should serialize to JSON correctly', () => {
    const error = new AppError('test', 'CODE', 418, { foo: 'bar' })
    const json = error.toJSON()
    expect(json.message).toBe('test')
    expect(json.code).toBe('CODE')
    expect(json.statusCode).toBe(418)
    expect(json.meta).toEqual({ foo: 'bar' })
    expect(json.timestamp).toBeDefined()
  })
})
