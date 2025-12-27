import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { theme } from '../../../lib/theme'
import BookingStatusBadge from './BookingStatusBadge'

export default function BookingHistory({ bookings, loading }) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-40 mb-8"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-6 bg-gray-200 rounded-full w-24"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div variants={fadeIn} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-black text-gray-900 tracking-tight" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>Booking History</h2>
      </div>
      
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors">
               <div className="flex items-center gap-4">
                  <img 
                    src={booking.professional?.profilePicture?.url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    alt="Photographer"
                  />
                  <div>
                     <h4 className="font-bold text-gray-900">{booking.professional?.firstName} {booking.professional?.lastName}</h4>
                     <p className="text-xs text-gray-500 font-medium">{booking.packageType || 'Portrait Session'}</p>
                  </div>
               </div>
               <div className="text-sm font-bold text-gray-400">
                  {new Date(booking.startDateTime || booking.createdAt).toLocaleDateString()}
               </div>
               <div className="flex items-center gap-4">
                  <span className={`flex items-center gap-1.5`}>
                     <BookingStatusBadge status={booking.status} />
                     {booking.status.toLowerCase() === 'paid' && <CheckCircle size={10} className="text-green-600" />}
                  </span>
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-2xl">
             <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No history yet</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
