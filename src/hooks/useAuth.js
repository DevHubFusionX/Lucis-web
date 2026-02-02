'use client'
/**
 * Auth Hook - Backwards Compatible Wrapper
 * 
 * This file now re-exports from the Zustand auth store.
 * All existing imports of `useAuth` continue to work unchanged.
 * 
 * Migration: AuthProvider is no longer needed (removed from Providers.js)
 */

// Re-export useAuth from Zustand store
export { useAuth } from '../stores/authStore'

// Legacy export for any code still importing AuthProvider
// This is a no-op component that just renders children
export const AuthProvider = ({ children }) => children
