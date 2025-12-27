'use client'
import { theme } from '../../lib/theme'
import { Star, Check } from 'lucide-react'

export default function SearchFilters({ filters, setFilters, showFilters }) {
  return (
    <div className={`w-full lg:w-80 flex-shrink-0 transition-all duration-300 ${showFilters ? 'block' : 'hidden lg:block'}`}>
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 space-y-6 sm:space-y-8 lg:sticky lg:top-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg sm:text-xl text-gray-900" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>Filters</h3>
          <button 
            onClick={() => setFilters({ services: [], radius: 50, dayOfWeek: '', limit: 20, active: [] })}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Reset
          </button>
        </div>

        {/* Services */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 px-1">Service Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3">
            {['Photography', 'Videography', 'Wedding', 'Portrait', 'Event', 'Corporate'].map(service => (
              <label key={service} className="flex items-center gap-2 sm:gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-xl transition-colors -mx-2">
                <div className="relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                  <input 
                    type="checkbox" 
                    className="peer appearance-none w-4 h-4 sm:w-5 sm:h-5 rounded-lg border-2 border-gray-300 checked:bg-gray-900 checked:border-gray-900 transition-all cursor-pointer"
                    checked={filters.services?.includes(service)}
                    onChange={(e) => {
                       const current = filters.services || [];
                       if (e.target.checked) {
                         setFilters({...filters, services: [...current, service]});
                       } else {
                         setFilters({...filters, services: current.filter(s => s !== service)});
                       }
                    }}
                  />
                  <Check size={10} strokeWidth={4} className="sm:w-3 sm:h-3 absolute text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors truncate">{service}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Search Radius */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4 px-1">
             <label className="text-xs sm:text-sm font-bold text-gray-900">Distance</label>
             <span className="text-xs sm:text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">{filters.radius} mi</span>
          </div>
          <div className="px-1">
            <input 
              type="range" 
              min="5" 
              max="100" 
              step="5" 
              value={filters.radius}
              onChange={(e) => setFilters({...filters, radius: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-gray-900 hover:accent-gray-800"
            />
            <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-gray-400 mt-2">
              <span>5 mi</span>
              <span>100 mi</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 px-1">Minimum Rating</label>
          <div className="space-y-2">
            {[5, 4, 3].map(rating => (
              <label key={rating} className="flex items-center gap-2 sm:gap-3 cursor-pointer group p-2 hover:bg-gray-50 rounded-xl transition-colors -mx-2">
                <div className="relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                   <input 
                      type="radio" 
                      name="rating" 
                      className="peer appearance-none w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300 checked:border-gray-900 checked:border-4 transition-all cursor-pointer" 
                    />
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={14} className="sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-xs sm:text-sm font-medium text-gray-400 ml-1 sm:ml-2 group-hover:text-gray-600">& up</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Day of Week */}
        <div>
          <label className="block text-xs sm:text-sm font-bold text-gray-900 mb-3 px-1">Availability</label>
          <div className="relative">
             <select 
              value={filters.dayOfWeek}
              onChange={(e) => setFilters({...filters, dayOfWeek: e.target.value})}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Any day</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
               <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
