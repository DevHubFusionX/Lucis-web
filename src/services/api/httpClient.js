import { storage } from '../../utils/storage'
import logger from '../../utils/logger'
import { NetworkError, AuthError } from '../../utils/errors'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * @typedef {Object} RequestOptions
 * @property {Object} [headers]
 * @property {number} [retryAttempts]
 * @property {string} [requestId]
 */

/**
 * Enhanced fetch-based HTTP client
 */
class HttpClient {
  constructor() {
    this.baseURL = API_BASE_URL
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    }
    this.pendingRequests = new Map() // For request deduplication
    this.abortControllers = new Map() // For request cancellation
  }

  getAuthHeaders() {
    const token = storage.get('token')
    return token ? { 'Authorization': `Bearer ${token}` } : {}
  }

  /**
   * Request interceptor - called before every request
   */
  async requestInterceptor(config) {
    // Add auth headers
    config.headers = {
      ...(config.skipDefaultHeaders ? {} : this.defaultHeaders),
      ...this.getAuthHeaders(),
      ...config.headers
    }

    // Log HTTP requests
    logger.http(config.method || 'GET', config.endpoint, {
      headers: config.headers,
      body: config.body instanceof FormData ? '[FormData]' : config.body
    })

    return config
  }

  /**
   * Response interceptor - called after every response
   */
  async responseInterceptor(response, config) {
    // Handle 401 - token refresh logic
    if (response.status === 401 && !config.skipAuthRefresh) {
      logger.warn('401 Unauthorized - attempting token refresh')
      
      try {
        // Attempt to refresh the token
        const refreshed = await this.refreshToken()
        
        if (refreshed) {
          logger.info('Token refreshed successfully, retrying request')
          // Retry the original request with new token
          return this.request(config.endpoint, {
            ...config,
            skipAuthRefresh: true // Prevent infinite loop
          })
        }
      } catch (refreshError) {
        logger.error('Token refresh failed', refreshError)
        // Token refresh failed - log out user
        this.handleAuthFailure()
        throw new AuthError('Session expired. Please log in again.', 'TOKEN_EXPIRED')
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        message: `HTTP ${response.status}: ${response.statusText}` 
      }))
      
      // Known business logic errors that should not trigger console errors
      const businessLogicErrors = [
        'booking overlap',
        'already booked',
        'not available',
        'time slot',
        'conflict'
      ]
      
      const isBusinessLogicError = businessLogicErrors.some(keyword => 
        errorData.message?.toLowerCase().includes(keyword)
      )
      
      // For client errors (4xx) or known business logic errors, use warn to avoid console noise
      if ((response.status >= 400 && response.status < 500) || isBusinessLogicError) {
        logger.warn(
          `${config.method || 'GET'} ${config.endpoint} ${response.status}`,
          { error: errorData.message, statusText: response.statusText }
        )
      } else {
        // For server errors (5xx) and other unexpected errors, log as error
        logger.httpError(
          config.method || 'GET',
          config.endpoint,
          response.status,
          errorData,
          { statusText: response.statusText }
        )
      }
      
      throw new NetworkError(
        errorData.message || `Request failed with status ${response.status}`,
        errorData.code || 'HTTP_ERROR',
        { 
          status: response.status, 
          statusText: response.statusText,
          apiError: errorData
        }
      )
    }

    const data = await response.json()
    
    logger.httpSuccess(
      config.method || 'GET',
      config.endpoint,
      response.status,
      { hasData: !!data.data }
    )

    return data
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    const refreshToken = storage.get('refreshToken')
    
    if (!refreshToken) {
      logger.warn('No refresh token found')
      return false
    }

    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken })
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      
      if (data.data?.token) {
        storage.set('token', data.data.token)
        
        // Update refresh token if provided
        if (data.data.refreshToken) {
          storage.set('refreshToken', data.data.refreshToken)
        }
        
        return true
      }

      return false
    } catch (error) {
      logger.error('Token refresh error', error)
      return false
    }
  }

  /**
   * Handle authentication failure - clear session and redirect
   */
  handleAuthFailure() {
    storage.remove('token')
    storage.remove('refreshToken')
    storage.remove('user')
    storage.remove('userType')
    
    // Redirect to login (only in browser)
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup')
      
      if (!isAuthPage) {
        logger.info('Redirecting to login due to auth failure')
        window.location.href = '/client-login'
      }
    }
  }

  /**
   * Retry logic with exponential backoff
   */
  async retryRequest(fn, retries = 3, delay = 1000) {
    try {
      return await fn()
    } catch (error) {
      if (retries === 0) throw error

      // Only retry on network errors or 5xx server errors
      const shouldRetry = 
        error.name === 'TypeError' || 
        (error.message && error.message.includes('5'))

      if (!shouldRetry) throw error

      logger.debug(`Retrying request (${retries} attempts left)`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return this.retryRequest(fn, retries - 1, delay * 2)
    }
  }

  /**
   * Request deduplication - prevent duplicate concurrent requests
   */
  async dedupedRequest(key, requestFn) {
    // If request is already pending, return the existing promise
    if (this.pendingRequests.has(key)) {
      logger.debug('Deduplicating request', { key })
      return this.pendingRequests.get(key)
    }

    // Execute the request and cache the promise
    const promise = requestFn()
      .finally(() => {
        // Clean up after request completes
        this.pendingRequests.delete(key)
      })

    this.pendingRequests.set(key, promise)
    return promise
  }

  /**
   * Main request method
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    
    // Create config object
    let config = {
      ...options,
      endpoint,
      method: options.method || 'GET'
    }

    // Apply request interceptor
    config = await this.requestInterceptor(config)

    // Create abort controller if needed
    const requestId = options.requestId || endpoint
    if (options.cancellable !== false) {
      const controller = new AbortController()
      this.abortControllers.set(requestId, controller)
      config.signal = controller.signal
    }

    // Build fetch config
    const fetchConfig = {
      method: config.method,
      headers: config.headers,
      signal: config.signal
    }

    if (config.body !== undefined) {
      fetchConfig.body = config.body
    }

    // Execute request with retry logic
    const executeRequest = async () => {
      try {
        const response = await fetch(url, fetchConfig)
        return await this.responseInterceptor(response, config)
      } catch (error) {
        // Don't retry if request was cancelled
        if (error.name === 'AbortError') {
          logger.debug('Request cancelled', { endpoint })
          throw new NetworkError('Request cancelled', 'REQUEST_CANCELLED')
        }

        // Network error handling
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new NetworkError('Network error. Please check your connection.', 'NETWORK_FAILURE')
        }

        throw error
      } finally {
        // Clean up abort controller
        if (options.cancellable !== false) {
          this.abortControllers.delete(requestId)
        }
      }
    }

    // Apply retry logic if enabled
    if (options.retry !== false) {
      const retries = options.retryAttempts || 2
      return this.retryRequest(executeRequest, retries)
    }

    return executeRequest()
  }

  /**
   * Cancel a specific request or all requests
   */
  cancelRequest(requestId) {
    if (requestId) {
      const controller = this.abortControllers.get(requestId)
      if (controller) {
        controller.abort()
        this.abortControllers.delete(requestId)
      }
    } else {
      // Cancel all pending requests
      this.abortControllers.forEach(controller => controller.abort())
      this.abortControllers.clear()
    }
  }

  // HTTP Methods

  get(endpoint, options = {}) {
    const cacheKey = options.cacheKey || endpoint
    
    // Use deduplication for GET requests
    if (options.dedupe !== false) {
      return this.dedupedRequest(cacheKey, () => 
        this.request(endpoint, { ...options, method: 'GET' })
      )
    }

    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  patch(endpoint, data = null, options = {}) {
    const config = { ...options, method: 'PATCH' }
    if (data) config.body = JSON.stringify(data)
    return this.request(endpoint, config)
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  upload(endpoint, formData, options = {}) {
    const headers = { ...this.getAuthHeaders(), ...options.headers }
    delete headers['Content-Type'] // Let browser set multipart boundary
    
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      headers,
      body: formData,
      skipDefaultHeaders: true,
      retry: false // Don't retry file uploads
    })
  }
}

export default new HttpClient()