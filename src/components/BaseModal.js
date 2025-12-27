/**
 * @typedef {Object} BaseModalProps
 * @property {boolean} isOpen - Whether the modal is open
 * @property {() => void} onClose - Function to call when modal should close
 * @property {React.ReactNode} children - Modal content
 * @property {string} [title] - Optional modal title
 * @property {string} [size] - Modal size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
 * @property {boolean} [closeOnBackdrop] - Whether clicking backdrop closes modal
 * @property {boolean} [closeOnEscape] - Whether ESC key closes modal
 * @property {boolean} [showCloseButton] - Whether to show close button
 * @property {string} [className] - Additional CSS classes for modal content
 */

'use client'
import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Base modal component with common functionality
 * @param {BaseModalProps} props
 */
export default function BaseModal({
  isOpen,
  onClose,
  children,
  title,
  size = 'lg',
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  className = ''
}) {
  // Handle ESC key
  const handleEscape = useCallback((e) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose()
    }
  }, [closeOnEscape, onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className={`bg-white rounded-3xl shadow-2xl w-full ${sizeClasses[size]} ${className} max-h-[90vh] flex flex-col relative`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  {title && (
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="ml-auto p-2 rounded-full hover:bg-gray-100 transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {children}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
