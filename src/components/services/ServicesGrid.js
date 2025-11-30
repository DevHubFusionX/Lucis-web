'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { theme } from '../../lib/theme'
import { ArrowRight } from 'lucide-react'

export default function ServicesGrid() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  const x = useTransform(scrollYProgress, [0, 1], ['1%', '-75%'])

  const services = [
    {
      id: 1,
      title: 'Portrait Photography',
      description: 'Capture your essence with professional headshots and artistic portraits. We focus on lighting, composition, and your unique personality.',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 2,
      title: 'Wedding Photography',
      description: 'Your special day deserves cinematic storytelling. We document every emotion, every detail, and every unforgettable moment.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 3,
      title: 'Event Coverage',
      description: 'From corporate galas to private parties, we provide comprehensive coverage that captures the energy and atmosphere of your event.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 4,
      title: 'Product Photography',
      description: 'Elevate your brand with high-end product photography. Crisp, clean, and creative images that showcase your products at their best.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 5,
      title: 'Real Estate',
      description: 'Stunning architectural and interior photography that helps properties sell faster and look their absolute best.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 6,
      title: 'Video Production',
      description: 'Cinematic video production for commercials, events, and brand storytelling. We bring your vision to life in motion.',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=800'
    }
  ]

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* Section Title Overlay */}
        <div className="absolute top-8 left-8 z-20 md:top-12 md:left-12">
           <h2 
             className="text-4xl md:text-6xl font-bold text-white opacity-20"
             style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
           >
             Gallery
           </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-8 px-8 md:gap-16 md:px-16">
          {/* Intro Card */}
          <div className="relative h-[70vh] w-[80vw] md:w-[30vw] flex-shrink-0 flex flex-col justify-center">
             <h2 
               className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
               style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
             >
               Curated <br />
               <span style={{ color: theme.colors.accent[500] }}>Services</span>
             </h2>
             <p className="text-xl text-gray-400 max-w-md">
               Scroll to explore our comprehensive range of professional photography and videography services.
             </p>
             <div className="mt-8 flex items-center gap-2 text-white/50">
                <ArrowRight className="animate-pulse" />
                <span className="text-sm uppercase tracking-widest">Scroll</span>
             </div>
          </div>

          {/* Service Cards */}
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative h-[70vh] w-[85vw] md:w-[45vw] flex-shrink-0 overflow-hidden rounded-3xl bg-neutral-800 border border-white/10 transition-colors hover:border-accent-500/50"
            >
              {/* Image Background */}
              <div className="absolute inset-0">
                <img
                  src={service.image}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                  <h3
                    className="mb-4 text-3xl md:text-4xl font-bold text-white"
                    style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-lg text-gray-300 max-w-md opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                    {service.description}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-accent-500 opacity-0 transition-opacity duration-500 delay-200 group-hover:opacity-100">
                    <span className="font-semibold uppercase tracking-wider text-sm" style={{ color: theme.colors.accent[500] }}>View Details</span>
                    <ArrowRight className="w-4 h-4" style={{ color: theme.colors.accent[500] }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
