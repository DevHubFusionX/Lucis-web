'use client'
import { theme } from '../lib/theme'

const STATUS_CONFIG = {
  confirmed: { bg: '#D1FAE5', color: '#10B981', label: 'Confirmed' },
  upcoming: { bg: theme.colors.primary[100], color: theme.colors.primary[800], label: 'Upcoming' },
  completed: { bg: theme.colors.gray[100], color: theme.colors.gray[600], label: 'Completed' },
  cancelled: { bg: '#FEE2E2', color: '#DC2626', label: 'Cancelled' }
}

const getStatusConfig = (status) => STATUS_CONFIG[status] || { bg: theme.colors.gray[100], color: theme.colors.gray[600], label: status || 'Unknown' }

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{label}</span>
    <span className="font-semibold" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{value}</span>
  </div>
)

const DetailBox = ({ label, value }) => (
  <div className="p-4 rounded-xl border" style={{borderColor: theme.colors.gray[200]}}>
    <p className="text-sm font-medium mb-1" style={{color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{label}</p>
    <p className="font-bold" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{value}</p>
  </div>
)

export default function BookingDetailsModal({ booking, isOpen, onClose }) {
  if (!isOpen || !booking) return null

  const status = getStatusConfig(booking.status)
  const startDate = new Date(booking.startDateTime)
  const endDate = new Date(booking.endDateTime)
  const duration = Math.round((endDate - startDate) / 60000)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{backgroundColor: 'rgba(0, 0, 0, 0.6)'}}>
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" style={{backgroundColor: theme.colors.white}}>
        <div className="flex items-center justify-between mb-6 pb-6" style={{borderBottom: `1px solid ${theme.colors.gray[200]}`}}>
          <div>
            <h2 className="text-2xl font-bold mb-2" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>
              Booking Details
            </h2>
            <p className="text-sm" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
              ID: {booking.id}
            </p>
          </div>
          <button onClick={onClose} className="hover:opacity-70 transition-opacity" style={{color: theme.colors.gray[400]}}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl" style={{backgroundColor: theme.colors.gray[50]}}>
            <span className="font-semibold" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Status</span>
            <span className="px-3 py-1.5 rounded-lg text-sm font-bold" style={{backgroundColor: status.bg, color: status.color, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
              {status.label}
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>Professional</h3>
            <div className="flex items-center gap-4 p-4 rounded-xl border" style={{borderColor: theme.colors.gray[200]}}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{backgroundColor: theme.colors.gray[100]}}>
                {booking.professional?.firstName?.charAt(0) || '📷'}
              </div>
              <div>
                <h4 className="font-bold text-lg" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
                  {booking.professional?.firstName} {booking.professional?.lastName}
                </h4>
                <p className="text-sm" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
                  {booking.professional?.email}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>Schedule</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailBox label="Start Time" value={startDate.toLocaleString()} />
              <DetailBox label="End Time" value={endDate.toLocaleString()} />
              <DetailBox label="Duration" value={`${duration} minutes`} />
              <DetailBox label="Date" value={startDate.toLocaleDateString()} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>Payment</h3>
            <div className="p-4 rounded-xl border space-y-3" style={{borderColor: theme.colors.gray[200]}}>
              <DetailRow label="Total Amount" value={`$${booking.totalPrice || 0}`} />
              <DetailRow label="Payment Status" value={booking.paymentStatus || 'Pending'} />
              {booking.description && (
                <div className="pt-3" style={{borderTop: `1px solid ${theme.colors.gray[100]}`}}>
                  <p className="text-sm font-medium mb-2" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Description</p>
                  <p style={{color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{booking.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 flex justify-end gap-3" style={{borderTop: `1px solid ${theme.colors.gray[200]}`}}>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-semibold transition-all"
            style={{backgroundColor: theme.colors.gray[100], color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ')}}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
