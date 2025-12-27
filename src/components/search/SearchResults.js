'use client'
import { theme } from '../../lib/theme'
import { Star, MapPin, Grid, List, Clock, Camera, Heart, MessageCircle } from 'lucide-react'

export default function SearchResults({ 
  loading, 
  professionals, 
  location, 
  viewMode, 
  setViewMode, 
  handleBookNow, 
  handleMessage 
}) {
  return (
    <div className="w-full space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex-1">
           {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{borderColor: theme.colors.primary[800]}}></div>
              <span className="text-sm font-medium text-gray-500">Discovering talent near you...</span>
            </div>
          ) : (
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-500">Found for you</p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-wrap items-baseline gap-2" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                {professionals.length} 
                <span className="text-base sm:text-lg font-medium text-gray-600 font-sans">
                  {professionals.length === 1 ? 'Professional' : 'Professionals'} {location && 'nearby'}
                </span>
              </h2>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* View Toggle */}
          <div className="flex gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
          {/* Sort */}
          <select 
            className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border text-xs sm:text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer" 
            style={{borderColor: theme.colors.gray[200], backgroundColor: theme.colors.white, color: theme.colors.gray[700]}}
          >
            <option>Most Relevant</option>
            <option>Highest Rated</option>
            <option>Lowest Price</option>
            <option>Highest Price</option>
            <option>Most Popular</option>
            <option>Nearest</option>
          </select>
        </div>
      </div>

      {/* Results Grid/List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-[2rem] h-[28rem] animate-pulse border border-gray-100 overflow-hidden">
              <div className="h-64 bg-gray-100"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                <div className="flex gap-2 pt-4">
                   <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
                   <div className="h-10 bg-gray-100 rounded-xl w-12"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : professionals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-[2.5rem] bg-white border border-gray-100 text-center px-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-blue-50">
            <Camera className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-3xl font-bold mb-3 text-gray-900" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>No matches found</h3>
          <p className="text-lg text-gray-500 mb-8 max-w-md">We couldn't find any professionals matching your specific criteria. Try adjusting your filters.</p>
          <button className="px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 transition-all bg-gray-900 text-white">
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6' : 'flex flex-col gap-4 sm:gap-6'}>
          {(professionals || []).map(pro => (
            viewMode === 'grid' ? (
              // Grid View Card
              <div key={pro.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  {pro.profilePicture?.url ? (
                    <img 
                      src={pro.profilePicture.url} 
                      alt={`${pro.firstName} ${pro.lastName}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <Camera size={48} className="text-gray-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate mb-1" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                        {pro.firstName} {pro.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="truncate">{pro.distance ? `${pro.distance.toFixed(1)} mi` : 'Nearby'}</span>
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-4 truncate">{pro.email}</p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleBookNow(pro); }}
                      className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-colors"
                    >
                      Book Now
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleMessage(pro); }}
                      className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <MessageCircle size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // List View Card
              <div key={pro.id} className="group bg-white rounded-2xl sm:rounded-[2rem] p-4 sm:p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="relative w-full sm:w-48 md:w-64 aspect-[16/9] sm:aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                   {pro.profilePicture?.url ? (
                    <img 
                      src={pro.profilePicture.url} 
                      alt={`${pro.firstName} ${pro.lastName}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                      <Camera size={32} className="sm:w-10 sm:h-10" />
                    </div>
                  )}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 py-1 rounded-lg text-xs font-bold bg-white/90 backdrop-blur-sm text-emerald-600 shadow-sm">
                     Available
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                        {pro.firstName} {pro.lastName}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin size={14} className="flex-shrink-0" />
                        <span className="truncate">{pro.distance ? `${pro.distance.toFixed(1)} miles away` : 'Nearby'}</span>
                      </p>
                    </div>
                    <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-all flex-shrink-0">
                      <Heart size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 truncate">
                    {pro.email}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-end pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                      <button 
                        onClick={() => handleMessage(pro)}
                        className="flex-1 sm:flex-none px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md transition-all" 
                        style={{backgroundColor: theme.colors.gray[100], color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ')}}
                      >
                        Message
                      </button>
                      <button 
                        onClick={() => handleBookNow(pro)}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all" 
                        style={{backgroundColor: theme.colors.primary[800], color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ')}}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all" style={{backgroundColor: theme.colors.gray[100], color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
          ← Previous
        </button>
        <button className="px-4 py-2.5 rounded-xl text-sm font-bold shadow-md" style={{backgroundColor: theme.colors.primary[800], color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
          1
        </button>
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all" style={{backgroundColor: theme.colors.gray[100], color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
          2
        </button>
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all" style={{backgroundColor: theme.colors.gray[100], color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
          3
        </button>
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all" style={{backgroundColor: theme.colors.gray[100], color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ')}}>
          Next →
        </button>
      </div>
    </div>
  )
}
