'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'

// Theme Import
import { theme } from '../../../lib/theme'
import { ClientBookingService, FavoriteService } from '../../../services/client'
import searchService from '../../../services/searchService'
import PhotographerInfoModal from '../../../components/PhotographerInfoModal'
import BookingModal from '../../../components/BookingModal'

// Modular Components
import DashboardHero from '../../../components/dashboard/client/DashboardHero'
import ActionCardsGrid from '../../../components/dashboard/client/ActionCardsGrid'
import FeaturedPhotographers from '../../../components/dashboard/client/FeaturedPhotographers'
import BookingHistory from '../../../components/dashboard/client/BookingHistory'
import UpcomingBookings from '../../../components/dashboard/client/UpcomingBookings'
import RecentBookingsSidebar from '../../../components/dashboard/client/RecentBookingsSidebar'
import MessagingWidget from '../../../components/dashboard/client/MessagingWidget'
// import DashboardSkeleton from '../../../components/dashboard/client/DashboardSkeleton'

export default function ClientDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    bookings: [],
    recentBookings: [],
    upcomingBookings: [],
    featured: [],
    stats: {
      totalSpent: 0,
      completed: 0,
      upcoming: 0,
      favoritesCount: 0
    }
  })

  // Modal state
  const [selectedPhotographer, setSelectedPhotographer] = useState(null)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Animation variants
  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Try to get location, fallback to NY like search page
        const loc = await new Promise((resolve) => {
          if (!navigator.geolocation) return resolve({ latitude: 40.7128, longitude: -74.0060 })
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
            () => resolve({ latitude: 40.7128, longitude: -74.0060 })
          )
        }).catch(() => ({ latitude: 40.7128, longitude: -74.0060 }))

        // Parallel fetching
        const [bookings, featured, favorites] = await Promise.all([
           ClientBookingService.getBookings().catch(() => []),
           searchService.discoverProfessionals(4, loc.latitude, loc.longitude, 50).catch(() => []),
           FavoriteService.getFavorites().catch(() => [])
        ])

        // Process Bookings
        const sortedBookings = Array.isArray(bookings) ? bookings.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)) : []
        const upcoming = sortedBookings.filter(b => ['pending', 'accepted', 'confirmed'].includes(b.status.toLowerCase())).slice(0, 3)
        const history = sortedBookings.filter(b => b.status.toLowerCase() === 'completed' || b.status.toLowerCase() === 'paid').slice(0, 5)
        
        // Calculate Stats
        const completed = sortedBookings.filter(b => b.status.toLowerCase() === 'completed')
        const totalSpent = completed.reduce((sum, b) => sum + (b.totalPrice || 0), 0)

        setData({
          bookings: sortedBookings,
          recentBookings: history,
          upcomingBookings: upcoming,
          featured: featured.slice(0, 4),
          stats: {
            totalSpent,
            completed: completed.length,
            upcoming: upcoming.length,
            favoritesCount: Array.isArray(favorites) ? favorites.length : 0
          }
        })
      } catch (error) {
        console.error('Dashboard data fetch failed:', error)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={stagger}
      className="pb-20"
    >
      {/* Hero Section */}
      <DashboardHero user={user} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-10">
          {/* Action Cards Grid */}
          <ActionCardsGrid data={data} loading={loading} />

          {/* Featured Photographers Carousel */}
          <FeaturedPhotographers 
            featured={data.featured}
            loading={loading}
            router={router}
            onViewProfile={(pro) => {
              setSelectedPhotographer(pro)
              setShowInfoModal(true)
            }}
            onBookNow={(pro) => {
              setSelectedPhotographer(pro)
              setShowBookingModal(true)
            }}
          />

          {/* Booking History (Main Area) */}
          <BookingHistory bookings={data.recentBookings} loading={loading} />
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Upcoming Bookings Sidebar Widget */}
          <UpcomingBookings bookings={data.upcomingBookings} loading={loading} />

          {/* Booking History Sidebar Widget */}
          <RecentBookingsSidebar bookings={data.recentBookings} loading={loading} />

          {/* Messages Sidebar Widget */}
          <MessagingWidget loading={loading} />
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showInfoModal && selectedPhotographer && (
          <PhotographerInfoModal
            photographer={selectedPhotographer}
            isOpen={showInfoModal}
            onClose={() => setShowInfoModal(false)}
            onBookNow={() => {
              setShowInfoModal(false)
              setShowBookingModal(true)
            }}
          />
        )}
        
        {showBookingModal && selectedPhotographer && (
          <BookingModal
            professional={selectedPhotographer}
            isOpen={showBookingModal}
            onClose={() => setShowBookingModal(false)}
            onSuccess={() => {
              setShowBookingModal(false)
              // Optionally refresh bookings
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
