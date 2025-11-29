'use client'
import { theme } from '../../lib/theme'

export default function SearchFilters({ filters, setFilters, showFilters }) {
  return (
    <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
      <div className="p-5 rounded-2xl shadow-sm space-y-6 sticky top-6" style={{backgroundColor: theme.colors.white, border: `1px solid ${theme.colors.gray[200]}`}}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg" style={{color: theme.colors.neutral.deepGray, fontFamily: theme.typography.fontFamily.display.join(', ')}}>Filters</h3>
          <button className="text-sm font-semibold hover:underline" style={{color: theme.colors.primary[800], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Reset</button>
        </div>

        {/* Services */}
        <div>
          <label className="block text-sm font-bold mb-3" style={{color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Services</label>
          <div className="space-y-2">
            {['Photography', 'Videography', 'Wedding', 'Portrait', 'Event', 'Corporate'].map(service => (
              <label key={service} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded w-4 h-4" style={{color: theme.colors.primary[800]}} />
                <span className="text-sm group-hover:font-medium transition-all" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>{service}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Search Radius */}
        <div>
          <label className="block text-sm font-bold mb-3" style={{color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Search Radius</label>
          <div className="space-y-3">
            <input 
              type="range" 
              min="5" 
              max="100" 
              step="5" 
              value={filters.radius}
              onChange={(e) => setFilters({...filters, radius: parseInt(e.target.value)})}
              className="w-full" 
              style={{accentColor: theme.colors.primary[800]}} 
            />
            <div className="flex items-center justify-between text-sm font-medium" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
              <span>5 mi</span>
              <span className="font-bold" style={{color: theme.colors.primary[800]}}>{filters.radius} mi</span>
              <span>100 mi</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-bold mb-3" style={{color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Minimum Rating</label>
          <div className="space-y-2">
            {[5, 4, 3].map(rating => (
              <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="rating" className="w-4 h-4" style={{accentColor: theme.colors.primary[800]}} />
                <div className="flex items-center gap-1">
                  {[...Array(rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: theme.colors.accent[500]}}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-sm ml-1" style={{color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>& up</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Day of Week */}
        <div>
          <label className="block text-sm font-bold mb-3" style={{color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>Availability</label>
          <select 
            value={filters.dayOfWeek}
            onChange={(e) => setFilters({...filters, dayOfWeek: e.target.value})}
            className="w-full px-3 py-2 rounded-lg border text-sm" 
            style={{borderColor: theme.colors.gray[200], fontFamily: theme.typography.fontFamily.sans.join(', ')}}
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
        </div>
      </div>
    </div>
  )
}
