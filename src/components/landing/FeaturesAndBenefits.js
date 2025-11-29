'use client'
import { useState, useRef, useEffect } from 'react'
import { Zap, Shield, Calendar, CreditCard, Camera } from 'lucide-react'
import { theme } from '@/lib/theme'

const photographerImages = [
  'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1554048612-387768052bf7?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000'
]

const features = [
  {
    id: 'booking',
    icon: Zap,
    title: 'Instant Booking',
    description: 'Book sessions in under 2 minutes'
  },
  {
    id: 'portfolio',
    icon: Camera,
    title: 'Portfolio Builder',
    description: 'Showcase your best work effortlessly'
  },
  {
    id: 'verified',
    icon: Shield,
    title: 'Verified Pros',
    description: 'Every photographer is vetted & reviewed'
  },
  {
    id: 'calendar',
    icon: Calendar,
    title: 'Smart Calendar Sync',
    description: 'Seamlessly integrates with your schedule'
  },
  {
    id: 'payment',
    icon: CreditCard,
    title: 'Payment Secure',
    description: 'Protected transactions, guaranteed delivery'
  }
]

function useIsVisible(threshold = 0.1) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold, rootMargin: '100px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

function PolaroidCard({ feature, image, rotation, delay, isVisible }) {
  const Icon = feature.icon
  const visibilityClass = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  return (
    <div
      className={`group relative transition-all duration-1000 ease-out ${visibilityClass}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="relative bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500"
        style={{
          transform: `rotate(${rotation}deg)`,
          width: '140px',
          height: '180px',
          padding: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
        }}
      >
        <div className="relative w-full h-full bg-white rounded-sm overflow-hidden flex flex-col">
          <div className="flex-1 relative overflow-hidden bg-gray-200">
            <img
              src={image}
              alt={feature.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div 
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="400" height="400" filter="url(%23noiseFilter)" /%3E%3C/svg%3E")',
                backgroundSize: '200px 200px'
              }}
            />
          </div>
          
          <div className="pt-2 px-1.5 pb-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <div 
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: theme.colors.accent[50] }}
              >
                <Icon className="w-2 h-2" style={{ color: theme.colors.accent[500] }} />
              </div>
              <h3 className="text-[9px] font-semibold truncate" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
                {feature.title}
              </h3>
            </div>
            <p className="text-[7px] font-light leading-tight" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FeaturesAndBenefits() {
  const [sectionRef, isVisible] = useIsVisible(0.1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % photographerImages.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br" style={{ 
        backgroundImage: `linear-gradient(to bottom right, ${theme.colors.neutral.warmGray}, ${theme.colors.white})`
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div 
          className={`text-center mb-12 sm:mb-16 lg:mb-20 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
            The Platform
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-light leading-tight mt-3 sm:mt-4 mb-4 sm:mb-6" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.display.join(', ') }}>
            Built for <span style={{ color: theme.colors.accent[500] }}>Photography</span>
          </h2>
          <p className="text-sm sm:text-lg lg:text-2xl max-w-2xl mx-auto" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
            Experience seamless booking, verified talent, and professional results
          </p>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                className={`group relative p-4 rounded-2xl bg-white border-2 transition-all duration-1000 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  borderColor: theme.colors.gray[100],
                  transitionDelay: `${idx * 100}ms`
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.gray[50]} 0%, ${theme.colors.white} 100%)` }}
                />
                <div className="relative flex items-start gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: theme.colors.accent[50] }}
                  >
                    <Icon className="w-5 h-5" style={{ color: theme.colors.accent[500] }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold mb-1" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
                      {feature.title}
                    </h3>
                    <p className="text-xs font-light" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop Polaroid Bento Grid */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          
          {/* Polaroid Card - Top Left */}
          <div className="md:col-span-1">
            <PolaroidCard 
              feature={features[0]} 
              image={photographerImages[0]} 
              rotation={-3}
              delay={0}
              isVisible={isVisible}
            />
          </div>

          {/* Tall Feature - Top Right (spans 2 rows) */}
          <div
            className={`md:col-span-2 md:row-span-2 group relative p-8 rounded-2xl bg-white border-2 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              borderColor: theme.colors.gray[100],
              transitionDelay: '100ms'
            }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: `linear-gradient(135deg, ${theme.colors.gray[50]} 0%, ${theme.colors.white} 100%)` }}
            />
            <div className="relative h-full flex flex-col justify-between">
              <div>
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: theme.colors.accent[50] }}
                >
                  <Zap className="w-7 h-7" style={{ color: theme.colors.accent[500] }} />
                </div>
                <h3 className="text-2xl lg:text-3xl font-semibold mb-3" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                  {features[0].title}
                </h3>
                <p className="text-base font-light leading-relaxed" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
                  {features[0].description}
                </p>
              </div>
              <div 
                className="w-12 h-1 rounded-full"
                style={{ backgroundColor: theme.colors.accent[500] }}
              />
            </div>
          </div>

          {/* Polaroid Card - Bottom Left */}
          <div className="md:col-span-1">
            <PolaroidCard 
              feature={features[1]} 
              image={photographerImages[1]} 
              rotation={2}
              delay={200}
              isVisible={isVisible}
            />
          </div>

          {/* Wide Polaroid Card (tilted) - spans 3 columns */}
          <div className="md:col-span-3 lg:col-span-2">
            <div
              className={`group relative transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div
                className="relative bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500"
                style={{
                  transform: 'rotate(-2deg)',
                  padding: '12px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                }}
              >
                <div className="relative w-full bg-white rounded-sm overflow-hidden flex">
                  <div className="w-2/5 relative overflow-hidden bg-gray-200">
                    <img
                      src={photographerImages[2]}
                      alt={features[2].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div 
                      className="absolute inset-0 opacity-5"
                      style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="400" height="400" filter="url(%23noiseFilter)" /%3E%3C/svg%3E")',
                        backgroundSize: '200px 200px'
                      }}
                    />
                  </div>
                  <div className="w-3/5 p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: theme.colors.accent[50] }}
                        >
                          <Shield className="w-3 h-3" style={{ color: theme.colors.accent[500] }} />
                        </div>
                        <h3 className="text-sm font-semibold" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
                          {features[2].title}
                        </h3>
                      </div>
                      <p className="text-xs font-light leading-tight" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
                        {features[2].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Cards x2 - Bottom Right */}
          {[3, 4].map((idx) => {
            const feature = features[idx]
            const Icon = feature.icon
            return (
              <div
                key={feature.id}
                className={`group relative p-4 rounded-2xl bg-white border-2 transition-all duration-1000 ease-out ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  borderColor: theme.colors.gray[100],
                  transitionDelay: `${400 + (idx - 3) * 100}ms`
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${theme.colors.gray[50]} 0%, ${theme.colors.white} 100%)` }}
                />
                <div className="relative">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                    style={{ backgroundColor: theme.colors.accent[50] }}
                  >
                    <Icon className="w-4 h-4" style={{ color: theme.colors.accent[500] }} />
                  </div>
                  <h3 className="text-xs font-semibold mb-1" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
                    {feature.title}
                  </h3>
                  <p className="text-[10px] font-light" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Showcase Section */}
        <div 
          className={`relative rounded-3xl overflow-hidden bg-gray-900 py-12 sm:py-16 lg:py-24 mt-8 sm:mt-12 lg:mt-16 transition-all duration-1000 ease-out delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="absolute inset-0">
            {photographerImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={img}
                  alt="Photography showcase"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
              </div>
            ))}
          </div>

          <div className="relative max-w-2xl px-4 sm:px-8 lg:px-12">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.colors.accent[400] }} />
              <span className="text-xs font-medium tracking-wider uppercase" style={{ color: theme.colors.gray[300], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
                Featured
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white mb-3 sm:mb-4 tracking-tight" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
              Stunning Portfolio
            </h3>
            <p className="text-sm sm:text-base font-light leading-relaxed mb-6 sm:mb-8" style={{ color: theme.colors.gray[300], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
              Dynamic showcase of professional photography work
            </p>
            
            <div className="flex gap-2">
              {photographerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'w-8 opacity-100' 
                      : 'w-1 opacity-40 hover:opacity-70'
                  }`}
                  style={{ backgroundColor: theme.colors.accent[500] }}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
