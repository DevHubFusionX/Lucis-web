import { describe, it, expect, vi, beforeEach } from 'vitest'
import logger from './logger'

describe('Logger Utility', () => {
  let logSpy, warnSpy, errorSpy

  beforeEach(() => {
    vi.clearAllMocks()
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Set to dev mode for testing all levels
    logger.isDev = true
    logger.currentLevel = 3 // DEBUG
  })

  it('should log debug messages in development', () => {
    logger.debug('test debug', { foo: 'bar' })
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('DEBUG:'),
      'test debug',
      { foo: 'bar' }
    )
  })

  it('should log info messages in development', () => {
    logger.info('test info', { foo: 'bar' })
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('INFO:'),
      'test info',
      { foo: 'bar' }
    )
  })

  it('should log warnings', () => {
    logger.warn('test warn', { foo: 'bar' })
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('WARN:'),
      'test warn',
      { foo: 'bar' }
    )
  })

  it('should log errors', () => {
    const error = new Error('boom')
    logger.error('test error', error, { foo: 'bar' })
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('ERROR:'),
      'test error',
      error,
      { foo: 'bar' }
    )
  })

  it('should support scoped logging', () => {
    const scoped = logger.scope('TestModule')
    scoped.debug('scoped msg', { x: 1 })
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('DEBUG:'),
      '[TestModule] scoped msg',
      { x: 1 }
    )
  })

  it('should not log debug/info in production', () => {
    logger.isDev = false
    logger.currentLevel = 0 // ERROR only
    
    logger.debug('should not show')
    logger.info('should not show')
    
    expect(logSpy).not.toHaveBeenCalled()
  })
})
