/**
 * Image validation utilities
 */

/**
 * Validate image file type
 * @param {File} file - File to validate
 * @param {string[]} allowedTypes - Array of allowed MIME types or categories (e.g., ['image/jpeg', 'image/png'] or ['image/*'])
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateImageType = (file, allowedTypes = ['image/*']) => {
    if (!file) {
        return { valid: false, error: 'No file provided' }
    }

    const isValid = allowedTypes.some(type => {
        if (type === '*' || type === '*/*') return true
        if (type.endsWith('/*')) {
            const category = type.replace('/*', '')
            return file.type.startsWith(category + '/')
        }
        return file.type === type
    })

    if (!isValid) {
        return {
            valid: false,
            error: `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(', ')}`
        }
    }

    return { valid: true }
}

/**
 * Validate image file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum size in bytes
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateImageSize = (file, maxSize = 5 * 1024 * 1024) => {
    if (!file) {
        return { valid: false, error: 'No file provided' }
    }

    if (file.size > maxSize) {
        const sizeMB = (maxSize / (1024 * 1024)).toFixed(1)
        const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
        return {
            valid: false,
            error: `File size (${fileSizeMB}MB) exceeds maximum allowed (${sizeMB}MB)`
        }
    }

    return { valid: true }
}

/**
 * Validate image dimensions
 * @param {File} file - Image file to validate
 * @param {Object} constraints - Dimension constraints
 * @param {number} [constraints.minWidth] - Minimum width
 * @param {number} [constraints.maxWidth] - Maximum width
 * @param {number} [constraints.minHeight] - Minimum height
 * @param {number} [constraints.maxHeight] - Maximum height
 * @param {number} [constraints.aspectRatio] - Required aspect ratio (width/height)
 * @param {number} [constraints.aspectRatioTolerance] - Tolerance for aspect ratio (default: 0.1)
 * @returns {Promise<{ valid: boolean, error?: string, dimensions?: { width: number, height: number } }>}
 */
export const validateImageDimensions = (file, constraints = {}) => {
    return new Promise((resolve) => {
        if (!file) {
            resolve({ valid: false, error: 'No file provided' })
            return
        }

        if (!file.type.startsWith('image/')) {
            resolve({ valid: true }) // Skip dimension check for non-images
            return
        }

        const img = new Image()
        const objectUrl = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(objectUrl)
            const { width, height } = img
            const {
                minWidth,
                maxWidth,
                minHeight,
                maxHeight,
                aspectRatio,
                aspectRatioTolerance = 0.1
            } = constraints

            // Check minimum width
            if (minWidth && width < minWidth) {
                resolve({
                    valid: false,
                    error: `Image width (${width}px) is less than minimum required (${minWidth}px)`,
                    dimensions: { width, height }
                })
                return
            }

            // Check maximum width
            if (maxWidth && width > maxWidth) {
                resolve({
                    valid: false,
                    error: `Image width (${width}px) exceeds maximum allowed (${maxWidth}px)`,
                    dimensions: { width, height }
                })
                return
            }

            // Check minimum height
            if (minHeight && height < minHeight) {
                resolve({
                    valid: false,
                    error: `Image height (${height}px) is less than minimum required (${minHeight}px)`,
                    dimensions: { width, height }
                })
                return
            }

            // Check maximum height
            if (maxHeight && height > maxHeight) {
                resolve({
                    valid: false,
                    error: `Image height (${height}px) exceeds maximum allowed (${maxHeight}px)`,
                    dimensions: { width, height }
                })
                return
            }

            // Check aspect ratio
            if (aspectRatio) {
                const actualRatio = width / height
                const diff = Math.abs(actualRatio - aspectRatio)
                if (diff > aspectRatioTolerance) {
                    resolve({
                        valid: false,
                        error: `Image aspect ratio (${actualRatio.toFixed(2)}) does not match required ratio (${aspectRatio.toFixed(2)})`,
                        dimensions: { width, height }
                    })
                    return
                }
            }

            resolve({ valid: true, dimensions: { width, height } })
        }

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            resolve({ valid: false, error: 'Failed to load image for validation' })
        }

        img.src = objectUrl
    })
}

/**
 * Compress an image file
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @param {number} [options.quality] - Quality (0-1, default: 0.8)
 * @param {number} [options.maxWidth] - Maximum width (will scale proportionally)
 * @param {number} [options.maxHeight] - Maximum height (will scale proportionally)
 * @param {string} [options.type] - Output type (default: 'image/jpeg')
 * @returns {Promise<File>}
 */
export const compressImage = (file, options = {}) => {
    return new Promise((resolve, reject) => {
        const {
            quality = 0.8,
            maxWidth = 1920,
            maxHeight = 1080,
            type = 'image/jpeg'
        } = options

        if (!file.type.startsWith('image/')) {
            resolve(file) // Return original if not an image
            return
        }

        const img = new Image()
        const objectUrl = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(objectUrl)

            let { width, height } = img

            // Calculate new dimensions maintaining aspect ratio
            if (width > maxWidth) {
                height = (height * maxWidth) / width
                width = maxWidth
            }
            if (height > maxHeight) {
                width = (width * maxHeight) / height
                height = maxHeight
            }

            // Create canvas and draw resized image
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)

            // Convert to blob
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Failed to compress image'))
                        return
                    }

                    // Create new File from blob
                    const compressedFile = new File([blob], file.name, {
                        type,
                        lastModified: Date.now()
                    })

                    resolve(compressedFile)
                },
                type,
                quality
            )
        }

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error('Failed to load image for compression'))
        }

        img.src = objectUrl
    })
}

/**
 * Validate a file with all constraints
 * @param {File} file - File to validate
 * @param {Object} constraints - Validation constraints
 * @param {string[]} [constraints.allowedTypes] - Allowed MIME types
 * @param {number} [constraints.maxSize] - Maximum file size in bytes
 * @param {Object} [constraints.dimensions] - Dimension constraints
 * @returns {Promise<{ valid: boolean, errors: string[] }>}
 */
export const validateFile = async (file, constraints = {}) => {
    const errors = []

    // Validate type
    if (constraints.allowedTypes) {
        const typeResult = validateImageType(file, constraints.allowedTypes)
        if (!typeResult.valid) {
            errors.push(typeResult.error)
        }
    }

    // Validate size
    if (constraints.maxSize) {
        const sizeResult = validateImageSize(file, constraints.maxSize)
        if (!sizeResult.valid) {
            errors.push(sizeResult.error)
        }
    }

    // Validate dimensions
    if (constraints.dimensions) {
        const dimResult = await validateImageDimensions(file, constraints.dimensions)
        if (!dimResult.valid) {
            errors.push(dimResult.error)
        }
    }

    return {
        valid: errors.length === 0,
        errors
    }
}

/**
 * Get image dimensions from a file
 * @param {File} file - Image file
 * @returns {Promise<{ width: number, height: number }>}
 */
export const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'))
            return
        }

        const img = new Image()
        const objectUrl = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(objectUrl)
            resolve({ width: img.width, height: img.height })
        }

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl)
            reject(new Error('Failed to load image'))
        }

        img.src = objectUrl
    })
}

/**
 * Create a preview URL for a file
 * @param {File} file - File to preview
 * @returns {string} - Object URL for preview
 */
export const createPreviewUrl = (file) => {
    return URL.createObjectURL(file)
}

/**
 * Convert a file to base64
 * @param {File} file - File to convert
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export default {
    validateImageType,
    validateImageSize,
    validateImageDimensions,
    compressImage,
    validateFile,
    getImageDimensions,
    createPreviewUrl,
    fileToBase64
}
