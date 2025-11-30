'use client'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { theme } from '../../lib/theme'

const milestones = [
  {
    year: '2023',
    title: 'The Inception',
    description: 'Born from a desire to simplify the creative booking process, Lucis started as a small collective of photographers.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800'
  },
  {
    year: '2024',
    title: 'Rapid Expansion',
    description: 'We expanded to 50 major cities, connecting thousands of clients with top-tier creative talent.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800'
  },
  {
    year: 'Future',
    title: 'Global Vision',
    description: 'Our mission continues as we build the world\'s largest network of verified creative professionals.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
  }
]

export default function AboutStory() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section ref={containerRef} className="py-32 bg-neutral-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            The Thread of <span className="text-accent-500 italic font-serif">Time</span>
          </h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2 hidden md:block">
            <motion.div 
              style={{ height: lineHeight }}
              className="w-full bg-accent-500 origin-top"
            />
          </div>

          <div className="space-y-24 md:space-y-48">
            {milestones.map((item, index) => (
              <Milestone key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Milestone({ item, index }) {
  const isEven = index % 2 === 0
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}
    >
      {/* Content */}
      <div className={`flex-1 text-center ${isEven ? 'md:text-right' : 'md:text-left'}`}>
        <div className="text-accent-500 text-xl font-bold mb-2 tracking-widest">{item.year}</div>
        <h3 
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
        >
          {item.title}
        </h3>
        <p className="text-gray-400 text-lg leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Marker (Desktop) */}
      <div className="relative hidden md:flex items-center justify-center w-12">
        <div className="w-4 h-4 rounded-full bg-accent-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] z-10" />
      </div>

      {/* Image */}
      <div className="flex-1 w-full">
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        </div>
      </div>
    </motion.div>
  )
}
