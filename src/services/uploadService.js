import httpClient from './api/httpClient'
import { uploadToCloudinary, uploadMultipleToCloudinary, isCloudinaryConfigured } from './cloudinaryService'
import { validateFile, compressImage } from '../utils/imageValidation'

/**
 * Centralized Upload Service
 * Handles all file upload operations with Cloudinary integration
 * 
 * Flow:
 * 1. Validate file
 * 2. Upload to Cloudinary (direct from browser)
 * 3. Send Cloudinary URL to backend to save in database
 */
class UploadService {
    constructor() {
        this.defaultConstraints = {
            allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            maxSize: 5 * 1024 * 1024, // 5MB
        }
    }

    /**
     * Upload a single file to Cloudinary
     * @param {File} file - File to upload
     * @param {Object} options - Upload options
     * @param {boolean} [options.compress] - Whether to compress the image before upload
     * @param {Object} [options.constraints] - Validation constraints
     * @param {Function} [options.onProgress] - Progress callback (0-100)
     * @param {string} [options.folder] - Cloudinary folder
     * @returns {Promise<{ url: string, publicId: string, thumbnail?: string }>}
     */
    async uploadFile(file, options = {}) {
        const { compress = false, constraints = {}, onProgress, folder } = options
        const mergedConstraints = { ...this.defaultConstraints, ...constraints }

        // Check Cloudinary configuration
        if (!isCloudinaryConfigured()) {
            throw new Error('Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment.')
        }

        // Validate file
        const validation = await validateFile(file, mergedConstraints)
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '))
        }

        // Compress if requested
        let fileToUpload = file
        if (compress && file.type.startsWith('image/')) {
            try {
                fileToUpload = await compressImage(file, {
                    quality: 0.85,
                    maxWidth: 1920,
                    maxHeight: 1920
                })
            } catch (err) {
                // Silently fallback if compression fails
            }
        }

        // Upload to Cloudinary
        const result = await uploadToCloudinary(fileToUpload, {
            folder,
            onProgress
        })

        return result
    }

    /**
     * Upload multiple files to Cloudinary
     * @param {File[]} files - Files to upload
     * @param {Object} options - Upload options
     * @param {boolean} [options.compress] - Whether to compress images before upload
     * @param {Object} [options.constraints] - Validation constraints
     * @param {Function} [options.onProgress] - Progress callback ({ current, total, percent })
     * @param {string} [options.folder] - Cloudinary folder
     * @returns {Promise<Array<{ url: string, publicId: string, thumbnail?: string }>>}
     */
    async uploadFiles(files, options = {}) {
        const { compress = false, constraints = {}, onProgress, folder } = options
        const mergedConstraints = { ...this.defaultConstraints, ...constraints }

        // Check Cloudinary configuration
        if (!isCloudinaryConfigured()) {
            throw new Error('Cloudinary is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment.')
        }

        // Validate all files first
        for (const file of files) {
            const validation = await validateFile(file, mergedConstraints)
            if (!validation.valid) {
                throw new Error(`${file.name}: ${validation.errors.join(', ')}`)
            }
        }

        // Compress all images if requested
        let filesToUpload = files
        if (compress) {
            filesToUpload = await Promise.all(
                files.map(async (file) => {
                    if (file.type.startsWith('image/')) {
                        try {
                            return await compressImage(file, {
                                quality: 0.85,
                                maxWidth: 1920,
                                maxHeight: 1920
                            })
                        } catch (err) {
                            return file
                        }
                    }
                    return file
                })
            )
        }

        // Upload all to Cloudinary
        const results = await uploadMultipleToCloudinary(filesToUpload, {
            folder,
            onProgress
        })

        return results
    }

    /**
     * Upload profile picture and update user profile
     * @param {File} file - Image file
     * @param {string} userType - 'client' or 'professional'
     * @returns {Promise<{ url: string, publicId: string }>}
     */
    async uploadProfilePicture(file, userType = 'client') {
        // Validate specifically for profile pictures
        const constraints = {
            allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
            maxSize: 5 * 1024 * 1024, // 5MB
            dimensions: {
                minWidth: 100,
                minHeight: 100
            }
        }

        const validation = await validateFile(file, constraints)
        if (!validation.valid) {
            throw new Error(validation.errors.join(', '))
        }

        // Compress for profile pictures
        let fileToUpload = file
        try {
            fileToUpload = await compressImage(file, {
                quality: 0.9,
                maxWidth: 500,
                maxHeight: 500
            })
        } catch (err) {
            // Silently fallback
        }

        // Upload to Cloudinary
        const folder = userType === 'professional' ? 'lucis/professionals/profiles' : 'lucis/clients/profiles'
        const uploadResult = await uploadToCloudinary(fileToUpload, { folder })

        // Update profile with the Cloudinary URL
        const endpoint = userType === 'professional' ? '/professionals/profile-photo' : '/users/profile-photo'

        const updateResponse = await httpClient.put(endpoint, {
            url: uploadResult.url,
            publicId: uploadResult.publicId
        })

        if (updateResponse.error) {
            throw new Error(updateResponse.message || 'Failed to update profile picture')
        }

        return {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
            thumbnail: uploadResult.thumbnail
        }
    }

    /**
     * Upload gallery items for a professional
     * @param {File[]} files - Array of image/video files
     * @param {Function} [onProgress] - Progress callback
     * @returns {Promise<Array<{ url: string, publicId: string, type: string, thumbnail: string }>>}
     */
    async uploadGalleryItems(files, onProgress) {
        // Upload to Cloudinary
        const uploadResults = await uploadMultipleToCloudinary(files, {
            folder: 'lucis/professionals/gallery',
            onProgress
        })

        // Format for gallery API
        const galleryItems = uploadResults.map((result, index) => ({
            url: result.url,
            publicId: result.publicId,
            type: files[index].type.startsWith('video/') ? 'video' : 'image',
            thumbnail: result.thumbnail || result.url,
            ...(result.duration && { duration: formatDuration(result.duration) })
        }))

        // Save to backend via GalleryService
        const { default: galleryService } = await import('./professional/galleryService')
        const response = await galleryService.uploadGalleryItems(galleryItems)


        if (response.error) {
            throw new Error(response.message || 'Failed to save gallery items')
        }


        return galleryItems
    }
}

/**
 * Format duration in seconds to HH:MM:SS or MM:SS
 * @param {number} seconds 
 * @returns {string}
 */
function formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    if (hrs > 0) {
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default new UploadService()
