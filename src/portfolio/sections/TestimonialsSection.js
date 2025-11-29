import { useState } from 'react'

export default function TestimonialsSection({ config, professional, theme }) {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  
  const testimonials = config.testimonials || [
    {
      name: 'Sarah Johnson',
      role: 'Bride',
      content: 'Absolutely incredible work! Every photo tells a story and captures the emotion perfectly. Our wedding photos exceeded all expectations.',
      rating: 5,
      image: '/api/placeholder/80/80'
    },
    {
      name: 'Michael Chen',
      role: 'CEO, Tech Corp',
      content: 'Professional, creative, and delivered exactly what we needed for our corporate event. The team was fantastic to work with.',
      rating: 5,
      image: '/api/placeholder/80/80'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Model',
      content: 'The portrait session was amazing. The photographer made me feel comfortable and the results speak for themselves. Highly recommended!',
      rating: 5,
      image: '/api/placeholder/80/80'
    }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className={`py-20 px-4 ${theme.background}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${theme.text} mb-6`}>
            What Clients Say
          </h2>
          <p className={`text-lg ${theme.text} opacity-80`}>
            Don't just take my word for it - hear from the amazing people I've had the pleasure to work with.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <div className={`p-8 md:p-12 border ${theme.border} rounded-2xl ${theme.background} text-center`}>
            {/* Quote Icon */}
            <div className={`w-16 h-16 ${theme.accent} bg-current/10 rounded-full flex items-center justify-center mx-auto mb-8`}>
              <svg className={`w-8 h-8 ${theme.accent}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>

            {/* Testimonial Content */}
            <blockquote className={`text-xl md:text-2xl ${theme.text} leading-relaxed mb-8 italic`}>
              "{testimonials[currentTestimonial].content}"
            </blockquote>

            {/* Rating */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < testimonials[currentTestimonial].rating ? theme.accent : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Client Info */}
            <div className="flex items-center justify-center gap-4">
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <div className={`font-semibold ${theme.text}`}>
                  {testimonials[currentTestimonial].name}
                </div>
                <div className={`text-sm ${theme.text} opacity-70`}>
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 ${theme.accent} bg-current/10 rounded-full flex items-center justify-center hover:bg-current/20 transition-colors`}
          >
            <svg className={`w-6 h-6 ${theme.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextTestimonial}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 ${theme.accent} bg-current/10 rounded-full flex items-center justify-center hover:bg-current/20 transition-colors`}
          >
            <svg className={`w-6 h-6 ${theme.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentTestimonial ? theme.accent : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}