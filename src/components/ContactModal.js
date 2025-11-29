'use client'
import { useState } from 'react'

export default function ContactModal({ professional, isOpen, onClose }) {
  const [message, setMessage] = useState('')

  const handleSendMessage = () => {
    // For now, just show contact info since there's no messaging API
    const contactInfo = `
Professional: ${professional.firstName} ${professional.lastName}
Email: ${professional.email}
Phone: ${professional.phone}

Your message: ${message}
    `
    
    // Copy to clipboard or open email client
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contactInfo)
      alert('Contact information copied to clipboard!')
    } else {
      // Fallback: open email client
      const subject = encodeURIComponent(`Inquiry from ${professional.firstName} ${professional.lastName}`)
      const body = encodeURIComponent(message)
      window.open(`mailto:${professional.email}?subject=${subject}&body=${body}`)
    }
    
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{color: '#111827'}}>
            Contact {professional.firstName} {professional.lastName}
          </h2>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity" style={{color: '#9CA3AF'}}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 rounded-lg" style={{backgroundColor: '#F9FAFB'}}>
            <div className="text-sm font-medium mb-2" style={{color: '#374151'}}>Contact Information:</div>
            <div className="text-sm" style={{color: '#6B7280'}}>
              <div>📧 {professional.email}</div>
              <div>📞 {professional.phone}</div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{color: '#374151'}}>Your Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
              style={{borderColor: '#E5E7EB', color: '#111827'}}
              rows="4"
              placeholder="Hi, I'm interested in your photography services..."
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border font-medium hover:bg-gray-50 transition-colors"
            style={{borderColor: '#E5E7EB', color: '#374151'}}
          >
            Cancel
          </button>
          <button
            onClick={handleSendMessage}
            className="flex-1 px-4 py-3 rounded-xl text-white font-medium shadow-sm hover:shadow-md transition-all"
            style={{backgroundColor: '#1E3A8A'}}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  )
}