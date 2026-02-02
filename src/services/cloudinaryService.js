/**
 * Cloudinary Direct Upload Service
 * 
 * This service handles direct uploads from the browser to Cloudinary
 * using unsigned uploads with an upload preset.
 * 
 * Required environment variables:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
 * - NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: An unsigned upload preset name
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

/**
 * Get Cloudinary upload URL
 * @param {string} resourceType - 'image', 'video', or 'auto'
 * @returns {string}
 */
const getUploadUrl = (resourceType = 'auto') => {
    return `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`
}

/**
 * Upload a single file to Cloudinary
 * @param {File} file - File to upload
 * @param {Object} options - Upload options
 * @param {string} [options.folder] - Cloudinary folder to upload to
 * @param {string} [options.publicId] - Custom public ID for the file
 * @param {Function} [options.onProgress] - Progress callback (0-100)
 * @param {string} [options.resourceType] - 'image', 'video', or 'auto'
 * @returns {Promise<{ url: string, publicId: string, thumbnail?: string }>}
 */
export const uploadToCloudinary = (file, options = {}) => {
    return new Promise((resolve, reject) => {
        if (!CLOUD_NAME || !UPLOAD_PRESET) {
            const error = 'Cloudinary configuration missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.local file.'
            reject(new Error(error))
            return
        }


        const { folder, publicId, onProgress, resourceType = 'auto' } = options
        const uploadUrl = getUploadUrl(resourceType)


        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', UPLOAD_PRESET)

        if (folder) {
            formData.append('folder', folder)
        }

        if (publicId) {
            formData.append('public_id', publicId)
        }

        const xhr = new XMLHttpRequest()

        // Track upload progress
        if (onProgress) {
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100)
                    onProgress(percent)
                }
            })
        }

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {

                try {
                    const response = JSON.parse(xhr.responseText)


                    // Build thumbnail URL for images/videos
                    let thumbnail = response.secure_url
                    if (response.resource_type === 'video') {
                        // Generate video thumbnail
                        thumbnail = response.secure_url.replace(/\.[^/.]+$/, '.jpg')
                    } else if (response.resource_type === 'image') {
                        // Generate optimized thumbnail
                        thumbnail = response.secure_url.replace('/upload/', '/upload/c_fill,h_200,w_200/')
                    }

                    resolve({
                        url: response.secure_url,
                        publicId: response.public_id,
                        thumbnail,
                        width: response.width,
                        height: response.height,
                        format: response.format,
                        resourceType: response.resource_type,
                        duration: response.duration, // For videos
                        bytes: response.bytes
                    })
                } catch (error) {
                    console.error('❌ Failed to parse Cloudinary response:', xhr.responseText)
                    reject(new Error('Failed to parse Cloudinary response'))
                }
            } else {
                console.error('❌ Cloudinary upload failed:', xhr.status, xhr.responseText)
                try {
                    const errorResponse = JSON.parse(xhr.responseText)
                    reject(new Error(errorResponse.error?.message || `Upload failed with status ${xhr.status}`))
                } catch {
                    reject(new Error(`Upload failed with status ${xhr.status}`))
                }
            }
        })

        xhr.addEventListener('error', () => {
            console.error('❌ Network error during Cloudinary upload')
            reject(new Error('Network error during upload'))
        })

        xhr.addEventListener('abort', () => {
            console.warn('⚠️ Cloudinary upload cancelled')
            reject(new Error('Upload cancelled'))
        })

        xhr.open('POST', uploadUrl)
        xhr.send(formData)
    })
}

/**
 * Upload multiple files to Cloudinary
 * @param {File[]} files - Files to upload
 * @param {Object} options - Upload options
 * @param {string} [options.folder] - Cloudinary folder
 * @param {Function} [options.onProgress] - Progress callback ({ current, total, percent })
 * @param {Function} [options.onFileComplete] - Callback when each file completes
 * @returns {Promise<Array<{ url: string, publicId: string, thumbnail?: string }>>}
 */
export const uploadMultipleToCloudinary = async (files, options = {}) => {
    const { folder, onProgress, onFileComplete } = options
    const results = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]

        try {
            const result = await uploadToCloudinary(file, {
                folder,
                onProgress: (filePercent) => {
                    if (onProgress) {
                        // Calculate overall progress
                        const completedPercent = (i / files.length) * 100
                        const currentFileContribution = (filePercent / files.length)
                        const totalPercent = Math.round(completedPercent + currentFileContribution)

                        onProgress({
                            current: i + 1,
                            total: files.length,
                            percent: totalPercent,
                            currentFilePercent: filePercent
                        })
                    }
                }
            })

            results.push(result)

            if (onFileComplete) {
                onFileComplete(result, i, files.length)
            }
        } catch (error) {
            // Include file info in error
            error.fileName = file.name
            error.fileIndex = i
            throw error
        }
    }

    if (onProgress) {
        onProgress({ current: files.length, total: files.length, percent: 100 })
    }

    return results
}

/**
 * Delete a file from Cloudinary (requires signed request - typically done server-side)
 * Note: For security, deletion should be done through your backend
 * @param {string} publicId - Public ID of the file to delete
 */
export const deleteFromCloudinary = async (publicId) => {
    console.warn('Cloudinary deletion should be done through your backend for security.')
    // This would require a backend endpoint
    throw new Error('Not implemented - use backend deletion')
}

/**
 * Generate a Cloudinary URL with transformations
 * @param {string} publicId - Public ID of the image
 * @param {Object} options - Transformation options
 * @returns {string}
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
    if (!CLOUD_NAME) {
        console.warn('Cloudinary cloud name not configured')
        return ''
    }

    const {
        width,
        height,
        crop = 'fill',
        format = 'auto',
        quality = 'auto'
    } = options

    const transformations = []

    if (width) transformations.push(`w_${width}`)
    if (height) transformations.push(`h_${height}`)
    if (crop) transformations.push(`c_${crop}`)
    transformations.push(`f_${format}`)
    transformations.push(`q_${quality}`)

    const transformStr = transformations.join(',')

    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformStr}/${publicId}`
}

/**
 * Check if Cloudinary is configured
 * @returns {boolean}
 */
export const isCloudinaryConfigured = () => {
    return !!(CLOUD_NAME && UPLOAD_PRESET)
}

export default {
    uploadToCloudinary,
    uploadMultipleToCloudinary,
    deleteFromCloudinary,
    getCloudinaryUrl,
    isCloudinaryConfigured
}
