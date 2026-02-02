import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import bookingService from '../services/bookingService'
import { ClientBookingService } from '../services/client'


/**
 * Hook for booking-related mutations
 */
export function useBookingMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (bookingData) => bookingService.createBooking(bookingData),
        onSuccess: () => {
            // Invalidate professional bookings and notifications
            queryClient.invalidateQueries({ queryKey: ['pro-bookings'] })
            queryClient.invalidateQueries({ queryKey: ['client-bookings'] })
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }
    })
}

/**
 * Hook for fetching client bookings
 */
export function useClientBookings() {
    return useQuery({
        queryKey: ['client-bookings'],
        queryFn: () => ClientBookingService.getBookings(),
        staleTime: 5 * 60 * 1000 // 5 minutes
    })
}

/**
 * Hook for cancelling a booking
 */
export function useCancelBookingMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (bookingId) => ClientBookingService.cancelBooking(bookingId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['client-bookings'] })
            queryClient.invalidateQueries({ queryKey: ['notifications'] })
        }
    })
}

