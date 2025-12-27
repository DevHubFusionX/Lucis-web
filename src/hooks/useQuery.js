'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import apiCache from '../utils/apiCache'
import logger from '../utils/logger'

/**
 * @typedef {Object} QueryOptions
 * @property {boolean} [enabled] - Whether query should run automatically
 * @property {number} [cacheTime] - Cache duration in milliseconds
 * @property {number} [staleTime] - Time before data is considered stale
 * @property {number} [refetchInterval] - Auto-refetch interval
 * @property {(error: Error) => void} [onError] - Error callback
 * @property {(data: any) => void} [onSuccess] - Success callback
 */

/**
 * @typedef {Object} QueryResult
 * @property {any} data - Query data
 * @property {Error|null} error - Query error
 * @property {boolean} isLoading - Initial loading state
 * @property {boolean} isFetching - Any fetch in progress
 * @property {boolean} isError - Whether query errored
 * @property {boolean} isSuccess - Whether query succeeded
 * @property {() => Promise<void>} refetch - Manual refetch function
 */

/**
 * Data fetching hook with caching and loading states
 * @param {string} queryKey - Unique key for this query
 * @param {() => Promise<any>} queryFn - Function that fetches data
 * @param {QueryOptions} [options={}] - Query options
 * @returns {QueryResult}
 */
export function useQuery(queryKey, queryFn, options = {}) {
  const {
    enabled = true,
    cacheTime = 5 * 60 * 1000,
    staleTime = 0,
    refetchInterval,
    onError,
    onSuccess
  } = options

  // Use refs to avoid re-triggering effects when these change
  const queryFnRef = useRef(queryFn)
  queryFnRef.current = queryFn
  const onSuccessRef = useRef(onSuccess)
  onSuccessRef.current = onSuccess
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError

  const [data, setData] = useState(() => apiCache.get(queryKey))
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(!data && enabled)
  const [isFetching, setIsFetching] = useState(false)

  const mountedRef = useRef(true)
  const refetchIntervalRef = useRef(null)

  // Reset data if queryKey changes
  useEffect(() => {
    const cached = apiCache.get(queryKey)
    setData(cached)
    setError(null)
    setIsLoading(!cached && enabled)
  }, [queryKey, enabled])

  /**
   * Execute the query
   */
  const executeQuery = useCallback(async (isManual = false) => {
    if (!enabled && !isManual) return

    setIsFetching(true)
    
    try {
      logger.debug('useQuery: Fetching', { queryKey })
      const result = await queryFnRef.current()

      if (!mountedRef.current) return

      setData(result)
      setError(null)

      // Cache the result
      apiCache.set(queryKey, result, cacheTime)

      if (onSuccessRef.current) {
        onSuccessRef.current(result)
      }

      logger.debug('useQuery: Success', { queryKey })
    } catch (err) {
      if (!mountedRef.current) return

      logger.error('useQuery: Error', err, { queryKey })
      setError(err)

      if (onErrorRef.current) {
        onErrorRef.current(err)
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false)
        setIsFetching(false)
      }
    }
  }, [enabled, queryKey, cacheTime])

  /**
   * Manual refetch
   */
  const refetch = useCallback(async () => {
    apiCache.invalidate(queryKey)
    await executeQuery(true)
  }, [queryKey, executeQuery])

  // Initial fetch and auto-refetch when enabled/data changes
  useEffect(() => {
    if (enabled && !data && !isFetching) {
      executeQuery()
    }
  }, [enabled, data, executeQuery, isFetching])

  // Refetch on interval
  useEffect(() => {
    if (refetchInterval && enabled) {
      refetchIntervalRef.current = setInterval(() => {
        executeQuery()
      }, refetchInterval)

      return () => {
        if (refetchIntervalRef.current) {
          clearInterval(refetchIntervalRef.current)
        }
      }
    }
  }, [refetchInterval, enabled, executeQuery])

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true // Ensure it's true on mount/remount
    return () => {
      mountedRef.current = false
      if (refetchIntervalRef.current) {
        clearInterval(refetchIntervalRef.current)
      }
    }
  }, [])

  return {
    data,
    error,
    isLoading,
    isFetching,
    isError: !!error,
    isSuccess: !error && !!data,
    refetch
  }
}

/**
 * Mutation hook for data modifications
 * @param {(variables: any) => Promise<any>} mutationFn - Mutation function
 * @param {Object} [options={}] - Mutation options
 * @returns {Object}
 */
export function useMutation(mutationFn, options = {}) {
  const { onSuccess, onError } = options
  const onSuccessRef = useRef(onSuccess)
  onSuccessRef.current = onSuccess
  const onErrorRef = useRef(onError)
  onErrorRef.current = onError

  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const mutate = useCallback(async (variables) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await mutationFn(variables)
      setData(result)
      
      if (onSuccessRef.current) {
        onSuccessRef.current(result, variables)
      }

      return { success: true, data: result }
    } catch (err) {
      logger.error('useMutation: Error', err)
      setError(err)

      if (onErrorRef.current) {
        onErrorRef.current(err, variables)
      }

      return { success: false, error: err }
    } finally {
      setIsLoading(false)
    }
  }, [mutationFn])

  return {
    mutate,
    data,
    error,
    isLoading,
    isError: !!error,
    isSuccess: !error && !!data
  }
}
