import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import { theme } from '../../../lib/theme'
import { useRouter } from 'next/navigation'

export default function UpcomingBookings({ bookings, loading }) {
  const router = useRouter()
  
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-48 mb-8"></div>
        <div className="space-y-8">
          {[...Array(1)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="flex gap-3">
                <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 h-10 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div variants={fadeIn} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
       <h2 className="text-xl font-black text-gray-900 tracking-tight mb-8" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>Upcoming Bookings</h2>
       <div className="space-y-8">
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <div key={booking.id} className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <img 
                        src={booking.professional?.profilePicture?.url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"}
                        className="w-10 h-10 rounded-full object-cover"
                        alt="Photographer"
                       />
                       <div>
                          <h4 className="font-bold text-gray-900 text-sm">{booking.professional?.firstName} {booking.professional?.lastName}</h4>
                          <p className="text-xs text-gray-500 font-medium">{booking.packageType}</p>
                       </div>
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      Confirmed
                    </span>
                 </div>
                 <div className="text-xs text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} />
                    {new Date(booking.startDateTime).toLocaleDateString()} | {
                      (booking.address || (!booking.location?.includes('POINT') ? booking.location : null) || 'Online/TBD')
                    }
                 </div>
                 <div className="flex gap-3">
                    <button 
                      onClick={() => router.push('/client/bookings')}
                      className="flex-1 py-3 bg-gray-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-black/10 hover:scale-105 transition-all"
                    >
                      View Details
                    </button>
                    <button 
                      onClick={() => router.push('/client/messages')}
                      className="flex-1 py-3 bg-white border border-gray-200 text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                      Message
                    </button>
                 </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8 text-sm font-medium italic">No upcoming sessions</p>
          )}
       </div>
    </motion.div>
  )
}
