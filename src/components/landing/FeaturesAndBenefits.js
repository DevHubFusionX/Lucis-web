'use client'
import { useState, useRef, useEffect } from 'react'
import { Zap, Shield, Calendar, CreditCard, Users, Camera } from 'lucide-react'
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
      {/* Subtle Background - matches Hero */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div 
          className={`text-center mb-16 sm:mb-20 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-block mb-4 sm:mb-6">
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gray-500">
              The Platform
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] tracking-tight text-gray-900 mb-4">
            Built for{' '}
            <span style={{ color: theme.colors.accent[500] }} className="font-light">
              Photography
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed text-gray-700 max-w-2xl mx-auto">
            Experience seamless booking, verified talent, and professional results—all in one elegant platform.
          </p>
        </div>

        {/* Cinematic Bento Grid - 2x3 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          
          {/* Photo Preview - Large Dynamic Box */}
          <div 
            className={`md:row-span-2 relative rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-900 aspect-[4/5] md:aspect-auto shadow-2xl transition-all duration-1000 ease-out delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Rotating Images */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>
              ))}
            </div>

            {/* Overlay Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: theme.colors.accent[400] }} />
                <span className="text-xs font-medium tracking-wider uppercase" style={{ color: theme.colors.gray[300] }}>
                  Photo Preview
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-2 tracking-tight">
                Stunning Portfolio
              </h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: theme.colors.gray[400] }}>
                Dynamic showcase of professional photography work
              </p>
              
              {/* Pagination Dots */}
              <div className="flex gap-2 mt-6">
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

          {/* Feature Cards - 5 smaller tiles */}
          {features.map((feature, index) => {
            const Icon = feature.icon
            
            return (
              <div
                key={feature.id}
                className={`group relative p-6 sm:p-8 rounded-2xl lg:rounded-3xl bg-white border-2 hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  borderColor: theme.colors.gray[100],
                  transitionDelay: `${(index + 1) * 100}ms`
                }}
              >
                {/* Subtle hover gradient */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ 
                    background: `linear-gradient(135deg, ${theme.colors.gray[50]} 0%, ${theme.colors.white} 100%)`
                  }}
                />
                
                {/* Content */}
                <div className="relative">
                  <div 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-all duration-500"
                    style={{ 
                      backgroundColor: theme.colors.accent[50],
                      borderWidth: '1px',
                      borderColor: theme.colors.accent[100]
                    }}
                  >
                    <Icon 
                      className="w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-500" 
                      style={{ 
                        color: theme.colors.accent[500] 
                      }} 
                    />
                  </div>
                  
                  <h3 
                    className="text-lg sm:text-xl font-medium mb-2 transition-colors duration-300"
                    style={{ color: theme.colors.gray[900] }}
                  >
                    {feature.title}
                  </h3>
                  
                  <p 
                    className="text-sm font-light leading-relaxed transition-colors duration-300"
                    style={{ color: theme.colors.gray[600] }}
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Accent line */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ backgroundColor: theme.colors.accent[500] }}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}