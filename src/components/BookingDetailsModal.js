'use client'
import { Calendar, Clock, MapPin, DollarSign, User, Mail, Phone, CreditCard, FileText, Download, CheckCircle2, ShieldCheck } from 'lucide-react'
import BaseModal from './BaseModal'

const STATUS_CONFIG = {
  confirmed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', iconColor: 'text-green-500' },
  upcoming: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', iconColor: 'text-blue-500' },
  completed: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100', iconColor: 'text-gray-500' },
  cancelled: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', iconColor: 'text-red-500' }
}

const getStatusConfig = (status) => STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.completed

/**
 * @typedef {Object} BookingDetailsModalProps
 * @property {Object} booking - Booking object
 * @property {boolean} isOpen - Whether modal is open
 * @property {() => void} onClose - Close handler
 */

/**
 * Modal for viewing detailed booking information
 * @param {BookingDetailsModalProps} props
 */
export default function BookingDetailsModal({ booking, isOpen, onClose }) {
  if (!isOpen || !booking) return null

  const status = getStatusConfig(booking.status)
  const startDate = new Date(booking.startDateTime)
  const endDate = booking.endDateTime ? new Date(booking.endDateTime) : new Date(startDate.getTime() + 60 * 60000)
  const duration = Math.round((endDate - startDate) / 60000)

  const Section = ({ icon: Icon, title, children, className = "" }) => (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 px-1">
        <Icon size={18} className="text-gray-400" />
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">{title}</h3>
      </div>
      <div className="bg-white rounded-3xl p-4 sm:p-5 md:p-6 border border-gray-100 shadow-sm relative overflow-hidden group hover:border-blue-100 transition-colors">
        {children}
      </div>
    </div>
  )

  const InfoRow = ({ label, value, subValue, icon: Icon }) => (
    <div className="flex items-start gap-4 py-3 first:pt-0 last:pb-0 border-b border-gray-50 last:border-0">
      {Icon && <Icon size={16} className="text-gray-400 mt-1" />}
      <div className="flex-1 flex justify-between items-start">
        <span className="text-sm font-medium text-gray-500 mt-0.5">{label}</span>
        <div className="text-right">
          <p className="font-bold text-gray-900">{value}</p>
          {subValue && <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-tighter">{subValue}</p>}
        </div>
      </div>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Booking Details"
      size="xl"
      className="max-h-[85vh]"
    >
      <div className="flex flex-col h-full bg-gray-50/50">
        <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 overflow-y-auto custom-scrollbar flex-1">
          {/* Status Banner */}
          <div className={`${status.bg} ${status.border} border rounded-3xl p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-0 text-center sm:text-left`}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center ${status.iconColor} shadow-sm shrink-0`}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Booking Status</p>
                <h4 className={`text-lg font-black uppercase ${status.text}`}>{booking.status}</h4>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">Confirmation ID</p>
              <p className="font-mono text-xs font-bold text-gray-900">#{booking.id?.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-8">
              {/* Professional Section */}
              <Section icon={User} title="Service Provider">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl shadow-sm overflow-hidden">
                    {booking.professional?.profilePicture ? (
                      <img src={booking.professional.profilePicture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-blue-600">{booking.professional?.firstName?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900">
                      {booking.professional?.firstName} {booking.professional?.lastName}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 font-medium">
                       <span className="flex items-center gap-1.5"><Mail size={14} className="text-blue-400" /> Professional</span>
                    </div>
                  </div>
                </div>
              </Section>

              {/* Schedule Section */}
              <Section icon={Calendar} title="Appointment Info">
                <div className="space-y-1">
                   <InfoRow 
                    label="Scheduled Date" 
                    value={startDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} 
                    icon={Calendar}
                   />
                   <InfoRow 
                    label="Session Time" 
                    value={`${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                    subValue={`${duration} minute session`}
                    icon={Clock}
                   />
                </div>
              </Section>
            </div>

            <div className="space-y-8">
              {/* Location & Service */}
              <Section icon={MapPin} title="Service Details">
                 <div className="space-y-4">
                    <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100">
                       <p className="text-[10px] uppercase tracking-widest font-black text-blue-400 mb-1">Base Location</p>
                       <p className="font-bold text-gray-900">{booking.professional?.baseCity || 'Location to be confirmed'}</p>
                    </div>
                    <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100">
                       <p className="text-[10px] uppercase tracking-widest font-black text-purple-400 mb-1">Selected Package</p>
                       <p className="font-bold text-gray-900">{booking.serviceType || 'Standard Session'}</p>
                    </div>
                 </div>
              </Section>

              {/* Financials */}
              <Section icon={CreditCard} title="Financial Summary">
                 <div className="space-y-1">
                    <InfoRow label="Package Price" value={`$${booking.price?.toLocaleString() || '0.00'}`} icon={DollarSign} />
                    <InfoRow label="Platform Fee" value="$0.00" icon={ShieldCheck} />
                    <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center">
                       <span className="text-sm font-black text-gray-900 uppercase">Total Paid</span>
                       <span className="text-2xl font-black text-blue-600">${booking.price?.toLocaleString() || '0.00'}</span>
                    </div>
                 </div>
              </Section>
            </div>
          </div>

          {/* Notes */}
          {booking.description && (
            <Section icon={FileText} title="Special Instructions">
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "{booking.description}"
              </p>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 md:p-8 border-t border-gray-100 bg-white flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-gray-600 bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-all active:scale-95"
          >
            Close View
          </button>
          <button className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-white bg-gray-900 hover:bg-black transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-200 active:scale-95 text-sm md:text-base">
            <Download size={20} className="shrink-0" />
            <span className="truncate">Download Summary</span>
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
