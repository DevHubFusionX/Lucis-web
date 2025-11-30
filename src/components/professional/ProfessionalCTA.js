'use client'
import Link from 'next/link'
import { theme } from '../../lib/theme'
import { ArrowRight } from 'lucide-react'

export default function ProfessionalCTA() {
  return (
    <section className="py-32 bg-neutral-900 relative overflow-hidden flex items-center justify-center">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
      
      <div className="relative z-10 text-center px-4">
        <h2 
          className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tighter"
          style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
        >
          Ready to <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600">
            Make Your Mark?
          </span>
        </h2>
        
        <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
          Join the community that celebrates creativity and empowers success. Your next big opportunity is waiting.
        </p>

        <Link 
          href="/professional-signup"
          className="group inline-flex items-center gap-4 px-12 py-6 bg-white text-black rounded-full text-xl font-bold transition-all hover:scale-105 hover:bg-accent-500 hover:text-white"
        >
          Join the Network
          <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
        </Link>
      </div>
    </section>
  )
}
