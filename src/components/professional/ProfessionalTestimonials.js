'use client'
import { useState } from 'react'
import { theme } from '../../lib/theme'
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProfessionalTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const testimonials = [
    {
      quote: "Lucis completely transformed how I run my photography business. The clients are premium, the payments are instant, and the platform is stunning.",
      author: "Sarah Mitchell",
      role: "Fashion Photographer",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    },
    {
      quote: "Finally, a platform that respects the artist. The creative freedom and support I get here is unmatched in the industry.",
      author: "David Chen",
      role: "Documentary Filmmaker",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    {
      quote: "I've doubled my booking rate since joining. The tools provided let me focus on shooting rather than administrative headaches.",
      author: "Elena Rodriguez",
      role: "Wedding Photographer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
    }
  ]

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-32 bg-white text-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-50 pointer-events-none" 
        style={{ 
          backgroundImage: `radial-gradient(${theme.colors.gray[100]} 1px, transparent 1px)`,
          backgroundSize: '32px 32px' 
        }} 
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <Quote className="w-12 h-12 text-accent-500 mx-auto mb-6 opacity-80" />
        </div>

        <div className="relative min-h-[300px]">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-out flex flex-col items-center text-center
                ${index === activeIndex ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-20 scale-95 pointer-events-none'}
              `}
            >
              <p 
                className="text-2xl md:text-4xl font-light leading-relaxed mb-8 text-gray-900"
                style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
              >
                "{item.quote}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={item.image} 
                  alt={item.author} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-accent-500"
                />
                <div className="text-left">
                  <div className="font-bold text-gray-900">{item.author}</div>
                  <div className="text-sm text-accent-600 font-medium">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-12">
          <button 
            onClick={prev}
            className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={next}
            className="p-3 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  )
}
