'use client'
import { useState, useRef, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'
import { theme } from '@/lib/theme'

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

const testimonials = [
  {
    id: 1,
    name: 'Sarah & Michael Chen',
    role: 'Wedding',
    location: 'Napa Valley, CA',
    rating: 5,
    quote: 'Every moment of our special day was captured with such artistry and emotion. Looking at our photos brings us right back to those magical moments.',
    image: '/Hero-image.jpeg',
    size: 'large' // Big card
  },
  {
    id: 2,
    name: 'Jessica Williams',
    role: 'Portrait Session',
    location: 'New York, NY',
    rating: 5,
    quote: 'The photographer made me feel so comfortable. These portraits are exactly what I envisioned.',
    image: '/Hero-image3.webp',
    size: 'medium' // Medium card
  },
  {
    id: 3,
    name: 'Emily & James',
    role: 'Engagement',
    location: 'Austin, TX',
    rating: 5,
    quote: 'Beautiful, timeless photos that we will treasure forever. Absolutely stunning work.',
    image: '/Hero-image4.webp',
    size: 'small' // Small card
  }
]

export default function Testimonials() {
  const [sectionRef, isVisible] = useIsVisible(0.1)

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden"
    >
      {/* Subtle Background */}
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
              Client Stories
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-[1.1] tracking-tight text-gray-900 mb-4">
            Capturing{' '}
            <span style={{ color: theme.colors.accent[500] }} className="font-light italic font-serif">
              Memories
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed text-gray-700 max-w-2xl mx-auto">
            Stories from our clients who found their perfect photographer
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Large Card - spans 2 columns */}
          <div 
            className={`lg:col-span-2 group relative rounded-2xl lg:rounded-3xl overflow-hidden bg-white border-2 shadow-xl hover:shadow-2xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              borderColor: theme.colors.gray[100],
              transitionDelay: '200ms'
            }}
          >
            <div className="grid md:grid-cols-2">
              {/* Portrait Photo */}
              <div className="relative aspect-[4/5] md:aspect-auto overflow-hidden">
                <img 
                  src={testimonials[0].image}
                  alt={testimonials[0].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Quote Content */}
              <div className="relative p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                {/* Quote Icon */}
                <Quote 
                  className="w-10 h-10 sm:w-12 sm:h-12 mb-6 opacity-20" 
                  style={{ color: theme.colors.accent[500] }} 
                />
                
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonials[0].rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-current" 
                      style={{ color: theme.colors.accent[500] }} 
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote 
                  className="text-lg sm:text-xl lg:text-2xl font-light leading-relaxed mb-8 italic font-serif"
                  style={{ color: theme.colors.gray[900] }}
                >
                  "{testimonials[0].quote}"
                </blockquote>

                {/* Author */}
                <div>
                  <h4 
                    className="text-base sm:text-lg font-medium mb-1"
                    style={{ color: theme.colors.gray[900] }}
                  >
                    {testimonials[0].name}
                  </h4>
                  <p 
                    className="text-sm font-light"
                    style={{ color: theme.colors.gray[600] }}
                  >
                    {testimonials[0].role} • {testimonials[0].location}
                  </p>
                </div>

                {/* Accent Line */}
                <div 
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: theme.colors.accent[500] }}
                />
              </div>
            </div>
          </div>

          {/* Medium Card */}
          <div 
            className={`group relative rounded-2xl lg:rounded-3xl overflow-hidden bg-white border-2 shadow-lg hover:shadow-xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              borderColor: theme.colors.gray[100],
              transitionDelay: '400ms'
            }}
          >
            <div className="grid grid-rows-[auto_1fr]">
              {/* Portrait Photo */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={testimonials[1].image}
                  alt={testimonials[1].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Quote Content */}
              <div className="relative p-6 sm:p-8 flex flex-col">
                {/* Quote Icon */}
                <Quote 
                  className="w-8 h-8 mb-4 opacity-20" 
                  style={{ color: theme.colors.accent[500] }} 
                />
                
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonials[1].rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-current" 
                      style={{ color: theme.colors.accent[500] }} 
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote 
                  className="text-base sm:text-lg font-light leading-relaxed mb-6 italic font-serif flex-1"
                  style={{ color: theme.colors.gray[900] }}
                >
                  "{testimonials[1].quote}"
                </blockquote>

                {/* Author */}
                <div>
                  <h4 
                    className="text-sm sm:text-base font-medium mb-1"
                    style={{ color: theme.colors.gray[900] }}
                  >
                    {testimonials[1].name}
                  </h4>
                  <p 
                    className="text-xs font-light"
                    style={{ color: theme.colors.gray[600] }}
                  >
                    {testimonials[1].role}
                  </p>
                </div>

                {/* Accent Dot */}
                <div 
                  className="absolute top-6 right-6 w-2 h-2 rounded-full"
                  style={{ backgroundColor: theme.colors.accent[500] }}
                />
              </div>
            </div>
          </div>

          {/* Small Card */}
          <div 
            className={`group relative rounded-2xl lg:rounded-3xl overflow-hidden bg-white border-2 shadow-lg hover:shadow-xl transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              borderColor: theme.colors.gray[100],
              transitionDelay: '600ms'
            }}
          >
            <div className="grid grid-rows-[auto_1fr]">
              {/* Portrait Photo */}
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={testimonials[2].image}
                  alt={testimonials[2].name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>

              {/* Quote Content */}
              <div className="relative p-6 flex flex-col">
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonials[2].rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4 fill-current" 
                      style={{ color: theme.colors.accent[500] }} 
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote 
                  className="text-sm font-light leading-relaxed mb-4 italic font-serif flex-1"
                  style={{ color: theme.colors.gray[800] }}
                >
                  "{testimonials[2].quote}"
                </blockquote>

                {/* Author */}
                <div>
                  <h4 
                    className="text-sm font-medium mb-0.5"
                    style={{ color: theme.colors.gray[900] }}
                  >
                    {testimonials[2].name}
                  </h4>
                  <p 
                    className="text-xs font-light"
                    style={{ color: theme.colors.gray[600] }}
                  >
                    {testimonials[2].role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Small Card 2 - Placeholder for symmetry */}
          <div 
            className={`group relative rounded-2xl lg:rounded-3xl overflow-hidden border-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              borderColor: theme.colors.gray[100],
              background: `linear-gradient(135deg, ${theme.colors.accent[50]} 0%, ${theme.colors.white} 100%)`,
              transitionDelay: '800ms'
            }}
          >
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div 
                className="w-16 h-16 rounded-full mb-6 flex items-center justify-center"
                style={{ backgroundColor: theme.colors.accent[100] }}
              >
                <Quote 
                  className="w-8 h-8" 
                  style={{ color: theme.colors.accent[600] }} 
                />
              </div>
              <h4 
                className="text-lg font-medium mb-2"
                style={{ color: theme.colors.gray[900] }}
              >
                Your Story Next
              </h4>
              <p 
                className="text-sm font-light"
                style={{ color: theme.colors.gray[600] }}
              >
                Join hundreds of satisfied clients
              </p>
            </div>
          </div>

        </div>

        {/* Stats Section */}
        <div
          className={`mt-16 sm:mt-20 transition-all duration-1000 ease-out delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div 
                className="text-3xl sm:text-4xl font-light mb-2"
                style={{ color: theme.colors.gray[900] }}
              >
                2.5K+
              </div>
              <div 
                className="text-sm font-light"
                style={{ color: theme.colors.gray[600] }}
              >
                Happy Clients
              </div>
            </div>
            <div>
              <div 
                className="text-3xl sm:text-4xl font-light mb-2"
                style={{ color: theme.colors.gray[900] }}
              >
                4.9
              </div>
              <div 
                className="text-sm font-light"
                style={{ color: theme.colors.gray[600] }}
              >
                Average Rating
              </div>
            </div>
            <div>
              <div 
                className="text-3xl sm:text-4xl font-light mb-2"
                style={{ color: theme.colors.gray[900] }}
              >
                98%
              </div>
              <div 
                className="text-sm font-light"
                style={{ color: theme.colors.gray[600] }}
              >
                Satisfaction Rate
              </div>
            </div>
            <div>
              <div 
                className="text-3xl sm:text-4xl font-light mb-2"
                style={{ color: theme.colors.gray[900] }}
              >
                24h
              </div>
              <div 
                className="text-sm font-light"
                style={{ color: theme.colors.gray[600] }}
              >
                Response Time
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}