'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { theme } from '../../lib/theme'
import { useRef } from 'react'

export default function AboutHero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Parallax Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2000"
          alt="Visionary Landscape"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 max-w-5xl mx-auto px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-8 tracking-tighter mix-blend-difference"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            We Are <br />
            <span className="italic font-serif font-light text-accent-500">Lucis</span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Bridging the gap between visionary artists and those who seek to capture the extraordinary.
        </motion.p>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-[0.3em] uppercase"
      >
        Our Story
      </motion.div>
    </section>
  )
}
