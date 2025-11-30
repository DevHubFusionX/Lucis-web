'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { theme } from '../../lib/theme'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function AboutCTA() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100])

  return (
    <section ref={containerRef} className="relative py-32 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Floating Orbs with Parallax */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute top-20 left-10 w-64 h-64 bg-accent-500/10 rounded-full blur-[100px]" 
      />
      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric Split Layout */}
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          
          {/* Left: Large Statement (3 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Your Journey Starts Here</span>
            </div>

            <h2 
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[0.95] tracking-tight"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              Let's Create
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700 italic font-serif">
                Something
              </span>
              <br />
              Extraordinary
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed font-light">
              Whether you're seeking world-class talent or ready to showcase your craft, 
              Lucis is where vision meets opportunity.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">2.5K+</div>
                <div className="text-sm text-gray-600">Creators</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">50K+</div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">200+</div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Stacked CTAs (2 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Client CTA */}
            <Link href="/client/search" className="group block">
              <div className="relative p-8 rounded-3xl bg-white border-2 border-gray-200 hover:border-accent-500 transition-all duration-500 overflow-hidden hover:shadow-2xl">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium text-accent-600 mb-2 uppercase tracking-wider">For Clients</div>
                      <h3 
                        className="text-3xl font-bold text-gray-900 mb-2"
                        style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                      >
                        Find Talent
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center group-hover:bg-accent-500 transition-colors">
                      <ArrowRight className="w-5 h-5 text-accent-600 group-hover:text-white transition-colors group-hover:translate-x-1 duration-300" />
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Browse our curated network of world-class photographers and videographers.
                  </p>
                </div>
              </div>
            </Link>

            {/* Professional CTA */}
            <Link href="/professional-signup" className="group block">
              <div className="relative p-8 rounded-3xl bg-gray-900 border-2 border-gray-900 hover:border-accent-500 transition-all duration-500 overflow-hidden hover:shadow-2xl">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="text-sm font-medium text-accent-500 mb-2 uppercase tracking-wider">For Creators</div>
                      <h3 
                        className="text-3xl font-bold text-white mb-2"
                        style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                      >
                        Join the Network
                      </h3>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-accent-500 transition-colors">
                      <ArrowRight className="w-5 h-5 text-white transition-colors group-hover:translate-x-1 duration-300" />
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Showcase your work and connect with premium clients worldwide.
                  </p>
                </div>
              </div>
            </Link>

            {/* Subtle Encouragement */}
            <p className="text-center text-sm text-gray-500 pt-4">
              No credit card required • Join in under 2 minutes
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
