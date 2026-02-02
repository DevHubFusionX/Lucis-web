import logger from '../../utils/logger'

/**
 * Simple TTL cache bridge for legacy services
 * This provides backward compatibility while migrating to TanStack Query
 */
class ApiCache {
    constructor() {
        this.cache = new Map()
    }

    /**
     * Generate a cache key from an endpoint
     */
    generateKey(endpoint) {
        return endpoint
    }

    /**
     * Get value from cache
     */
    get(key) {
        const entry = this.cache.get(key)
        if (!entry) return null

        if (Date.now() > entry.expiry) {
            this.cache.delete(key)
            return null
        }

        logger.debug(`Cache hit: ${key}`)
        return entry.data
    }

    /**
     * Set value in cache
     */
    set(key, data, ttl) {
        if (!ttl) return

        this.cache.set(key, {
            data,
            expiry: Date.now() + ttl
        })
        logger.debug(`Cache set: ${key} (TTL: ${ttl}ms)`)
    }

    /**
     * Invalidate cache matching a pattern
     */
    invalidate(pattern) {
        if (pattern instanceof RegExp) {
            for (const key of this.cache.keys()) {
                if (pattern.test(key)) {
                    this.cache.delete(key)
                    logger.debug(`Cache invalidated (regex): ${key}`)
                }
            }
        } else if (typeof pattern === 'string') {
            this.cache.delete(pattern)
            logger.debug(`Cache invalidated: ${pattern}`)
        }
    }

    /**
     * Clear all cache
     */
    clear() {
        this.cache.clear()
        logger.debug('Cache cleared')
    }
}

export const apiCache = new ApiCache()
export default apiCache
