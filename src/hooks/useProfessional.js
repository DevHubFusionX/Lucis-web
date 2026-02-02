import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import professionalService from '../services/professionalService'
import { PackageService } from '../services'
import { useNotify } from '../stores/useNotificationStore'

/**
 * Hook for fetching professional dashboard overview data
 * Consolidates bookings, views, and schedules into a single queryable state.
 */
export function useProfessionalDashboard() {
    return useQuery({
        queryKey: ['professional', 'dashboard'],
        queryFn: async () => {
            const [bookings, views, schedules] = await Promise.all([
                professionalService.getBookings(),
                professionalService.getViews(),
                professionalService.getSchedules()
            ])

            // Process dashboard stats
            const totalBookings = bookings.length
            const pendingInquiries = bookings.filter(b => b.status === 'pending').length
            const upcomingBookings = bookings
                .filter(b => b.status === 'accepted' || b.status === 'confirmed')
                .map(b => {
                    const startDate = new Date(b.startDateTime)
                    return {
                        client: `${b.user?.firstName} ${b.user?.lastName}`,
                        date: b.startDateTime,
                        time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status: 'confirmed'
                    }
                })

            const earnings = bookings.reduce((sum, b) => sum + (b.price || b.totalPrice || 0), 0)
            const profileViews = views.records?.length || 0

            // Process calendar data
            const bookedDates = bookings
                .filter(b => b.status === 'accepted' || b.status === 'confirmed')
                .map(b => {
                    const startDate = new Date(b.startDateTime)
                    return {
                        date: startDate.getDate(),
                        month: startDate.getMonth(),
                        year: startDate.getFullYear(),
                        client: `${b.user?.firstName} ${b.user?.lastName}`,
                        time: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                })

            return {
                stats: {
                    totalBookings,
                    earnings,
                    profileViews,
                    pendingInquiries,
                    upcomingBookings: upcomingBookings.slice(0, 3)
                },
                calendar: {
                    schedules: schedules.records || [],
                    bookedDates
                }
            }
        },
        staleTime: 2 * 60 * 1000, // 2 minutes
    })
}

/**
 * Hook for professional reviews
 */
export function useProfessionalReviews() {
    return useQuery({
        queryKey: ['professional', 'reviews'],
        queryFn: () => professionalService.getReviews(),
        staleTime: 5 * 60 * 1000
    })
}

/**
 * Hook for professional packages
 */
export function usePackages() {
    return useQuery({
        queryKey: ['professional', 'packages'],
        queryFn: () => PackageService.getPackages(),
        staleTime: 5 * 60 * 1000
    })
}

/**
 * Hook for adding a new package
 */
export function useAddPackage() {
    const queryClient = useQueryClient()
    const notify = useNotify()

    return useMutation({
        mutationFn: (packageData) => PackageService.addPackage(packageData),
        onSuccess: (newPackage) => {
            queryClient.invalidateQueries({ queryKey: ['professional', 'packages'] })
            notify.success(`${newPackage.name} has been created successfully.`, 'Package Created')
        },
        onError: (error) => {
            console.error('Failed to add package:', error)
            notify.error('Failed to create package. Please try again.', 'Creation Failed')
        }
    })
}

/**
 * Hook for updating a package
 */
export function useUpdatePackage() {
    const queryClient = useQueryClient()
    const notify = useNotify()

    return useMutation({
        mutationFn: ({ id, data }) => PackageService.updatePackage(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['professional', 'packages'] })
            notify.success(`${variables.data.name} has been updated successfully.`, 'Package Updated')
        },
        onError: (error) => {
            console.error('Failed to update package:', error)
            notify.error('Failed to update package. Please try again.', 'Update Failed')
        }
    })
}

/**
 * Hook for deleting a package
 */
export function useDeletePackage() {
    const queryClient = useQueryClient()
    const notify = useNotify()

    return useMutation({
        mutationFn: (id) => PackageService.deletePackage(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professional', 'packages'] })
            notify.info('The package has been deleted.', 'Package Deleted')
        },
        onError: (error) => {
            console.error('Failed to delete package:', error)
            notify.error('Failed to delete package. Please try again.', 'Deletion Failed')
        }
    })
}

/**
 * Hook for professional notifications
 */
export function useNotifications() {
    return useQuery({
        queryKey: ['professional', 'notifications'],
        queryFn: () => professionalService.getNotifications(),
        staleTime: 1 * 60 * 1000 // 1 minute
    })
}

/**
 * Hook for a single notification detail
 */
export function useNotificationDetail(id) {
    return useQuery({
        queryKey: ['professional', 'notifications', id],
        queryFn: () => professionalService.getNotification(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000
    })
}

/**
 * Hook for marking a notification as read
 */
export function useMarkNotificationRead() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id) => professionalService.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['professional', 'notifications'] })
            // Also invalidate dashboard since it might show unread counts/summaries
            queryClient.invalidateQueries({ queryKey: ['professional', 'dashboard'] })
        }
    })
}
