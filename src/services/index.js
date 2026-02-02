// Main services barrel export
export { default as AuthService } from './authService'
export { default as BookingService } from './booking/bookingService'
export { default as SearchService } from './search/searchService'

// Professional services
export * from './professional'

// Client services
export * from './client'

// Shared services
export * from './shared'

// Legacy compatibility - will be removed in next version
export { default as professionalService } from './professionalService'
export { default as authService } from './authService'
export { default as bookingService } from './bookingService'
export { default as searchService } from './search/searchService'
