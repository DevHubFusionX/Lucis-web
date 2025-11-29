'use client'

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
    <div className="lg:col-span-3 space-y-5">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium" style={{color: '#6B7280'}}>Finding nearby professionals...</span>
          </div>
        ) : (
          <p className="text-sm font-medium" style={{color: '#6B7280'}}>
            <span className="text-2xl font-bold" style={{color: '#111827'}}>{professionals.length}</span>
            <span className="ml-2">professionals found {location && 'near you'}</span>
          </p>
        )}
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex gap-1 p-1 rounded-lg" style={{backgroundColor: '#F3F4F6'}}>
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 rounded transition-all"
              style={{backgroundColor: viewMode === 'grid' ? '#FFFFFF' : 'transparent', color: viewMode === 'grid' ? '#1E3A8A' : '#6B7280'}}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-2 rounded transition-all"
              style={{backgroundColor: viewMode === 'list' ? '#FFFFFF' : 'transparent', color: viewMode === 'list' ? '#1E3A8A' : '#6B7280'}}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          {/* Sort */}
          <select className="px-4 py-2 rounded-xl border text-sm font-semibold shadow-sm" style={{borderColor: '#E5E7EB', backgroundColor: '#FFFFFF'}}>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl" style={{backgroundColor: '#F3F4F6'}}>
              <div className="aspect-[4/3] rounded-t-2xl" style={{backgroundColor: '#E5E7EB'}}></div>
              <div className="p-5 space-y-3">
                <div className="h-4 rounded" style={{backgroundColor: '#E5E7EB'}}></div>
                <div className="h-3 rounded w-3/4" style={{backgroundColor: '#E5E7EB'}}></div>
                <div className="h-3 rounded w-1/2" style={{backgroundColor: '#E5E7EB'}}></div>
              </div>
            </div>
          ))}
        </div>
      ) : professionals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed" style={{backgroundColor: '#F9FAFB', borderColor: '#E5E7EB'}}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{backgroundColor: '#DBEAFE'}}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#1E3A8A'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2" style={{color: '#111827'}}>No professionals found</h3>
          <p className="text-lg mb-6" style={{color: '#6B7280'}}>Try adjusting your filters or search criteria</p>
          <button className="px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all" style={{backgroundColor: '#1E3A8A', color: '#FFFFFF'}}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-5' : 'space-y-5'}>
          {(professionals || []).map(pro => (
            viewMode === 'grid' ? (
              // Grid View
              <div key={pro.id} className="group rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
                <div className="relative overflow-hidden">
                  <div className="w-full aspect-[4/3] flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300" style={{backgroundColor: '#F9FAFB'}}>
                    {pro.firstName?.charAt(0) || '📷'}
                  </div>
                  <span className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur-sm" style={{backgroundColor: 'rgba(209, 250, 229, 0.95)', color: '#10B981'}}>
                    ✓ Available
                  </span>
                  <button className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{backgroundColor: 'rgba(255, 255, 255, 0.95)'}}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#DC2626'}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-5">
                  <div className="mb-3">
                    <h3 className="text-lg font-bold mb-1.5" style={{color: '#111827'}}>{pro.firstName} {pro.lastName}</h3>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#9CA3AF'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm" style={{color: '#6B7280'}}>{pro.email}</span>
                      {pro.distance > 0 && <span className="text-xs font-semibold ml-1" style={{color: '#1E3A8A'}}>• {pro.distance.toFixed(1)} mi</span>}
                    </div>
                  </div>
                  <p className="text-sm mb-4" style={{color: '#6B7280'}}>Professional photographer</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold" style={{backgroundColor: '#EEF2FF', color: '#1E3A8A'}}>
                      Photography
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4" style={{borderTop: '1px solid #E5E7EB'}}>
                    <div>
                      <p className="text-xs font-medium mb-0.5" style={{color: '#9CA3AF'}}>Starting at</p>
                      <p className="text-sm font-medium" style={{color: '#1E3A8A'}}>
                        {pro.packages?.[0]?.price ? `$${pro.packages[0].price}` : 'Contact'}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleBookNow(pro)}
                      className="px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200" 
                      style={{backgroundColor: '#1E3A8A', color: '#FFFFFF'}}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // List View
              <div key={pro.id} className="flex gap-5 p-5 rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer" style={{backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB'}}>
                <div className="relative w-48 h-36 rounded-xl overflow-hidden flex-shrink-0" style={{backgroundColor: '#F9FAFB'}}>
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    {pro.image}
                  </div>
                  {pro.availability === 'Available' && (
                    <span className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-bold" style={{backgroundColor: '#D1FAE5', color: '#10B981'}}>
                      Available
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold mb-1" style={{color: '#111827'}}>{pro.firstName} {pro.lastName}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" style={{color: '#F59E0B'}}>
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-bold" style={{color: '#111827'}}>5.0</span>
                          <span className="text-sm" style={{color: '#6B7280'}}>(0 reviews)</span>
                        </div>
                        <span style={{color: '#D1D5DB'}}>•</span>
                        <span className="text-sm" style={{color: '#6B7280'}}>{pro.email}</span>
                        {pro.distance > 0 && (
                          <>
                            <span style={{color: '#D1D5DB'}}>•</span>
                            <span className="text-sm font-semibold" style={{color: '#1E3A8A'}}>{pro.distance.toFixed(1)} mi</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-10 transition-all" style={{backgroundColor: 'transparent'}}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{color: '#DC2626'}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm mb-3" style={{color: '#6B7280'}}>Professional photographer and videographer</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold" style={{backgroundColor: '#EEF2FF', color: '#1E3A8A'}}>
                      Photography
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-3" style={{borderTop: '1px solid #F3F4F6'}}>
                    <div>
                      <p className="text-xs font-medium" style={{color: '#9CA3AF'}}>Starting at</p>
                      <p className="text-2xl font-bold" style={{color: '#1E3A8A'}}>
                        {pro.packages?.[0]?.price ? `$${pro.packages[0].price}` : 'Contact'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleMessage(pro)}
                        className="px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md transition-all" 
                        style={{backgroundColor: '#F3F4F6', color: '#374151'}}
                      >
                        Message
                      </button>
                      <button 
                        onClick={() => handleBookNow(pro)}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all" 
                        style={{backgroundColor: '#1E3A8A', color: '#FFFFFF'}}
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
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all" style={{backgroundColor: '#F3F4F6', color: '#6B7280'}}>
          ← Previous
        </button>
        <button className="px-4 py-2.5 rounded-xl text-sm font-bold shadow-md" style={{backgroundColor: '#1E3A8A', color: '#FFFFFF'}}>
          1
        </button>
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all" style={{backgroundColor: '#F3F4F6', color: '#6B7280'}}>
          2
        </button>
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all" style={{backgroundColor: '#F3F4F6', color: '#6B7280'}}>
          3
        </button>
        <button className="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all" style={{backgroundColor: '#F3F4F6', color: '#6B7280'}}>
          Next →
        </button>
      </div>
    </div>
  )
}
