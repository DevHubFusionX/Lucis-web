  /**
 * Standardized error handling utilities
 */

/**
 * Base application error class
 * @extends Error
 */
export class AppError extends Error {
  /**
   * @param {string} message - Human readable error message
   * @param {string} [code='UNKNOWN_ERROR'] - Machine readable error code
   * @param {number} [statusCode=500] - HTTP status code equivalent
   * @param {Object} [meta={}] - Additional error metadata
   */
  constructor(message, code = 'UNKNOWN_ERROR', statusCode = 500, meta = {}) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.statusCode = statusCode
    this.meta = meta
    this.timestamp = new Date().toISOString()
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      meta: this.meta,
      timestamp: this.timestamp
    }
  }
}

/**
 * Authentication/Authorization errors
 * @extends AppError
 */
export class AuthError extends AppError {
  /**
   * @param {string} message 
   * @param {string} [code='AUTH_ERROR'] 
   * @param {Object} [meta={}] 
   */
  constructor(message, code = 'AUTH_ERROR', meta = {}) {
    super(message, code, 401, meta)
    this.name = 'AuthError'
  }
}

/**
 * Validation errors
 * @extends AppError
 */
export class ValidationError extends AppError {
  /**
   * @param {string} message 
   * @param {Object.<string, string>} [fields={}] - Map of field names to error messages
   * @param {Object} [meta={}] 
   */
  constructor(message, fields = {}, meta = {}) {
    super(message, 'VALIDATION_ERROR', 400, { fields, ...meta })
    this.name = 'ValidationError'
    this.fields = fields
  }
}

/**
 * Network/API errors
 * @extends AppError
 */
export class NetworkError extends AppError {
  /**
   * @param {string} message 
   * @param {string} [code='NETWORK_ERROR'] 
   * @param {Object} [meta={}] 
   */
  constructor(message, code = 'NETWORK_ERROR', meta = {}) {
    super(message, code, 0, meta)
    this.name = 'NetworkError'
  }
}

/**
 * Not found errors
 * @extends AppError
 */
export class NotFoundError extends AppError {
  /**
   * @param {string} [resource='Resource'] - Name of the missing resource
   * @param {Object} [meta={}] 
   */
  constructor(resource = 'Resource', meta = {}) {
    super(`${resource} not found`, 'NOT_FOUND', 404, meta)
    this.name = 'NotFoundError'
  }
}

/**
 * Standardized async error wrapper
 * Returns { success, data, error } pattern consistently
 * @template T
 * @param {() => Promise<T>} fn - Async function to execute
 * @param {Object} [context={}] - Context to add to error if it occurs
 * @returns {Promise<{success: boolean, data: T|null, error: {message: string, code: string}|null}>}
 */
export async function withErrorHandling(fn, context = {}) {
  try {
    const data = await fn()
    return { success: true, data, error: null }
  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
        ...context
      }
    }
  }
}

/**
 * Extract user-friendly error message
 * @param {any} error 
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (typeof error === 'string') return error
  if (error instanceof AppError) return error.message
  if (error?.message) return error.message
  return 'An unexpected error occurred'
}

/**
 * Check if error is an authentication error
 * @param {any} error 
 * @returns {boolean}
 */
export function isAuthError(error) {
  return error instanceof AuthError || error?.code === 'AUTH_ERROR'
}

/**
 * Check if error is a validation error
 * @param {any} error 
 * @returns {boolean}
 */
export function isValidationError(error) {
  return error instanceof ValidationError || error?.code === 'VALIDATION_ERROR'
}

/**
 * Check if error is a network error
 * @param {any} error 
 * @returns {boolean}
 */
export function isNetworkError(error) {
  return error instanceof NetworkError || error?.code === 'NETWORK_ERROR'
}
