'use client'
import { useState } from 'react'
import { Mail, Phone, MessageSquare, Copy, Check, Send } from 'lucide-react'
import BaseModal from './BaseModal'

/**
 * @typedef {Object} ContactModalProps
 * @property {Object} professional - Professional object
 * @property {boolean} isOpen - Whether modal is open
 * @property {() => void} onClose - Close handler
 */

/**
 * Contact modal for messaging professionals
 * @param {ContactModalProps} props
 */
export default function ContactModal({ professional, isOpen, onClose }) {
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopyContact = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendMessage = () => {
    const subject = encodeURIComponent(`Inquiry for ${professional.firstName} ${professional.lastName}`)
    const body = encodeURIComponent(message)
    window.open(`mailto:${professional.email}?subject=${subject}&body=${body}`)
    onClose()
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Contact ${professional.firstName}`}
      size="md"
    >
      <div className="space-y-8 p-1">
        {/* Professional Quick Info */}
        <div className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50 border border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-2xl font-bold text-blue-600 shadow-sm border border-gray-100">
            {professional.firstName?.[0]}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">{professional.firstName} {professional.lastName}</h4>
            <p className="text-gray-500 text-sm">Professional Photographer</p>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleCopyContact(professional.email)}
            className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-white border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Mail size={24} />
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Email</p>
              <p className="text-sm font-bold text-gray-900 truncate max-w-[140px]">{professional.email}</p>
            </div>
          </button>

          <button 
            onClick={() => handleCopyContact(professional.phone)}
            className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-white border border-gray-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Phone size={24} />
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Phone</p>
              <p className="text-sm font-bold text-gray-900">{professional.phone || 'Not provided'}</p>
            </div>
          </button>
        </div>

        {/* Message Form */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <label className="text-sm font-bold text-gray-700">Send a Message</label>
            {copied && (
              <span className="text-[10px] font-bold text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-right-2">
                <Check size={12} /> Copied to clipboard
              </span>
            )}
          </div>
          <div className="relative group">
            <MessageSquare className="absolute top-4 left-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell them about your project, date, and vision..."
              className="w-full pl-12 pr-4 py-4 rounded-3xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all min-h-[140px] text-gray-700 leading-relaxed"
            />
          </div>
          <p className="text-[10px] text-gray-400 px-3 italic">
            This will open your default email app with the message pre-filled.
          </p>
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className={`w-full py-4 rounded-[2rem] font-bold text-lg flex items-center justify-center gap-3 transition-all ${
            !message.trim()
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-[0.98]'
          }`}
        >
          <Send size={20} />
          Send Message
        </button>
      </div>
    </BaseModal>
  )
}