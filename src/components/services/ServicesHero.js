'use client'
import { useState, useEffect } from 'react'
import { theme } from '../../lib/theme'
import { ArrowRight, Camera, Sparkles, Heart, Briefcase } from 'lucide-react'

export default function ServicesHero() {
  const [activeId, setActiveId] = useState('portrait')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const services = [
    {
      id: 'portrait',
      title: 'Portrait',
      subtitle: 'Capturing Essence',
      description: 'Intimate, powerful portraits that reveal the true you. Studio or on-location sessions tailored to your personality.',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=1200',
      icon: Camera
    },
    {
      id: 'event',
      title: 'Events',
      subtitle: 'Unforgettable Moments',
      description: 'From corporate galas to private celebrations, we document the energy and emotion of your most important gatherings.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
      icon: Sparkles
    },
    {
      id: 'wedding',
      title: 'Wedding',
      subtitle: 'Cinematic Love Stories',
      description: 'Timeless wedding photography that tells your unique love story with cinematic flair and emotional depth.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200',
      icon: Heart
    },
    {
      id: 'product',
      title: 'Commercial',
      subtitle: 'Brand Excellence',
      description: 'High-end product and commercial photography that elevates your brand and captivates your audience.',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200',
      icon: Briefcase
    }
  ]

  return (
    <section className="relative h-screen bg-black overflow-hidden flex flex-col md:flex-row">
      {/* Mobile Header (Visible only on small screens) */}
      <div className="md:hidden absolute top-20 left-0 w-full z-20 px-6 text-center pointer-events-none">
        <h1 className="text-3xl font-bold text-white drop-shadow-lg" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
          Our <span style={{ color: theme.colors.accent[500] }}>Services</span>
        </h1>
      </div>

      {services.map((service) => {
        const isActive = activeId === service.id
        const Icon = service.icon

        return (
          <div
            key={service.id}
            onMouseEnter={() => !isMobile && setActiveId(service.id)}
            onClick={() => setIsMobile(true) && setActiveId(service.id)}
            className={`
              relative flex-1 min-h-[25vh] md:min-h-screen md:h-screen
              transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]
              overflow-hidden cursor-pointer group border-b md:border-b-0 md:border-r border-gray-900/50
              ${isActive ? 'flex-[3] md:flex-[3]' : 'flex-[1] md:flex-[1]'}
            `}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={service.image}
                alt={service.title}
                className={`
                  w-full h-full object-cover transition-transform duration-1000
                  ${isActive ? 'scale-100' : 'scale-110 grayscale-[50%]'}
                `}
              />
              <div className={`
                absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-black/80 via-black/40 to-transparent
                transition-opacity duration-500
                ${isActive ? 'opacity-80' : 'opacity-60 group-hover:opacity-40'}
              `} />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 p-6 md:p-12 flex flex-col justify-end md:justify-center">
              
              {/* Inactive State (Vertical Text for Desktop) */}
              <div className={`
                hidden md:flex absolute inset-0 items-center justify-center pointer-events-none
                transition-all duration-500
                ${isActive ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0 delay-100'}
              `}>
                <h3 
                  className="text-2xl font-bold text-white tracking-widest uppercase whitespace-nowrap"
                  style={{ 
                    writingMode: 'vertical-rl', 
                    textOrientation: 'mixed',
                    fontFamily: theme.typography.fontFamily.display.join(', '),
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                  }}
                >
                  {service.title}
                </h3>
              </div>

              {/* Active State Content */}
              <div className={`
                relative z-10 max-w-xl transition-all duration-700 delay-100
                ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 md:translate-y-20'}
              `}>
                {/* Icon & Label */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span 
                    className="text-sm font-semibold tracking-widest uppercase"
                    style={{ color: theme.colors.accent[500] }}
                  >
                    {service.subtitle}
                  </span>
                </div>

                {/* Title */}
                <h2 
                  className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
                  style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                >
                  {service.title}
                </h2>

                {/* Description */}
                <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-md hidden md:block">
                  {service.description}
                </p>

                {/* CTA Button */}
                <button 
                  className="group/btn inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold transition-all hover:bg-accent-500 hover:text-white"
                  style={{ 
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  Explore {service.title}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
            
            {/* Hover Overlay for Inactive State */}
            <div className={`
              absolute inset-0 bg-accent-500/20 mix-blend-overlay transition-opacity duration-300 pointer-events-none
              ${!isActive && 'group-hover:opacity-100 opacity-0'}
            `} />
          </div>
        )
      })}
    </section>
  )
}
