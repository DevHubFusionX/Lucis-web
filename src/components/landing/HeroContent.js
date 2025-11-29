'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Play, ChevronDown } from 'lucide-react'
import { theme } from '@/lib/theme'

function useIsVisible(threshold = 0.1) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, isVisible]
}

const heroImages = [
  '/Hero-image.jpeg',
  '/Hero-image3.webp',
  '/Hero-image4.webp',
  '/Hero-image14.jpg',
  '/Hero-image15.jpg',
  '/Hero-image16.jpg',
  '/Hero-image17.jpg'
]

export default function HeroContent() {
  const [sectionRef, isVisible] = useIsVisible(0.1)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % heroImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      aria-label="Hero section"
      style={{ backgroundColor: theme.colors.white }}
    >
      <div className="absolute inset-0 bg-gradient-to-br" style={{ 
        backgroundImage: `linear-gradient(to bottom right, ${theme.colors.neutral.warmGray}, ${theme.colors.white})`
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 w-full py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-start">
          {/* Left Content */}
          <div className="lg:col-span-6 text-center lg:text-left relative z-10">
            <div
              className={`inline-block mb-4 sm:mb-6 transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
            >
              <span className="text-[10px] sm:text-xs font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase" style={{ color: theme.colors.gray[500] }}>
                Where Vision Meets Reality
              </span>
            </div>

            <h1
              className={`mb-6 sm:mb-8 transition-all duration-1000 ease-out delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.95] tracking-tight mb-2 sm:mb-3" style={{ color: theme.colors.gray[900] }}>
                Every Frame
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.95] tracking-tight" style={{ color: theme.colors.accent[500] }}>
                Tells a Story.
              </span>
            </h1>

            <p
              className={`text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8 sm:mb-10 lg:mb-12 max-w-xl mx-auto lg:mx-0 transition-all duration-1000 ease-out delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}
            >
              Connect with exceptional visual storytellers who transform fleeting moments into timeless art. Curated talent, seamless booking.
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start transition-all duration-1000 ease-out delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Link
                href="/search"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-white text-sm sm:text-base font-semibold rounded-full transition-all duration-200 hover:shadow-lg"
                style={{ 
                  backgroundColor: theme.colors.accent[500],
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[600]}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[500]}
              >
                Discover Talent
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>

              <button
                type="button"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-full transition-all duration-200"
                style={{ 
                  color: theme.colors.gray[700],
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors.gray[100]
                  e.currentTarget.style.color = theme.colors.gray[900]
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = theme.colors.gray[700]
                }}
                onClick={() => {
                  if (typeof document === 'undefined') return
                  const el = document.getElementById('how-it-works')
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2 transition-transform group-hover:scale-110" />
                View Portfolio
              </button>
            </div>
          </div>

          {/* Right Floating Images */}
          <div className="lg:col-span-6 relative h-[400px] sm:h-[500px] lg:h-[700px] mt-8 lg:mt-0 pointer-events-none z-40">
            {/* Large Main Image */}
            <div
              className={`absolute top-0 right-0 sm:right-4 lg:right-0 w-[200px] h-[280px] sm:w-[240px] sm:h-[340px] lg:w-[340px] lg:h-[460px] rounded-2xl lg:rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000 ease-out delay-300 ${
                isVisible ? 'opacity-100 translate-x-0 rotate-0' : 'opacity-0 translate-x-12 rotate-6'
              }`}
            >
              {heroImages.map((img, idx) => (
                <Image
                  key={img}
                  src={img}
                  alt="Professional photography"
                  fill
                  className={`object-cover transition-all duration-1000 ${
                    idx === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                  }`}
                />
              ))}
            </div>

            {/* Small Top Left */}
            <div
              className={`absolute top-8 sm:top-12 left-0 sm:left-4 lg:left-0 w-[120px] h-[160px] sm:w-40 sm:h-[220px] lg:w-[220px] lg:h-[300px] rounded-xl lg:rounded-2xl overflow-hidden shadow-xl transition-all duration-1000 ease-out delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-12'
              }`}
            >
              <Image
                src={heroImages[(currentIndex + 1) % heroImages.length]}
                alt="Photography work"
                fill
                className="object-cover"
              />
            </div>

            {/* Medium Bottom Left */}
            <div
              className={`absolute bottom-0 left-8 sm:left-16 lg:left-12 w-[140px] h-[180px] sm:w-[180px] sm:h-[240px] lg:w-[240px] lg:h-[320px] rounded-xl lg:rounded-2xl overflow-hidden shadow-xl transition-all duration-1000 ease-out delay-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <Image
                src={heroImages[(currentIndex + 2) % heroImages.length]}
                alt="Photography work"
                fill
                className="object-cover"
              />
            </div>

            {/* Floating Badge */}
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-xl rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-xl border transition-all duration-1000 ease-out delay-900 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
              style={{ 
                backgroundColor: `${theme.colors.white}95`,
                borderColor: theme.colors.gray[100]
              }}
            >
              <p className="text-xs sm:text-sm font-medium whitespace-nowrap" style={{ color: theme.colors.gray[900] }}>
                <span className="font-semibold" style={{ color: theme.colors.accent[500] }}>
                  2.5K+
                </span>{' '}
                Stories Told
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6" style={{ color: theme.colors.gray[400] }} />
      </div>
    </section>
  )
}
