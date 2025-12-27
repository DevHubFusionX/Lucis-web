/**
 * @typedef {('DEBUG'|'INFO'|'WARN'|'ERROR')} LogLevel
 */

/**
 * Centralized logging utility
 * Provides consistent logging across the application with environment-aware filtering
 */
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
}

class Logger {
  constructor() {
    this.isDev = process.env.NODE_ENV === 'development'
    this.isTest = process.env.NODE_ENV === 'test'
    this.currentLevel = this.isDev ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR
  }

  /**
   * Format log message with timestamp and context
   */
  format(level, message, data) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] ${level}:`
    return { prefix, message, data }
  }

  /**
   * Log debug information (development only)
   */
  debug(message, data = {}) {
    if (this.currentLevel >= LOG_LEVELS.DEBUG) {
      const { prefix, message: msg, data: d } = this.format('DEBUG', message, data)
      console.log(prefix, msg, d)
    }
  }

  /**
   * Log informational messages (development only)
   */
  info(message, data = {}) {
    if (this.currentLevel >= LOG_LEVELS.INFO) {
      const { prefix, message: msg, data: d } = this.format('INFO', message, data)
      console.log(prefix, msg, d)
    }
  }

  /**
   * Log warnings (always logged)
   */
  warn(message, data = {}) {
    if (this.currentLevel >= LOG_LEVELS.WARN) {
      const { prefix, message: msg, data: d } = this.format('WARN', message, data)
      console.warn(prefix, msg, d)
    }
  }

  /**
   * Log errors (always logged + sent to error tracking)
   */
  error(message, error = null, context = {}) {
    if (this.currentLevel >= LOG_LEVELS.ERROR) {
      const { prefix, message: msg } = this.format('ERROR', message, context)
      console.error(prefix, msg, error, context)
      
      // Send to error tracking service in production
      if (!this.isDev && !this.isTest) {
        this.sendToErrorTracking(message, error, context)
      }
    }
  }

  /**
   * Send errors to external tracking service (Sentry, LogRocket, etc.)
   */
  sendToErrorTracking(message, error, context) {
    // TODO: Implement error tracking integration
    // Example: Sentry.captureException(error, { extra: context })
  }

  /**
   * Create a scoped logger for specific module
   */
  scope(moduleName) {
    return {
      debug: (msg, data) => this.debug(`[${moduleName}] ${msg}`, data),
      info: (msg, data) => this.info(`[${moduleName}] ${msg}`, data),
      warn: (msg, data) => this.warn(`[${moduleName}] ${msg}`, data),
      error: (msg, err, ctx) => this.error(`[${moduleName}] ${msg}`, err, ctx)
    }
  }

  /**
   * Log HTTP requests (development only)
   */
  http(method, url, data = {}) {
    this.debug(`HTTP ${method}`, { url, ...data })
  }

  /**
   * Log successful HTTP responses (development only)
   */
  httpSuccess(method, url, status, data = {}) {
    this.debug(`HTTP ${method} ${status}`, { url, ...data })
  }

  /**
   * Log HTTP errors (always logged)
   */
  httpError(method, url, status, error, data = {}) {
    this.error(`HTTP ${method} ${status} failed`, error, { url, ...data })
  }
}

export default new Logger()
