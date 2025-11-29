'use client'
import { useRef, useEffect, useState } from 'react'
import { theme } from '@/lib/theme'

function useIsVisible (threshold = 0.1) {
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

const steps = [
  {
    num: '01',
    title: 'Browse & Select',
    desc: 'Explore our curated network of professional photographers',
    image: '/Hero-image.jpeg'
  },
  {
    num: '02',
    title: 'Book & Connect',
    desc: 'Schedule your session and discuss your vision',
    image: '/Hero-image3.webp'
  },
  {
    num: '03',
    title: 'Capture Moments',
    desc: 'Professional photography session with artistic precision',
    image: '/Hero-image4.webp'
  },
  {
    num: '04',
    title: 'Receive & Share',
    desc: 'Get your edited photos delivered to your gallery',
    image: '/Hero-image14.jpg'
  }
]

export default function HowItWorks () {
  const [sectionRef, isVisible] = useIsVisible(0.1)

  return (
    <section
      ref={sectionRef}
      id='how-it-works'
      className='py-24 overflow-hidden'
      style={{ backgroundColor: theme.colors.white }}
    >
      <div
        className='absolute inset-0 bg-gradient-to-br'
        style={{
          backgroundImage: `linear-gradient(to bottom right, ${theme.colors.neutral.warmGray}, ${theme.colors.white})`
        }}
      />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12'>
        <div
          className={`text-center mb-20 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <h2
            className='text-4xl sm:text-5xl lg:text-6xl font-light leading-tight'
            style={{
              color: theme.colors.gray[900],
              fontFamily: theme.typography.fontFamily.display.join(', ')
            }}
          >
            How It{' '}
            <span style={{ color: theme.colors.accent[500] }}>Works</span>
          </h2>
        </div>

        {/* Desktop Grid */}
        <div className='hidden md:grid md:grid-cols-2 gap-8'>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-3xl h-80 transition-all duration-1000 ease-out ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <img
                src={step.image}
                alt={step.title}
                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
              <div className='absolute inset-0 p-8 flex flex-col justify-end'>
                <div
                  className='text-6xl font-light mb-4'
                  style={{ color: `${theme.colors.white}30` }}
                >
                  {step.num}
                </div>
                <h3
                  className='text-2xl font-semibold mb-2'
                  style={{
                    color: theme.colors.white,
                    fontFamily: theme.typography.fontFamily.display.join(', ')
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    color: theme.colors.gray[200],
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Timeline */}
        <div className='md:hidden space-y-8'>
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex gap-4 transition-all duration-1000 ease-out ${
                isVisible
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Timeline dot and line */}
              <div className='flex flex-col items-center'>
                <div
                  className='w-12 h-12 rounded-full flex items-center justify-center font-light text-lg flex-shrink-0'
                  style={{
                    backgroundColor: theme.colors.accent[500],
                    color: theme.colors.white
                  }}
                >
                  {step.num}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className='w-1 h-16 mt-2'
                    style={{ backgroundColor: theme.colors.accent[200] }}
                  />
                )}
              </div>

              {/* Content card */}
              <div className='flex-1 pt-1'>
                <div className='rounded-2xl overflow-hidden h-56 relative group'>
                  <img
                    src={step.image}
                    alt={step.title}
                    className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent' />
                  <div className='absolute inset-0 p-4 flex flex-col justify-end'>
                    <h3
                      className='text-lg font-semibold mb-1'
                      style={{
                        color: theme.colors.white,
                        fontFamily: theme.typography.fontFamily.display.join(', ')
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className='text-xs leading-relaxed'
                      style={{
                        color: theme.colors.gray[200],
                        fontFamily: theme.typography.fontFamily.sans.join(', ')
                      }}
                    >
                      {step.desc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
