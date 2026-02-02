'use client'
import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { theme } from '../../lib/theme'

/**
 * Reusable Image Uploader Component
 * 
 * Features:
 * - Drag and drop support
 * - Click to upload
 * - Image preview
 * - Upload progress indicator
 * - File validation
 * - Single or multiple file support
 * 
 * @param {Object} props
 * @param {Function} props.onUpload - Callback when files are selected (receives File[])
 * @param {Function} props.onError - Callback for errors
 * @param {string} props.accept - Accepted file types (default: "image/*")
 * @param {number} props.maxSize - Max file size in bytes (default: 5MB)
 * @param {number} props.maxFiles - Max number of files (default: 1)
 * @param {boolean} props.showPreview - Show image preview (default: true)
 * @param {boolean} props.circular - Circular preview for profile pics (default: false)
 * @param {string} props.preview - Existing preview URL
 * @param {boolean} props.uploading - External uploading state
 * @param {number} props.progress - Upload progress (0-100)
 * @param {string} props.className - Additional classes
 * @param {string} props.label - Upload button label
 * @param {boolean} props.disabled - Disable the uploader
 */
export default function ImageUploader({
  onUpload,
  onError,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 1,
  showPreview = true,
  circular = false,
  preview: existingPreview,
  uploading: externalUploading,
  progress: externalProgress,
  className = '',
  label,
  disabled = false
}) {
  const [isDragging, setIsDragging] = useState(false)
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState(null)
  const [internalUploading, setInternalUploading] = useState(false)
  const fileInputRef = useRef(null)

  const uploading = externalUploading ?? internalUploading
  const progress = externalProgress ?? 0

  // Validate file
  const validateFile = useCallback((file) => {
    // Check file type
    if (accept !== '*' && !accept.includes('*')) {
      const acceptedTypes = accept.split(',').map(t => t.trim())
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          const category = type.replace('/*', '')
          return file.type.startsWith(category)
        }
        return file.type === type
      })
      if (!isValidType) {
        return `Invalid file type. Accepted: ${accept}`
      }
    } else if (accept.includes('image/*') && !file.type.startsWith('image/')) {
      return 'Please select an image file'
    }

    // Check file size
    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(1)
      return `File size must be less than ${sizeMB}MB`
    }

    return null
  }, [accept, maxSize])

  // Process selected files
  const processFiles = useCallback(async (files) => {
    setError(null)
    const fileArray = Array.from(files)

    // Check max files
    if (fileArray.length > maxFiles) {
      const errorMsg = `Maximum ${maxFiles} file(s) allowed`
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    // Validate all files
    for (const file of fileArray) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        onError?.(validationError)
        return
      }
    }

    // Generate previews
    if (showPreview) {
      const newPreviews = await Promise.all(
        fileArray.map(file => {
          return new Promise((resolve) => {
            if (file.type.startsWith('image/')) {
              const reader = new FileReader()
              reader.onloadend = () => resolve(reader.result)
              reader.readAsDataURL(file)
            } else {
              resolve(null)
            }
          })
        })
      )
      setPreviews(newPreviews.filter(Boolean))
    }

    // Call onUpload callback
    if (onUpload) {
      try {
        setInternalUploading(true)
        await onUpload(maxFiles === 1 ? fileArray[0] : fileArray)
      } catch (err) {
        setError(err.message || 'Upload failed')
        onError?.(err.message || 'Upload failed')
      } finally {
        setInternalUploading(false)
      }
    }
  }, [maxFiles, validateFile, showPreview, onUpload, onError])

  // Handle drag events
  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !uploading) {
      setIsDragging(true)
    }
  }, [disabled, uploading])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled || uploading) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFiles(files)
    }
  }, [disabled, uploading, processFiles])

  // Handle click to upload
  const handleClick = useCallback(() => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click()
    }
  }, [disabled, uploading])

  // Handle file input change
  const handleFileChange = useCallback((e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input
    e.target.value = ''
  }, [processFiles])

  // Clear preview
  const clearPreview = useCallback((index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setError(null)
  }, [])

  // Determine what to show as preview
  const displayPreview = previews.length > 0 ? previews[0] : existingPreview

  // Circular profile picture style
  if (circular) {
    return (
      <div className={`relative ${className}`}>
        <div
          className={`
            w-32 h-32 rounded-full overflow-hidden border-4 cursor-pointer
            transition-all duration-200 relative
            ${isDragging ? 'border-accent-500 bg-accent-50' : 'border-gray-100 bg-gray-50'}
            ${disabled || uploading ? 'opacity-60 cursor-not-allowed' : 'hover:border-accent-200'}
          `}
          style={{ borderColor: isDragging ? theme.colors.accent[500] : theme.colors.accent[50] }}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {displayPreview ? (
            <img
              src={displayPreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span 
                className="text-4xl font-bold"
                style={{ color: theme.colors.accent[300] }}
              >
                <ImageIcon className="w-12 h-12" />
              </span>
            </div>
          )}

          {/* Uploading overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
              {progress > 0 && (
                <span className="text-white text-sm mt-2">{progress}%</span>
              )}
            </div>
          )}
        </div>

        {/* Camera button */}
        <label
          className={`
            absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center
            shadow-lg cursor-pointer transition-all ring-4 ring-white
            ${disabled || uploading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-110'}
          `}
          style={{ backgroundColor: theme.colors.accent[600] }}
        >
          <Upload className="w-5 h-5 text-white" />
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled || uploading}
            className="hidden"
          />
        </label>

        {/* Error message */}
        {error && (
          <div className="absolute -bottom-8 left-0 right-0 text-center">
            <span className="text-red-500 text-xs">{error}</span>
          </div>
        )}
      </div>
    )
  }

  // Standard upload zone
  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center
          transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-accent-500 bg-accent-50' 
            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
          }
          ${disabled || uploading ? 'opacity-60 cursor-not-allowed' : ''}
        `}
        style={{ 
          borderColor: isDragging ? theme.colors.accent[500] : undefined,
          backgroundColor: isDragging ? theme.colors.accent[50] : undefined
        }}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileChange}
          disabled={disabled || uploading}
          className="hidden"
        />

        {/* Preview area */}
        {showPreview && previews.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 justify-center">
              {previews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearPreview(index)
                    }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full 
                              flex items-center justify-center opacity-0 group-hover:opacity-100 
                              transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {uploading && (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" style={{ color: theme.colors.accent[600] }} />
                <span className="text-sm text-gray-600">
                  Uploading{progress > 0 ? ` (${progress}%)` : '...'}
                </span>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Upload icon and text */}
            <div 
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: theme.colors.accent[50] }}
            >
              {uploading ? (
                <Loader2 
                  className="w-8 h-8 animate-spin" 
                  style={{ color: theme.colors.accent[600] }} 
                />
              ) : (
                <Upload 
                  className="w-8 h-8" 
                  style={{ color: theme.colors.accent[600] }} 
                />
              )}
            </div>

            <p className="text-gray-700 font-medium mb-1">
              {label || (isDragging ? 'Drop files here' : 'Drag & drop or click to upload')}
            </p>
            <p className="text-sm text-gray-500">
              {accept === 'image/*' ? 'Images' : accept} up to {(maxSize / (1024 * 1024)).toFixed(0)}MB
              {maxFiles > 1 && ` (max ${maxFiles} files)`}
            </p>

            {/* Progress bar */}
            {uploading && progress > 0 && (
              <div className="mt-4 w-full max-w-xs mx-auto">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-300 rounded-full"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: theme.colors.accent[500]
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">{progress}% uploaded</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-500">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}
    </div>
  )
}
