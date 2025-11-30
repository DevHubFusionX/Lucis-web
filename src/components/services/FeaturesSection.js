'use client'
import { useRef, useState } from 'react'
import { theme } from '../../lib/theme'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Layers, Clock } from 'lucide-react'

export default function FeaturesSection() {
  const features = [
    {
      title: 'Professional Quality',
      description: 'High-resolution imagery delivered with uncompromising attention to detail and color accuracy.',
      icon: ShieldCheck
    },
    {
      title: 'Quick Turnaround',
      description: 'Expedited editing and delivery workflows ensuring you get your content while it matters.',
      icon: Zap
    },
    {
      title: 'Custom Packages',
      description: 'Tailored photography solutions designed specifically to meet your unique requirements.',
      icon: Layers
    },
    {
      title: '24/7 Support',
      description: 'Dedicated support team ready to assist you at every stage of your creative journey.',
      icon: Clock
    }
  ]

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            Why Choose <span style={{ color: theme.colors.accent[500] }}>Us</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We combine artistic vision with technical excellence to deliver results that exceed expectations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature, index }) {
  const cardRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setOpacity(1)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  const Icon = feature.icon

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative group rounded-3xl border border-white/10 bg-white/5 p-8 overflow-hidden backdrop-blur-sm transition-colors hover:bg-white/10"
    >
      {/* Spotlight Gradient */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.1), transparent 40%)`
        }}
      />
      
      {/* Border Spotlight */}
       <div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${theme.colors.accent[500]}40, transparent 40%)`,
          maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px' // Border width
        }}
      />

      <div className="relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-accent-500/20 flex items-center justify-center mb-6 text-accent-500 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6" />
        </div>
        
        <h3
          className="text-xl font-bold text-white mb-3"
          style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
        >
          {feature.title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
          {feature.description}
        </p>
      </div>
    </motion.div>
  )
}
