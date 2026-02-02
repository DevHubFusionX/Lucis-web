import { Star, MapPin, Camera, Calendar } from 'lucide-react'
import { theme } from '../../../lib/theme'
import { getProfileImage, getCoverImage, getDisplayName, getSpecialty, getLocation } from '../../../lib/avatarHelper'

export default function PhotographerCard({ data, router, onViewProfile, onBookNow }) {
  const coverImg = getCoverImage(data)
  const profileImg = getProfileImage(data)
  const name = getDisplayName(data)
  const specialty = getSpecialty(data)
  const location = getLocation(data)

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 group">
      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <img
          src={coverImg}
          alt="Cover"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Specialty Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm"
            style={{ color: theme.colors.primary[700] }}
          >
            {specialty}
          </span>
        </div>
      </div>

      {/* Profile Section */}
      <div className="px-5 pb-5 -mt-10 relative z-10">
        {/* Profile Picture */}
        <img
          src={profileImg}
          alt={name}
          className="w-20 h-20 rounded-xl object-cover shadow-lg border-4 border-white mb-3"
        />

        {/* Name & Rating */}
        <div className="flex items-start justify-between mb-2">
          <h3
            className="font-bold text-gray-900 text-lg leading-tight line-clamp-1"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            {name}
          </h3>
          {data.rating && (
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <Star className="w-4 h-4 fill-current" style={{ color: theme.colors.accent[500] }} />
              <span className="font-bold text-gray-900 text-sm">{data.rating}</span>
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin size={12} className="text-gray-400" />
            <span className="truncate">{location}</span>
          </div>
          {data.completedBookings > 0 && (
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-gray-400" />
              <span>{data.completedBookings} shoots</span>
            </div>
          )}
        </div>

        {/* Bio Preview */}
        {data.bio && (
          <p className="text-xs text-gray-500 line-clamp-2 mb-4">{data.bio}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewProfile ? onViewProfile(data) : router.push(`/client/search?id=${data.id}`)}
            className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Profile
          </button>
          <button
            onClick={() => onBookNow ? onBookNow(data) : router.push(`/client/search?id=${data.id}&book=true`)}
            className="flex-1 py-2.5 text-white text-xs font-bold rounded-lg shadow-md hover:opacity-90 transition-all"
            style={{ backgroundColor: theme.colors.accent[500] }}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  )
}
