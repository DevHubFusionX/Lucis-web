import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'
import { theme } from '../../../lib/theme'
import PhotographerCard from './PhotographerCard'

export default function FeaturedPhotographers({ featured, loading, router, onViewProfile, onBookNow }) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  if (loading) {
    return (
      <div>
        <div className="h-8 bg-gray-100 rounded w-48 mb-8 animate-pulse"></div>
        <div className="flex gap-4 overflow-hidden -mx-4 px-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-[280px] flex-shrink-0 bg-gray-50 rounded-[2.5rem] h-96 animate-pulse p-6 space-y-4">
               <div className="aspect-[4/5] bg-gray-200 rounded-3xl w-full"></div>
               <div className="h-6 bg-gray-200 rounded w-2/3"></div>
               <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div variants={fadeIn}>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>Featured Photographers</h2>
      </div>
      {featured.length > 0 ? (
        <div className="overflow-x-auto overflow-y-hidden -mx-4 px-4 pb-4">
          <div className="flex gap-4 min-w-max">
            {featured.map((photographer) => (
              <div key={photographer.id} className="w-[280px] flex-shrink-0">
                <PhotographerCard 
                  data={photographer} 
                  router={router}
                  onViewProfile={onViewProfile}
                  onBookNow={onBookNow}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
           <Camera size={40} className="mx-auto text-gray-300 mb-4" />
           <p className="text-gray-500 font-medium tracking-tight">No photographers found nearby at the moment.</p>
        </div>
      )}
    </motion.div>
  )
}
