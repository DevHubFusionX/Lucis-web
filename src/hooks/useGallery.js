import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import galleryService from '../services/professional/galleryService'
import uploadService from '../services/uploadService'

/**
 * Hook for professional gallery management
 */
export function useGallery() {
    return useQuery({
        queryKey: ['professional-gallery'],
        queryFn: () => galleryService.getGallery(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    })
}

/**
 * Hook for uploading gallery items
 */
export function useUploadGalleryMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ files, onProgress }) => {
            return uploadService.uploadGalleryItems(files, onProgress)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professional-gallery'] })
        }
    })
}

/**
 * Hook for deleting a gallery item
 */
export function useDeleteGalleryItemMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (itemId) => galleryService.removeGalleryItem(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professional-gallery'] })
        }
    })
}

/**
 * Hook for deleting multiple gallery items
 */
export function useDeleteGalleryItemsMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (itemIds) => galleryService.removeGalleryItems(itemIds),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professional-gallery'] })
        }
    })
}

/**
 * Unified hook for gallery data and operations
 */
export function useGalleryData() {
    const galleryQuery = useGallery()
    const uploadMutation = useUploadGalleryMutation()
    const deleteMutation = useDeleteGalleryItemMutation()
    const batchDeleteMutation = useDeleteGalleryItemsMutation()

    return {
        gallery: galleryQuery.data || [],
        isLoading: galleryQuery.isLoading,
        isError: galleryQuery.isError,
        error: galleryQuery.error,
        refetch: galleryQuery.refetch,
        mutations: {
            uploadItems: uploadMutation,
            deleteItem: deleteMutation,
            deleteItems: batchDeleteMutation
        }
    }
}

