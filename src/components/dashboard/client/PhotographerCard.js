import { Star, MapPin } from 'lucide-react'
import { theme } from '../../../lib/theme'

export default function PhotographerCard({ data, router, onViewProfile, onBookNow }) {
  const coverImg = data.coverImage?.url || "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  const profileImg = data.profilePicture?.url || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  
  // Handle location - can be string or object {longitude, latitude}
  const locationText = typeof data.location === 'object' ? data.baseCity || 'Nearby' : (data.location || 'Nearby')
  
  return (
    <div className="bg-white overflow-hidden shadow-sm border border-gray-50 hover:shadow-2xl hover:shadow-black/5 transition-all group">
      <div className="h-44 bg-gray-100 relative overflow-hidden">
        <img src={coverImg} alt="Cover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
      </div>
      <div className="px-8 pb-8 mt-[-3rem] relative z-10">
        <img 
          src={profileImg} 
          alt={data.firstName} 
          className="w-24 h-24 rounded-2xl object-cover shadow-xl mb-4" 
        />
        <h3 className="font-black text-gray-900 text-xl mb-1" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>{data.firstName} {data.lastName}</h3>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">{data.specialty || 'Creative Visionary'}</p>
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-1.5">
             <Star className="w-4 h-4 text-orange-400 fill-current" />
             <span className="font-black text-gray-900 text-sm">{data.rating || '5.0'}</span>
             <span className="text-gray-400 text-xs font-bold">({data.reviewCount || 120} reviews)</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-tight">
             <MapPin size={14} className="text-gray-300" />
             <span>{data.distance ? `${data.distance.toFixed(1)} mi` : locationText}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => onViewProfile ? onViewProfile(data) : router.push(`/client/search?id=${data.id}`)} 
            className="flex-1 py-4 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10"
          >
            View Profile
          </button>
          <button 
            onClick={() => onBookNow ? onBookNow(data) : router.push(`/client/search?id=${data.id}&book=true`)} 
            className="flex-1 py-4 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-orange-500/20"
            style={{ backgroundColor: theme.colors.accent[500] }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}
