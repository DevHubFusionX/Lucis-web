'use client'
import { useState, useRef, useEffect } from 'react'
import { Heart, Briefcase, Camera, Users, ArrowRight, Check } from 'lucide-react'
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
      className={`w-full text-left p-5 rounded-2xl transition-all duration-500 group ${
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
            isActive ? 'scale-110' : 'group-hover:scale-105'
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
        {isActive && <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: theme.colors.accent[500] }} />}
      </div>
    </button>
  )
}

function ServiceDetails({ service }) {
  const Icon = service.icon
  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
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
              <li key={idx} className="flex items-center gap-3">
                <Check className="w-5 h-5 flex-shrink-0" style={{ color: theme.colors.accent[500] }} />
                <span className="text-base" style={{ color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <button 
          className="group/btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:scale-105" 
          style={{ backgroundColor: theme.colors.accent[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[600]}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[500]}
        >
          <span>Book {service.title}</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </div>
  )
}

export default function Services() {
  const [sectionRef, isVisible] = useIsVisible(0.1)
  const [activeTab, setActiveTab] = useState('portrait')
  const activeService = SERVICES.find(s => s.id === activeTab)

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-24 lg:py-32 overflow-hidden" style={{ backgroundColor: theme.colors.white }}>
      <div className="absolute inset-0 bg-gradient-to-br" style={{ 
        backgroundImage: `linear-gradient(to bottom right, ${theme.colors.neutral.warmGray}, ${theme.colors.white})`
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className={`text-center mb-16 sm:mb-20 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}>
          <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Our Services</span>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-light leading-tight mt-4 mb-6" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.display.join(', ') }}>
            Photography <span style={{ color: theme.colors.accent[500] }}>Services</span>
          </h2>
          <p className="text-xl sm:text-2xl max-w-2xl mx-auto" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Professional photography for every occasion</p>
        </div>

        <div className={`grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-12 transition-all duration-1000 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="space-y-3">
            {SERVICES.map(service => (
              <ServiceTab key={service.id} service={service} isActive={activeTab === service.id} onClick={() => setActiveTab(service.id)} />
            ))}
          </div>

          <div className="relative">
            {activeService && (
              <div className="transition-all duration-700 opacity-100 translate-x-0">
                <ServiceDetails service={activeService} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
