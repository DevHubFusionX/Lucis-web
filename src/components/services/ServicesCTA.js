'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { theme } from '../../lib/theme'
import { ArrowRight, Camera, Search } from 'lucide-react'

export default function ServicesCTA() {
  const [hoveredSide, setHoveredSide] = useState(null)

  return (
    <section className="relative h-[80vh] flex flex-col md:flex-row bg-black overflow-hidden">
      
      {/* Left Side - Find Talent */}
      <motion.div 
        className="relative flex-1 overflow-hidden group border-b md:border-b-0 md:border-r border-white/10"
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
        animate={{ 
          flex: hoveredSide === 'left' ? 2 : hoveredSide === 'right' ? 1 : 1 
        }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      >
        <Link href="/client/search" className="absolute inset-0 z-20" aria-label="Find a Photographer" />
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500 z-10" />
           <motion.img 
            src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1200" 
            alt="Find Photographer" 
            className="w-full h-full object-cover"
            animate={{ 
              scale: hoveredSide === 'left' ? 1.1 : 1, 
              filter: hoveredSide === 'left' ? 'grayscale(0%)' : 'grayscale(100%)' 
            }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-8 pointer-events-none">
          <div className="mb-6 p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white group-hover:scale-110 transition-transform duration-500">
            <Search className="w-8 h-8" />
          </div>
          <h2 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            Find Talent
          </h2>
          <p className="text-lg text-gray-300 max-w-md opacity-80 group-hover:opacity-100 transition-opacity">
            Discover world-class photographers for your next project.
          </p>
          
          <div className="mt-8 flex items-center gap-2 text-white font-semibold uppercase tracking-widest opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <span>Start Search</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </motion.div>

      {/* Right Side - Join as Pro */}
      <motion.div 
        className="relative flex-1 overflow-hidden group"
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
        animate={{ 
          flex: hoveredSide === 'right' ? 2 : hoveredSide === 'left' ? 1 : 1 
        }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      >
        <Link href="/professional-signup" className="absolute inset-0 z-20" aria-label="Join as Professional" />
        
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500 z-10" />
           <motion.img 
            src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&q=80&w=1200" 
            alt="Join as Professional" 
            className="w-full h-full object-cover"
            animate={{ 
              scale: hoveredSide === 'right' ? 1.1 : 1, 
              filter: hoveredSide === 'right' ? 'grayscale(0%)' : 'grayscale(100%)' 
            }}
            transition={{ duration: 0.8 }}
          />
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-8 pointer-events-none">
          <div 
            className="mb-6 p-4 rounded-full backdrop-blur-md border transition-transform duration-500 group-hover:scale-110"
            style={{ 
              backgroundColor: `${theme.colors.accent[500]}20`,
              borderColor: `${theme.colors.accent[500]}50`,
              color: theme.colors.accent[500]
            }}
          >
            <Camera className="w-8 h-8" />
          </div>
          <h2 
            className="text-4xl md:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            Join as Pro
          </h2>
          <p className="text-lg text-gray-300 max-w-md opacity-80 group-hover:opacity-100 transition-opacity">
            Showcase your work and connect with premium clients.
          </p>

          <div 
            className="mt-8 flex items-center gap-2 font-semibold uppercase tracking-widest opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
            style={{ color: theme.colors.accent[500] }}
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </motion.div>

    </section>
  )
}
