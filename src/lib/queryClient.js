'use client'
import { QueryClient } from '@tanstack/react-query'
import logger from '../utils/logger'

/**
 * TanStack Query Client Configuration
 * Replaces manual caching in apiCache.js
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data becomes stale after 5 minutes (matches previous apiCache TTL)
            staleTime: 5 * 60 * 1000,
            // Keep unused data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests up to 2 times (matches httpClient)
            retry: 2,
            // Exponential backoff for retries
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Refetch on window focus for fresh data
            refetchOnWindowFocus: true,
            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
        },
        mutations: {
            // Log mutation errors
            onError: (error) => {
                logger.error('Mutation error', error)
            },
        },
    },
})

/**
 * Invalidate queries matching a key pattern
 * @param {string|string[]} queryKey - Query key or partial key to invalidate
 */
export const invalidateQueries = (queryKey) => {
    queryClient.invalidateQueries({ queryKey: Array.isArray(queryKey) ? queryKey : [queryKey] })
}

/**
 * Prefetch a query for faster navigation
 * @param {string|string[]} queryKey - Query key
 * @param {Function} queryFn - Function to fetch data
 */
export const prefetchQuery = (queryKey, queryFn) => {
    queryClient.prefetchQuery({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        queryFn,
    })
}

export default queryClient
