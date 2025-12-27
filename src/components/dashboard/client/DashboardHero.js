import { motion } from 'framer-motion'
import { theme } from '../../../lib/theme'

export default function DashboardHero({ user, loading }) {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  if (loading) {
    return (
      <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-100 animate-pulse mb-10 h-[280px]">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200"></div>
        <div className="relative z-10 p-8 md:p-14 w-full h-full flex flex-col justify-center space-y-4">
           <div className="h-10 md:h-12 bg-gray-200 rounded-2xl w-2/3"></div>
           <div className="h-6 md:h-8 bg-gray-200 rounded-xl w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      variants={fadeIn}
      className="relative rounded-[2.5rem] overflow-hidden bg-white shadow-xl shadow-black/5 mb-10 h-[280px] group"
    >
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=90"
          alt="Hero Background"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
      </div>
      
      <div className="relative z-10 p-8 md:p-14 w-full h-full flex flex-col justify-center">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
          Welcome back, {user?.firstName || 'Sarah'}!
        </h1>
        <p className="text-white/90 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
          Find and book the perfect photographer for your next event
        </p>
      </div>
    </motion.div>
  )
}
