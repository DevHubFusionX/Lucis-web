import { theme } from '../../../lib/theme'

export default function RecentBookingsSidebar({ bookings, loading }) {


  if (loading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-40 mb-8"></div>
        <div className="space-y-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="flex gap-3">
                <div className="flex-1 h-9 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 h-9 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
       <h2 className="text-xl font-black text-gray-900 tracking-tight mb-8" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>Booking History</h2>
       <div className="space-y-8">
          {bookings.slice(0, 2).map(booking => (
             <div key={booking.id} className="space-y-4">
                <div className="flex items-center justify-between text-sm">
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
                   <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Paid</span>
                </div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                   {new Date(booking.startDateTime || booking.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-3">
                   <button className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Leave Review</button>
                   <button className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest">View</button>
                </div>
             </div>
          ))}
          {bookings.length === 0 && (
            <p className="text-gray-400 text-center py-4 text-sm font-medium italic">No recent history</p>
          )}
       </div>
    </div>
  )
}
