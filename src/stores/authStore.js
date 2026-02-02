'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useRouter } from 'next/navigation'
import { AuthService } from '../services'
import logger from '../utils/logger'
import { getErrorMessage } from '../utils/errors'

/**
 * Zustand Auth Store
 * Replaces AuthContext with simpler, more performant state management
 */
export const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            userType: null,
            loading: true,

            // Computed
            isAuthenticated: () => !!get().user,

            // Actions
            setUser: (user, userType) => set({ user, userType, loading: false }),

            setLoading: (loading) => set({ loading }),

            /**
             * Initialize auth state from storage/token
             */
            initialize: () => {
                const token = AuthService.getToken()
                if (token) {
                    const user = AuthService.getUser()
                    const userType = AuthService.getUserType()
                    set({ user, userType, loading: false })
                } else {
                    set({ loading: false })
                }
            },

            /**
             * Login user
             * @param {Object} credentials - Email and password
             * @param {string} type - 'client' or 'professional'
             */
            login: async (credentials, type = 'client') => {
                try {
                    const data = await AuthService.login(credentials, type)
                    set({ user: data.user, userType: type, loading: false })
                    return { success: true, data }
                } catch (error) {
                    logger.error('Login failed', error)
                    return { success: false, error: error.message }
                }
            },

            /**
             * Signup user
             * @param {Object} userData - User registration data
             * @param {string} type - 'client' or 'professional'
             */
            signup: async (userData, type = 'client') => {
                try {
                    const data = await AuthService.signup(userData, type)
                    set({ user: data.user, userType: type, loading: false })
                    return { success: true, data }
                } catch (error) {
                    logger.error('Signup failed', error, { userType: type })
                    return { success: false, error: getErrorMessage(error) }
                }
            },

            /**
             * Logout user
             */
            logout: async () => {
                await AuthService.logout()
                set({ user: null, userType: null, loading: false })
            },

            /**
             * Update user profile
             * @param {Object} userData - Updated user data
             */
            updateUser: async (userData) => {
                try {
                    const { userType } = get()
                    const data = await AuthService.updateUser(userData, userType)
                    set({ user: data.user })
                    return { success: true, data }
                } catch (error) {
                    logger.error('Update user failed', error)
                    return { success: false, error: error.message }
                }
            },

            /**
             * Refresh user profile from server
             */
            refreshUser: async () => {
                try {
                    const userData = await AuthService.fetchUserProfile()
                    set({ user: userData })
                    return { success: true, data: userData }
                } catch (error) {
                    logger.error('Refresh user failed', error)
                    return { success: false, error: error.message }
                }
            },
        }),
        {
            name: 'lucis-auth',
            // Only persist these fields
            partialize: (state) => ({
                user: state.user,
                userType: state.userType,
            }),
            // Rehydrate loading state after hydration
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.loading = false
                }
            },
        }
    )
)

/**
 * Hook for components that need router integration
 * Wraps useAuthStore with navigation helpers
 */
export const useAuth = () => {
    const store = useAuthStore()
    const router = useRouter()

    return {
        ...store,
        isAuthenticated: store.isAuthenticated(),

        // Override login to include navigation
        login: async (credentials, type = 'client') => {
            const result = await store.login(credentials, type)
            if (result.success) {
                const dashboardPath = type === 'professional' ? '/photographer' : '/client'
                router.push(dashboardPath)
            }
            return result
        },

        // Override signup to include navigation
        signup: async (userData, type = 'client') => {
            const result = await store.signup(userData, type)
            if (result.success) {
                const dashboardPath = type === 'professional' ? '/photographer' : '/client'
                router.push(dashboardPath)
            }
            return result
        },

        // Override logout to include navigation
        logout: async () => {
            await store.logout()
            router.push('/')
        },
    }
}

export default useAuthStore
