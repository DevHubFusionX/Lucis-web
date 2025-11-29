'use client'
import { useState, useEffect } from 'react'
import searchService from '../../../../services/searchService'
import BookingModal from '../../../../components/BookingModal'
import ContactModal from '../../../../components/ContactModal'
import SearchHeader from '../../../../components/search/SearchHeader'
import SearchFilters from '../../../../components/search/SearchFilters'
import SearchResults from '../../../../components/search/SearchResults'

export default function SearchPage() {
  const [searchState, setSearchState] = useState({
    query: '',
    loading: true,
    professionals: [],
    location: null
  })
  
  const [uiState, setUiState] = useState({
    viewMode: 'grid',
    showFilters: false,
    showBookingModal: false,
    showContactModal: false
  })
  
  const [filters, setFilters] = useState({
    services: [],
    radius: 50,
    dayOfWeek: '',
    limit: 20,
    active: []
  })
  
  const [selectedProfessional, setSelectedProfessional] = useState(null)

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.warn('Geolocation error:', error)
          // Fallback to default location (New York)
          resolve({
            latitude: 40.7128,
            longitude: -74.0060
          })
        }
      )
    })
  }

  const searchProfessionals = async () => {
    setSearchState(prev => ({ ...prev, loading: true }))
    try {
      const userLocation = searchState.location || await getCurrentLocation()
      if (!searchState.location) {
        setSearchState(prev => ({ ...prev, location: userLocation }))
      }
      
      const searchResults = await searchService.searchProfessionals({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        radius: filters.radius,
        dayOfWeek: filters.dayOfWeek,
        limit: filters.limit,
        _token: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      })
      setSearchState(prev => ({ ...prev, professionals: searchResults }))
    } catch (error) {
      console.error('Search failed:', error)
      setSearchState(prev => ({ ...prev, professionals: [] }))
    } finally {
      setSearchState(prev => ({ ...prev, loading: false }))
    }
  }

  useEffect(() => {
    searchProfessionals()
  }, [])

  useEffect(() => {
    if (searchState.location) {
      searchProfessionals()
    }
  }, [filters.radius, filters.dayOfWeek, filters.limit])

  const removeFilter = (filter) => {
    setFilters(prev => ({ ...prev, active: prev.active.filter(f => f !== filter) }))
  }

  const handleBookNow = (professional) => {
    setSelectedProfessional(professional)
    setUiState(prev => ({ ...prev, showBookingModal: true }))
  }

  const handleBookingSuccess = () => {
    try {
      // Refresh professionals or show success message
      console.log('Booking successful!')
      setUiState(prev => ({ ...prev, showBookingModal: false }))
    } catch (error) {
      console.error('Error handling booking success:', error)
    }
  }

  const handleMessage = (professional) => {
    setSelectedProfessional(professional)
    setUiState(prev => ({ ...prev, showContactModal: true }))
  }

  const { loading, professionals, location } = searchState
  const { viewMode, showBookingModal, showContactModal } = uiState

  return (
    <div className="space-y-6">
      {/* Search Bar - Primary Focus */}
      <SearchHeader 
        query={searchState.query}
        setQuery={(query) => setSearchState(prev => ({ ...prev, query }))}
        toggleFilters={() => setUiState(prev => ({ ...prev, showFilters: !prev.showFilters }))}
      />

      {/* Active Filters Tags */}
      {filters.active.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium" style={{color: '#6B7280'}}>Active filters:</span>
          {filters.active.map((filter, i) => (
            <span key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium" style={{backgroundColor: '#EEF2FF', color: '#1E3A8A'}}>
              {filter}
              <button onClick={() => removeFilter(filter)} className="hover:opacity-70">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
          <button className="text-sm font-semibold hover:underline" style={{color: '#DC2626'}}>Clear all</button>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <SearchFilters 
          filters={filters}
          setFilters={setFilters}
          showFilters={uiState.showFilters}
        />

        {/* Results Section */}
        <SearchResults 
          loading={loading}
          professionals={professionals}
          location={location}
          viewMode={viewMode}
          setViewMode={(mode) => setUiState(prev => ({ ...prev, viewMode: mode }))}
          handleBookNow={handleBookNow}
          handleMessage={handleMessage}
        />
      </div>

      {/* Booking Modal */}
      {selectedProfessional && (
        <BookingModal
          professional={selectedProfessional}
          isOpen={showBookingModal}
          onClose={() => {
            setUiState(prev => ({ ...prev, showBookingModal: false }))
            setSelectedProfessional(null)
          }}
          onSuccess={handleBookingSuccess}
        />
      )}

      {/* Contact Modal */}
      {selectedProfessional && (
        <ContactModal
          professional={selectedProfessional}
          isOpen={showContactModal}
          onClose={() => {
            setUiState(prev => ({ ...prev, showContactModal: false }))
            setSelectedProfessional(null)
          }}
        />
      )}
    </div>
  )
}
