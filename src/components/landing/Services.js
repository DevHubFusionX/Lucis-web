'use client'
import { useState, useRef, useEffect } from 'react'
import { Heart, Briefcase, Camera, Users, ArrowRight, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { theme } from '@/lib/theme'

function useIsVisible(threshold = 0.1) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true)
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold, rootMargin: '100px' }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

const SERVICES = [
  {
    id: 'portrait',
    title: 'Portraits',
    subtitle: 'Professional headshots and personal portraits',
    description: 'Capture your best self with professional portrait photography. Perfect for LinkedIn, business profiles, or personal branding.',
    icon: Users,
    image: '/Hero-image3.webp',
    price: 'From $350',
    duration: '1-2 hours',
    deliverables: '15-30 edited photos',
    features: ['Multiple outfit changes', 'Professional retouching', 'Same-day preview', 'Print-ready files', 'Online gallery']
  },
  {
    id: 'events',
    title: 'Events',
    subtitle: 'Corporate and social event coverage',
    description: 'Document your events with professional photography that captures the energy and essence of your occasion.',
    icon: Camera,
    image: '/Hero-image4.webp',
    price: 'From $800',
    duration: '4-8 hours',
    deliverables: '100-300 edited photos',
    features: ['Live event coverage', 'Quick turnaround', 'Social media ready', 'Candid & posed shots', 'Multiple photographers']
  },
  {
    id: 'wedding',
    title: 'Wedding',
    subtitle: 'Your perfect day, beautifully captured',
    description: 'Capture every precious moment of your special day with our award-winning wedding photographers.',
    icon: Heart,
    image: '/Hero-image.jpeg',
    price: 'From $2,500',
    duration: '8-12 hours',
    deliverables: '300-500 edited photos',
    features: ['Engagement session', 'Full day coverage', 'Second photographer', 'Online gallery', 'Print release rights']
  },
  {
    id: 'studio',
    title: 'Studio',
    subtitle: 'Professional studio photography',
    description: 'Elevate your brand with stunning studio photography. Perfect for product shots and commercial work.',
    icon: Briefcase,
    image: '/Hero-image14.jpg',
    price: 'From $1,200',
    duration: '4-6 hours',
    deliverables: '50-150 edited photos',
    features: ['Professional lighting', 'Full studio access', 'Props & backdrops', 'Usage rights included', 'Multiple formats']
  }
]

function ServiceTab({ service, isActive, onClick }) {
  const Icon = service.icon
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl transition-all duration-500 group hidden lg:block ${
        isActive ? 'shadow-lg' : 'hover:shadow-md'
      }`}
      style={{
        backgroundColor: isActive ? theme.colors.accent[50] : theme.colors.white,
        borderColor: isActive ? theme.colors.accent[200] : theme.colors.gray[100],
        borderWidth: '2px'
      }}
    >
      <div className="flex items-center gap-3">
        <div 
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 ${
            isActive ? 'scale-110 animate-scaleBalance' : 'group-hover:scale-105'
          }`}
          style={{ backgroundColor: isActive ? theme.colors.accent[100] : theme.colors.gray[100] }}
        >
          <Icon className="w-6 h-6" style={{ color: isActive ? theme.colors.accent[600] : theme.colors.gray[600] }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base font-semibold truncate" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
            {service.title}
          </h3>
          <p className="text-xs truncate" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
            {service.subtitle}
          </p>
        </div>
        {isActive && <div className="w-1.5 h-6 rounded-full animate-balance" style={{ backgroundColor: theme.colors.accent[500] }} />}
      </div>
    </button>
  )
}

function ServiceCard({ service, isActive }) {
  const Icon = service.icon
  return (
    <div className="flex-shrink-0 w-full lg:hidden px-4">
      <div className={`bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-700 ${
        isActive ? 'opacity-100 scale-100' : 'opacity-75 scale-95'
      }`}>
        <div className="relative aspect-video overflow-hidden">
          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full backdrop-blur-md animate-fadeIn" style={{ backgroundColor: `${theme.colors.white}95` }}>
            <p className="text-xs font-semibold" style={{ color: theme.colors.gray[900] }}>{service.price}</p>
          </div>
        </div>
        <div className="p-6 space-y-4 animate-slideUp">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.colors.accent[50] }}>
              <Icon className="w-5 h-5" style={{ color: theme.colors.accent[600] }} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold" style={{ color: theme.colors.gray[900] }}>{service.title}</h3>
              <p className="text-sm" style={{ color: theme.colors.gray[500] }}>{service.subtitle}</p>
            </div>
          </div>
          
          <p className="text-sm leading-relaxed" style={{ color: theme.colors.gray[600] }}>{service.description}</p>
          
          <div className="grid grid-cols-2 gap-4 py-4 border-y" style={{ borderColor: theme.colors.gray[100] }}>
            <div>
              <p className="text-xs font-light mb-1" style={{ color: theme.colors.gray[500] }}>Duration</p>
              <p className="text-lg font-semibold" style={{ color: theme.colors.gray[900] }}>{service.duration}</p>
            </div>
            <div>
              <p className="text-xs font-light mb-1" style={{ color: theme.colors.gray[500] }}>Deliverables</p>
              <p className="text-lg font-semibold" style={{ color: theme.colors.gray[900] }}>{service.deliverables}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: theme.colors.gray[900] }}>What's included:</p>
            <ul className="space-y-2">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 animate-slideUp" style={{ animationDelay: `${idx * 50}ms` }}>
                  <Check className="w-4 h-4 flex-shrink-0" style={{ color: theme.colors.accent[500] }} />
                  <span className="text-sm" style={{ color: theme.colors.gray[700] }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button 
            className="group/btn w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-base transition-all duration-300 hover:shadow-lg hover:scale-105 animate-slideUp" 
            style={{ backgroundColor: theme.colors.accent[500], animationDelay: '250ms' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[600]}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[500]}
          >
            <span>Book Now</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

function ServiceDetails({ service }) {
  const Icon = service.icon
  return (
    <div className="hidden lg:grid lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="relative aspect-[4/5] lg:aspect-auto rounded-3xl overflow-hidden shadow-2xl">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute top-6 left-6 px-4 py-2 rounded-full backdrop-blur-md" style={{ backgroundColor: `${theme.colors.white}95` }}>
          <p className="text-sm font-semibold" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>{service.price}</p>
        </div>
      </div>

      <div className="flex flex-col justify-center space-y-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: theme.colors.accent[50] }}>
          <Icon className="w-7 h-7" style={{ color: theme.colors.accent[600] }} />
        </div>

        <div>
          <h3 className="text-5xl sm:text-6xl font-light mb-4" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.display.join(', ') }}>{service.title}</h3>
          <p className="text-lg sm:text-xl font-light leading-relaxed" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>{service.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 py-6 border-y" style={{ borderColor: theme.colors.gray[100] }}>
          <div>
            <p className="text-xs font-light mb-1" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Duration</p>
            <p className="text-xl sm:text-2xl font-semibold" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>{service.duration}</p>
          </div>
          <div>
            <p className="text-xs font-light mb-1" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Deliverables</p>
            <p className="text-xl sm:text-2xl font-semibold" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>{service.deliverables}</p>
          </div>
        </div>

        <div>
          <p className="text-base sm:text-lg font-semibold mb-4" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>What's included:</p>
          <ul className="space-y-3">
            {service.features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3 transition-all duration-500 hover:translate-x-1" style={{ animationDelay: `${idx * 50}ms` }}>
                <Check className="w-5 h-5 flex-shrink-0 transition-transform duration-300" style={{ color: theme.colors.accent[500] }} />
                <span className="text-base" style={{ color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button 
          className="group/btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95" 
          style={{ backgroundColor: theme.colors.accent[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[600]}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[500]}
        >
          <span>Book {service.title}</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

export default function Services() {
  const [sectionRef, isVisible] = useIsVisible(0.1)
  const [activeTab, setActiveTab] = useState('portrait')
  const [currentIndex, setCurrentIndex] = useState(0)
  const activeService = SERVICES.find(s => s.id === activeTab)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SERVICES.length)
    setActiveTab(SERVICES[(currentIndex + 1) % SERVICES.length].id)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SERVICES.length) % SERVICES.length)
    setActiveTab(SERVICES[(currentIndex - 1 + SERVICES.length) % SERVICES.length].id)
  }

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: theme.colors.white }}>
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes balance {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes scaleBalance {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-balance {
          animation: balance 3s ease-in-out infinite;
        }
        .animate-scaleBalance {
          animation: scaleBalance 3s ease-in-out infinite;
        }
      `}</style>
      <div className="absolute inset-0 bg-gradient-to-br" style={{ 
        backgroundImage: `linear-gradient(to bottom right, ${theme.colors.neutral.warmGray}, ${theme.colors.white})`
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className={`text-center mb-16 sm:mb-20 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Our Services</span>
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-light leading-tight mt-4 mb-6" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.display.join(', ') }}>
            Photography <span style={{ color: theme.colors.accent[500] }}>Services</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Professional photography for every occasion</p>
        </div>

        {/* Desktop Layout */}
        <div className={`hidden lg:grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="space-y-3">
            {SERVICES.map(service => (
              <ServiceTab key={service.id} service={service} isActive={activeTab === service.id} onClick={() => setActiveTab(service.id)} />
            ))}
          </div>

          <div className="relative">
            {activeService && (
              <div className="transition-all duration-700 opacity-100 translate-x-0 animate-slideUp" style={{ animationDelay: '100ms' }}>
                <ServiceDetails service={activeService} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Layout - Card Carousel */}
        <div className={`lg:hidden transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl">
              <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {SERVICES.map((service, idx) => (
                  <ServiceCard key={service.id} service={service} isActive={currentIndex === idx} />
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 gap-4">
              <button
                onClick={handlePrev}
                className="p-3 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110 active:scale-95"
                style={{ backgroundColor: theme.colors.gray[100], color: theme.colors.gray[900] }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots Indicator */}
              <div className="flex gap-2">
                {SERVICES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx)
                      setActiveTab(SERVICES[idx].id)
                    }}
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: currentIndex === idx ? '24px' : '8px',
                      backgroundColor: currentIndex === idx ? theme.colors.accent[500] : theme.colors.gray[200]
                    }}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="p-3 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-110 active:scale-95"
                style={{ backgroundColor: theme.colors.gray[100], color: theme.colors.gray[900] }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
