'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { theme } from '../../../../lib/theme'
import { 
  Heart, 
  MapPin, 
  Star, 
  Search, 
  ArrowRight, 
  Camera, 
  Sparkles,
  Filter,
  Trash2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import favoriteService from '../../../../services/client/favoriteService'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [removingId, setRemovingId] = useState(null)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const data = await favoriteService.getFavorites()
      setFavorites(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch favorites:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (e, favId) => {
    e.preventDefault()
    setRemovingId(favId)
    try {
      await favoriteService.removeFavorite(favId)
      setFavorites(prev => prev.filter(f => f.id !== favId))
    } catch (err) {
      console.error('Failed to remove favorite:', err)
    } finally {
      setRemovingId(null)
    }
  }

  const filteredFavorites = favorites.filter(fav => {
    const prof = fav.data || fav.professional || {}
    const name = `${prof.firstName} ${prof.lastName}`.toLowerCase()
    return name.includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-accent-600 mb-4 bg-accent-50 w-fit px-4 py-1.5 rounded-full" style={{ color: theme.colors.accent[600], backgroundColor: theme.colors.accent[50] }}>
               <Sparkles size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">Curated Collection</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 tracking-tight" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
              My Favorites
            </h1>
            <p className="text-gray-500 mt-4 max-w-lg font-medium">
              A private collection of photographers who've captured your eye. Save them for your upcoming sessions.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search favorites..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-accent-50 focus:border-accent-100 outline-none transition-all w-full md:w-80 shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent-500 transition-colors" size={20} />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[2.5rem] h-96 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : filteredFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredFavorites.map((fav, idx) => {
                const prof = fav.data || fav.professional || {}
                const user = prof.user || {}
                return (
                  <motion.div
                    key={fav.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 relative"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                      <img 
                        src={prof.profilePicture?.url || user.profilePicture?.url || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=600"} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      
                      {/* Actions */}
                      <div className="absolute top-6 right-6 flex flex-col gap-3">
                        <button 
                          onClick={(e) => handleRemove(e, fav.id)}
                          disabled={removingId === fav.id}
                          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 hover:scale-110 transition-all shadow-xl border border-white/20"
                        >
                          {removingId === fav.id ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                      </div>

                      {/* Content Overlay */}
                      <div className="absolute bottom-8 left-8 right-8 text-white">
                        <div className="flex items-center gap-2 mb-2">
                           <div className="flex items-center gap-1 bg-accent-500/90 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                              <Star size={10} className="fill-current" />
                              {prof.rating || '5.0'}
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
                              {prof.specialty || 'Creative'}
                           </span>
                        </div>
                        <h3 className="text-2xl font-black mb-1 truncate" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                          {prof.firstName || user.firstName} {prof.lastName || user.lastName}
                        </h3>
                        <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-wider">
                           <MapPin size={12} />
                           {prof.location || 'Based nearby'}
                        </div>
                      </div>
                    </div>

                    <div className="p-8 flex items-center justify-between bg-white">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price Range</span>
                          <span className="text-xl font-black text-gray-900">₦{(prof.price || 0).toLocaleString()}<span className="text-xs text-gray-400 font-bold ml-1">/hr</span></span>
                       </div>
                       <Link 
                        href={`/client/search?pro=${prof.id}`}
                        className="px-6 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        style={{ backgroundColor: theme.colors.primary[900] }}
                       >
                         Book Now
                         <ArrowRight size={14} />
                       </Link>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm text-center px-6">
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-8 relative">
               <div className="absolute inset-0 bg-accent-500/5 rounded-full animate-ping" />
               <Heart size={40} className="text-gray-300" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
              Your Favorites is Empty
            </h3>
            <p className="text-gray-500 max-w-sm mb-10 font-medium leading-relaxed">
              When you find a photographer you love, click the heart icon to save them here for later.
            </p>
            <Link 
              href="/client/search"
              className="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:-translate-y-1 transition-all"
              style={{ backgroundColor: theme.colors.primary[900] }}
            >
              Explore Photographers
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
