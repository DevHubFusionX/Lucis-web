'use client'
import { motion } from 'framer-motion'
import { theme } from '../../lib/theme'
import { MessageCircle } from 'lucide-react'

export default function ContactHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      {/* Floating Orbs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-accent-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-8">
              <MessageCircle className="w-4 h-4" />
              <span>We're Here to Help</span>
            </div>

            <h1 
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-[0.95] tracking-tight"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              Let's Start a
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700 italic font-serif">
                Conversation
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light mb-8">
              Have questions? Need support? Want to partner with us? 
              We'd love to hear from you.
            </p>

            {/* Quick Stats */}
            <div className="flex gap-8 pt-6 border-t border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">&lt; 2 hrs</div>
                <div className="text-sm text-gray-600">Response Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Support Available</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Decorative Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative aspect-square">
              {/* Circular Pattern */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full rounded-full border-2 border-gray-200 animate-pulse" />
                <div className="absolute w-4/5 h-4/5 rounded-full border-2 border-accent-200" />
                <div className="absolute w-3/5 h-3/5 rounded-full border-2 border-accent-300" />
                <div className="absolute w-2/5 h-2/5 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
                  <MessageCircle className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
