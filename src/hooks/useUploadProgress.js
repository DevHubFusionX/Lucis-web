'use client'
import { useState, useCallback, useRef } from 'react'

/**
 * Custom hook for tracking upload progress
 * 
 * @returns {Object} Upload state and methods
 */
export function useUploadProgress() {
    const [progress, setProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState(null)
    const [result, setResult] = useState(null)
    const abortControllerRef = useRef(null)

    /**
     * Upload a file with progress tracking
     * @param {Function} uploadFn - Async function that performs the upload
     * @returns {Promise<any>} - Upload result
     */
    const uploadFile = useCallback(async (uploadFn) => {
        setIsUploading(true)
        setProgress(0)
        setError(null)
        setResult(null)

        // Create abort controller
        abortControllerRef.current = new AbortController()

        try {
            const uploadResult = await uploadFn({
                onProgress: (percent) => setProgress(percent),
                signal: abortControllerRef.current.signal
            })

            setResult(uploadResult)
            setProgress(100)
            return uploadResult
        } catch (err) {
            if (err.name === 'AbortError') {
                setError('Upload cancelled')
            } else {
                setError(err.message || 'Upload failed')
            }
            throw err
        } finally {
            setIsUploading(false)
            abortControllerRef.current = null
        }
    }, [])

    /**
     * Cancel the current upload
     */
    const cancelUpload = useCallback(() => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
    }, [])

    /**
     * Reset the upload state
     */
    const reset = useCallback(() => {
        setProgress(0)
        setIsUploading(false)
        setError(null)
        setResult(null)
    }, [])

    return {
        progress,
        isUploading,
        error,
        result,
        uploadFile,
        cancelUpload,
        reset
    }
}

/**
 * Custom hook for batch upload progress tracking
 * 
 * @returns {Object} Batch upload state and methods
 */
export function useBatchUploadProgress() {
    const [progress, setProgress] = useState({
        current: 0,
        total: 0,
        percent: 0
    })
    const [isUploading, setIsUploading] = useState(false)
    const [errors, setErrors] = useState([])
    const [results, setResults] = useState([])
    const shouldCancelRef = useRef(false)

    /**
     * Upload multiple files with progress tracking
     * @param {Function} uploadFn - Async function that performs the batch upload
     * @returns {Promise<any[]>} - Upload results
     */
    const uploadFiles = useCallback(async (uploadFn) => {
        setIsUploading(true)
        setProgress({ current: 0, total: 0, percent: 0 })
        setErrors([])
        setResults([])
        shouldCancelRef.current = false

        try {
            const uploadResults = await uploadFn({
                onProgress: (progressData) => {
                    setProgress(progressData)
                },
                shouldCancel: () => shouldCancelRef.current
            })

            setResults(uploadResults)
            return uploadResults
        } catch (err) {
            if (err.errors) {
                setErrors(err.errors)
            } else {
                setErrors([err.message || 'Upload failed'])
            }
            throw err
        } finally {
            setIsUploading(false)
        }
    }, [])

    /**
     * Cancel the batch upload
     */
    const cancelUpload = useCallback(() => {
        shouldCancelRef.current = true
    }, [])

    /**
     * Reset the upload state
     */
    const reset = useCallback(() => {
        setProgress({ current: 0, total: 0, percent: 0 })
        setIsUploading(false)
        setErrors([])
        setResults([])
        shouldCancelRef.current = false
    }, [])

    return {
        progress,
        isUploading,
        errors,
        results,
        uploadFiles,
        cancelUpload,
        reset
    }
}

export default useUploadProgress
