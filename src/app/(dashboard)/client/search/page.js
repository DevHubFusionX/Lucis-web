'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, MapPin, SlidersHorizontal, Star,
  X, Check, Heart, Camera,
  ArrowRight

} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import searchService from '../../../../services/search/searchService'
import favoriteService from '../../../../services/client/favoriteService'
import BookingModal from '../../../../components/BookingModal'
import PhotographerInfoModal from '../../../../components/PhotographerInfoModal'
import ContactModal from '../../../../components/ContactModal'



// Theme Import
import { theme } from '../../../../lib/theme'

// Premium filter component
const FilterSection = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>{title}</h3>
    {children}
  </div>
)

const CheckboxFilter = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group py-2">
    <div
      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? 'border-transparent' : 'border-gray-300 group-hover:border-gray-400 bg-white'}`}
      style={checked ? { backgroundColor: theme.colors.accent[500] } : {}}
    >
      <Check size={12} className={`text-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`} strokeWidth={4} />
    </div>
    <span className={`text-sm font-medium transition-colors ${checked ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'}`}>{label}</span>
  </label>
)

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    services: [],
    radius: 50,
    priceRange: [0, 1000],
    rating: null
  })
  const [location, setLocation] = useState(null)
  const [favoritingId, setFavoritingId] = useState(null)

  // Modals state
  const [selectedPro, setSelectedPro] = useState(null)
  const [modalState, setModalState] = useState({
    info: false,
    booking: false,
    contact: false
  })

  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Fetch location initially
  useEffect(() => {
    const getLoc = async () => {
      try {
        const coords = await new Promise((resolve) => {
          if (!navigator.geolocation) return resolve({ latitude: 40.7128, longitude: -74.0060 })
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            () => resolve({ latitude: 40.7128, longitude: -74.0060 })
          )
        })
        setLocation(coords)
      } catch (err) {
        setLocation({ latitude: 40.7128, longitude: -74.0060 })
      }
    }
    getLoc()
  }, [])

  // TanStack Query for Professionals
  const { data: professionals = [], isLoading: searchLoading, refetch } = useQuery({
    queryKey: ['professionals-search', location, filters.radius],
    queryFn: () => {
      console.log('[SearchPage] Fetching professionals with:', {
        lat: location?.latitude,
        lng: location?.longitude,
        radius: filters.radius
      })
      return location ? searchService.searchProfessionals({
        latitude: location.latitude,
        longitude: location.longitude,
        radius: filters.radius,
        limit: 20
      }) : []
    },
    enabled: !!location,
    staleTime: 2 * 60 * 1000
  })

  // Log professionals data
  useEffect(() => {
    console.log('[SearchPage] Professionals results received:', professionals)
  }, [professionals])

  useEffect(() => {
    console.log('[SearchPage] Geolocation state:', location)
  }, [location])


  // TanStack Query for Favorites
  const { data: favorites = [], refetch: refetchFavorites } = useQuery({
    queryKey: ['client-favorites'],
    queryFn: () => favoriteService.getFavorites(),
    staleTime: 5 * 60 * 1000
  })

  // Filter logic on the client side
  const displayedProfessionals = (Array.isArray(professionals) ? professionals : []).filter(p => {
    const q = searchQuery.toLowerCase()
    const matchesName = !searchQuery ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      p.specialty?.toLowerCase().includes(q)

    const matchesService = filters.services.length === 0 ||
      filters.services.some(s => p.specialty?.toLowerCase().includes(s.toLowerCase()))

    const matchesRating = !filters.rating || (p.rating || 5) >= filters.rating

    return matchesName && matchesService && matchesRating
  })

  // Use location as the gate for initial loading
  const loading = (searchLoading || !location)




  // Interaction Handlers
  const toggleFavorite = async (e, proId) => {
    e.stopPropagation()
    if (favoritingId) return

    setFavoritingId(proId)
    try {
      const favArray = Array.isArray(favorites) ? favorites : []
      const existingFavorite = favArray.find(f => f.professionalId === proId)

      if (existingFavorite) {
        await favoriteService.removeFavorite(existingFavorite.id)
      } else {
        await favoriteService.addFavorite(proId)
      }
      refetchFavorites()
    } catch (err) {
      console.error('Toggle favorite failed:', err)
    } finally {
      setFavoritingId(null)
    }
  }

  const openProfile = async (pro) => {
    setSelectedPro(pro)
    setModalState(prev => ({ ...prev, info: true }))
    // Info modal handles its own details fetch
  }


  return (
    <div className="flex flex-col md:flex-row font-sans" style={{ fontFamily: theme.typography.fontFamily.sans.join(', ') }}>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden sticky top-4 z-50 px-4 pt-4">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="w-full text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center justify-center gap-2 min-h-[48px] active:scale-95 transition-transform"
          style={{ backgroundColor: theme.colors.primary[900] }}
        >
          <SlidersHorizontal size={20} />
          <span className="text-base">Filters</span>
        </button>
      </div>

      {/* Mobile Backdrop for Filters */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileFilters(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Filters */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-full sm:w-80 bg-white border-r border-gray-100 transform transition-transform duration-300 md:translate-x-0 md:relative md:block ${showMobileFilters ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full overflow-y-auto p-8">
          <div className="flex items-center justify-between mb-8 md:hidden">
            <h2 className="text-xl font-bold" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>Filters</h2>
            <button onClick={() => setShowMobileFilters(false)}><X /></button>
          </div>

          <div className="space-y-8">
            <FilterSection title="Service Type">
              {['Wedding', 'Portrait', 'Event', 'Fashion', 'Product', 'Real Estate'].map(service => (
                <CheckboxFilter
                  key={service}
                  label={service}
                  checked={filters.services.includes(service)}
                  onChange={() => {
                    setFilters(prev => ({
                      ...prev,
                      services: prev.services.includes(service)
                        ? prev.services.filter(s => s !== service)
                        : [...prev.services, service]
                    }))
                  }}
                />
              ))}
            </FilterSection>

            <FilterSection title="Distance">
              <div className="px-2">
                <input
                  type="range"
                  min="5" max="100" step="5"
                  value={filters.radius}
                  onChange={(e) => setFilters(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{ accentColor: theme.colors.primary[900] }}
                />
                <div className="flex justify-between mt-2 text-xs font-bold text-gray-400">
                  <span>5 mi</span>
                  <span>{filters.radius} mi</span>
                  <span>100 mi</span>
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Rating">
              {[5, 4, 3].map(rating => (
                <label key={rating} className="flex items-center gap-3 cursor-pointer group py-2">
                  <input
                    type="radio"
                    name="rating"
                    className="appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-[6px] transition-all"
                    style={{ borderColor: filters.rating === rating ? theme.colors.accent[500] : undefined }}
                    onChange={() => setFilters(prev => ({ ...prev, rating }))}
                    checked={filters.rating === rating}
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-current" style={{ color: theme.colors.accent[500] }} />
                    ))}
                    <span className="text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">& Up</span>
                  </div>
                </label>
              ))}
            </FilterSection>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-100">
            <button
              onClick={() => {
                refetch()
                setShowMobileFilters(false)
              }}

              disabled={loading}
              className="w-full text-white py-4 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: theme.colors.primary[900] }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Applying...
                </>
              ) : (
                'Apply Filters'
              )}
            </button>
            <button
              onClick={() => {
                setFilters({ services: [], radius: 50, priceRange: [0, 1000], rating: null })
                setShowMobileFilters(false)
              }}
              className="w-full text-center py-3 text-sm font-bold text-gray-500 hover:text-gray-900 mt-2"
            >
              Reset All
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto md:pb-10">

          {/* Header Search */}
          <div className="flex flex-col gap-3 mb-6 sm:mb-8 md:mb-10">
            <div className="bg-white p-4 sm:p-3 rounded-2xl shadow-sm border border-gray-200 transition-shadow focus-within:shadow-md focus-within:border-gray-300">
              <div className="flex items-center gap-3 mb-3 sm:mb-0">
                <div className="text-gray-400"><Search size={20} /></div>
                <input
                  type="text"
                  placeholder="Search photographers..."
                  className="flex-1 bg-transparent py-2 sm:py-3 outline-none text-base text-gray-900 font-medium placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && refetch()}

                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-gray-100 sm:border-t-0 sm:pt-0">
                <MapPin size={18} className="text-gray-400 shrink-0" />
                <span className="text-sm font-medium text-gray-600 truncate flex-1">
                  {location ? 'Current Location' : 'New York, NY'}
                </span>
                <button
                  onClick={() => refetch()}

                  disabled={loading}
                  className="text-white px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap min-h-[44px] active:scale-95"
                  style={{ backgroundColor: theme.colors.accent[500] }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    'Search'
                  )}
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col gap-5 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl sm:rounded-3xl h-auto md:h-64 flex flex-col md:flex-row overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-56 md:h-full md:w-80 bg-gray-200 shrink-0"></div>
                  <div className="flex-1 p-5 md:p-6 flex flex-col justify-center space-y-4">
                    <div className="flex justify-between">
                      <div className="space-y-2 w-1/2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-7 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="flex gap-3 pt-4 mt-auto">
                      <div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
                      <div className="h-12 bg-gray-200 rounded-xl flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedProfessionals.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                <Camera size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>No professionals found</h2>
              <p className="text-gray-500">Try adjusting your filters or search radius.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-5 md:space-y-6">
              {displayedProfessionals.map((pro) => (

                <motion.div
                  key={pro.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
                >
                  {/* Cover Image Area */}
                  <div className="relative h-56 md:h-auto md:w-80 shrink-0 bg-gray-200 overflow-hidden">
                    <img
                      src={pro.coverImage?.url || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"}
                      alt="Cover"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-black/40"></div>

                    {/* Mobile Rating Badge */}
                    <div className="absolute bottom-4 left-4 md:hidden">
                      <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-sm font-bold">
                        <Star size={14} className="fill-white" />
                        {pro.rating || '5.0'}
                      </div>
                    </div>

                    <button
                      onClick={(e) => toggleFavorite(e, pro.id)}
                      disabled={favoritingId === pro.id}
                      className={`absolute top-4 right-4 p-2.5 backdrop-blur-md rounded-full transition-all active:scale-90 min-h-[44px] min-w-[44px] flex items-center justify-center ${(Array.isArray(favorites) ? favorites : []).some(f => f.professionalId === pro.id)
                        ? 'bg-white text-red-500 shadow-md'
                        : 'bg-white/10 text-white hover:bg-white hover:text-red-500'
                        }`}

                    >
                      {favoritingId === pro.id ? (
                        <div className="w-5 h-5 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin"></div>
                      ) : (
                        <Heart
                          size={20}
                          fill={(Array.isArray(favorites) ? favorites : []).some(f => f.professionalId === pro.id) ? "currentColor" : "none"}
                        />
                      )}
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="flex-1 p-5 md:p-6 lg:p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: theme.colors.primary[600] }}>
                          {pro.specialty || 'Photographer'}
                        </p>
                        <h3 className="text-gray-900 text-xl md:text-2xl font-bold leading-tight truncate" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                          {pro.firstName} {pro.lastName}
                        </h3>
                      </div>
                      <div
                        className="hidden md:flex items-center gap-1.5 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm ml-3 shrink-0"
                        style={{ backgroundColor: theme.colors.accent[500] }}
                      >
                        <Star size={14} className="fill-white" />
                        {pro.rating || '5.0'}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 mb-5 md:mb-6 text-sm text-gray-500 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={16} className="text-gray-400" />
                        <span className="truncate">{pro.distance ? `${pro.distance.toFixed(1)} mi` : 'Nearby'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check size={16} style={{ color: theme.colors.accent[500] }} />
                        <span>{pro.completedBookings || 0} Bookings</span>
                      </div>
                    </div>

                    <div className="flex-1"></div>

                    <div className="grid grid-cols-2 gap-3 md:flex md:justify-end md:gap-4 mt-4 pt-4 md:pt-6 border-t border-gray-100">
                      <button
                        onClick={() => openProfile(pro)}
                        className="py-3 px-4 md:px-6 rounded-xl font-bold text-sm bg-gray-50 text-gray-900 hover:bg-gray-100 transition-all active:scale-95 min-h-[48px]"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPro(pro)
                          setModalState(prev => ({ ...prev, booking: true }))
                        }}
                        className="py-3 px-4 md:px-8 rounded-xl font-bold text-sm text-white hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-gray-200 min-h-[48px]"
                        style={{ backgroundColor: theme.colors.primary[900] }}
                      >
                        Book Now
                        <ArrowRight size={16} className="hidden sm:block" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {modalState.info && selectedPro && (
          <PhotographerInfoModal
            photographer={selectedPro}
            isOpen={modalState.info}
            onClose={() => setModalState(prev => ({ ...prev, info: false }))}
            onBookNow={() => setModalState(prev => ({ ...prev, info: false, booking: true }))}
          />
        )}

        {modalState.booking && selectedPro && (
          <BookingModal
            professional={selectedPro}
            isOpen={modalState.booking}
            onClose={() => setModalState(prev => ({ ...prev, booking: false }))}
            onSuccess={() => console.log('Booking success')}
          />
        )}

        {modalState.contact && selectedPro && (
          <ContactModal
            professional={selectedPro}
            isOpen={modalState.contact}
            onClose={() => setModalState(prev => ({ ...prev, contact: false }))}
          />
        )}
      </AnimatePresence>

    </div>
  )
}
