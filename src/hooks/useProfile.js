import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import authService from '../services/authService'
import professionalService from '../services/professionalService'
import { useAuthStore } from '../stores/authStore'

/**
 * Hook for profile-related mutations
 */
export function useUpdateProfileMutation(userType = 'client') {
    const queryClient = useQueryClient()
    const setUser = useAuthStore(state => state.setUser)

    return useMutation({
        mutationFn: (userData) => authService.updateUser(userData, userType),
        onSuccess: (data) => {
            // Update Zustand store (data is the user object)
            if (data) {
                setUser(data, userType)
            }

            // Invalidate profile queries
            queryClient.invalidateQueries({ queryKey: ['profile', userType] })
        }
    })
}

export function useUpdateProfilePhotoMutation(userType = 'client') {
    const queryClient = useQueryClient()
    const setUser = useAuthStore(state => state.setUser)

    return useMutation({
        mutationFn: async (file) => {
            if (userType === 'client') {
                const { default: profileService } = await import('../services/client/profileService')
                return profileService.uploadProfilePicture(file)
            } else {
                const { default: professionalService } = await import('../services/professionalService')
                return professionalService.uploadProfilePicture(file)
            }
        },
        onSuccess: (data) => {
            const user = useAuthStore.getState().user
            if (user && data) {
                const newUser = { ...user, profilePicture: data }
                setUser(newUser, userType)
            }
            queryClient.invalidateQueries({ queryKey: ['profile', userType] })
        }
    })
}


export function useDeleteProfilePhotoMutation(userType = 'client') {
    const queryClient = useQueryClient()
    const setUser = useAuthStore(state => state.setUser)

    return useMutation({
        mutationFn: () => authService.deleteProfilePhoto(userType),
        onSuccess: () => {
            const user = useAuthStore.getState().user
            if (user) {
                const newUser = { ...user, profilePicture: null }
                setUser(newUser, userType)
            }
            queryClient.invalidateQueries({ queryKey: ['profile', userType] })
        }
    })
}

/**
 * Hook for fetching profile data
 */
export function useProfile(userType = 'client') {
    return useQuery({
        queryKey: ['profile', userType],
        queryFn: () => authService.fetchUserProfile(userType),
        staleTime: 5 * 60 * 1000 // 5 minutes
    })
}

/**
 * Unified hook for profile data and mutations
 */
export function useProfileData(userType = 'client') {
    const profileQuery = useProfile(userType)
    const updateProfile = useUpdateProfileMutation(userType)
    const uploadPhoto = useUpdateProfilePhotoMutation(userType)
    const deletePhoto = useDeleteProfilePhotoMutation(userType)

    return {
        profileData: profileQuery.data,
        isLoading: profileQuery.isLoading,
        isError: profileQuery.isError,
        error: profileQuery.error,
        refetch: profileQuery.refetch,
        mutations: {
            updateProfile,
            uploadPhoto,
            deletePhoto
        }
    }
}
