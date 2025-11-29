'use client'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, HelpCircle, Zap, Shield, Clock, DollarSign } from 'lucide-react'
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

const faqs = [
  {
    id: 1,
    category: 'Getting Started',
    icon: Zap,
    question: 'How do I find and book a photographer?',
    answer: 'Browse our curated network of photographers, view their portfolios, check availability, and book directly through our platform. You can filter by location, style, and service type.'
  },
  {
    id: 2,
    category: 'Getting Started',
    icon: Zap,
    question: 'What if I\'m a photographer looking to join?',
    answer: 'Sign up as a professional, complete your profile with portfolio samples, and start receiving booking requests. We handle all the vetting and verification.'
  },
  {
    id: 3,
    category: 'Pricing',
    icon: DollarSign,
    question: 'How much does it cost to book a photographer?',
    answer: 'Pricing varies by photographer and service type. Wedding photography ranges from $2,500-$5,000+, while portraits start at $350. Each photographer sets their own rates.'
  },
  {
    id: 4,
    category: 'Pricing',
    icon: DollarSign,
    question: 'Are there any platform fees?',
    answer: 'We charge a small service fee on bookings to maintain our platform. Photographers set their rates, and the final price is transparent before you book.'
  },
  {
    id: 5,
    category: 'Safety',
    icon: Shield,
    question: 'How do you verify photographers?',
    answer: 'All photographers undergo background checks, portfolio review, and client verification. We maintain a 4.9+ rating system to ensure quality.'
  },
  {
    id: 6,
    category: 'Safety',
    icon: Shield,
    question: 'What if I\'m not satisfied with the photos?',
    answer: 'We offer a satisfaction guarantee. If you\'re unhappy, contact us within 7 days for a full refund or photographer replacement.'
  },
  {
    id: 7,
    category: 'Timeline',
    icon: Clock,
    question: 'How long does it take to get my photos?',
    answer: 'Most photographers deliver edited photos within 2-4 weeks. Rush delivery options are available for an additional fee.'
  },
  {
    id: 8,
    category: 'Timeline',
    icon: Clock,
    question: 'Can I book a photographer on short notice?',
    answer: 'Yes! Many photographers accept last-minute bookings. Use our availability filter to find photographers available for your date.'
  }
]

const categories = ['Getting Started', 'Pricing', 'Safety', 'Timeline']

export default function FAQ() {
  const [sectionRef, isVisible] = useIsVisible(0.1)
  const [expandedId, setExpandedId] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('Getting Started')

  const filteredFaqs = faqs.filter(faq => faq.category === selectedCategory)

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br" style={{ 
        backgroundImage: `linear-gradient(to bottom right, ${theme.colors.neutral.warmGray}, ${theme.colors.white})`
      }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div 
          className={`text-center mb-16 sm:mb-20 transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full" style={{ backgroundColor: theme.colors.accent[50] }}>
            <HelpCircle className="w-4 h-4" style={{ color: theme.colors.accent[500] }} />
            <span className="text-xs font-medium tracking-[0.2em] uppercase" style={{ color: theme.colors.accent[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
              FAQ
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mt-4 mb-6" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.display.join(', ') }}>
            Questions? We Have <span style={{ color: theme.colors.accent[500] }}>Answers</span>
          </h2>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
            Everything you need to know about booking and managing photography services
          </p>
        </div>

        {/* Category Tabs */}
        <div className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '100ms' }}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? 'shadow-lg scale-105'
                  : 'hover:shadow-md'
              }`}
              style={{
                backgroundColor: selectedCategory === category ? theme.colors.accent[500] : theme.colors.white,
                color: selectedCategory === category ? 'white' : theme.colors.gray[700],
                borderWidth: selectedCategory === category ? '0' : '2px',
                borderColor: selectedCategory === category ? 'transparent' : theme.colors.gray[100],
                fontFamily: theme.typography.fontFamily.sans.join(', ')
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className={`space-y-4 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`} style={{ transitionDelay: '200ms' }}>
          {filteredFaqs.map((faq, idx) => {
            const Icon = faq.icon
            const isExpanded = expandedId === faq.id

            return (
              <div
                key={faq.id}
                className={`group relative rounded-2xl border-2 overflow-hidden transition-all duration-500 ${
                  isExpanded ? 'shadow-lg' : 'shadow-sm hover:shadow-md'
                }`}
                style={{
                  borderColor: isExpanded ? theme.colors.accent[200] : theme.colors.gray[100],
                  backgroundColor: isExpanded ? theme.colors.accent[50] : theme.colors.white,
                  transitionDelay: `${idx * 50}ms`
                }}
              >
                {/* Question Button */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                  className="w-full p-6 sm:p-8 flex items-start gap-4 text-left transition-all duration-300"
                >
                  {/* Icon */}
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300"
                    style={{
                      backgroundColor: isExpanded ? theme.colors.accent[200] : theme.colors.accent[50],
                      color: isExpanded ? theme.colors.accent[700] : theme.colors.accent[500]
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Question & Chevron */}
                  <div className="flex-1 min-w-0">
                    <h3 
                      className="text-lg sm:text-xl font-semibold mb-1 transition-colors duration-300"
                      style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.display.join(', ') }}
                    >
                      {faq.question}
                    </h3>
                    {!isExpanded && (
                      <p 
                        className="text-sm font-light line-clamp-1"
                        style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}
                      >
                        {faq.answer}
                      </p>
                    )}
                  </div>

                  <ChevronDown 
                    className={`w-5 h-5 flex-shrink-0 mt-1 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}
                    style={{ color: theme.colors.accent[500] }}
                  />
                </button>

                {/* Answer */}
                {isExpanded && (
                  <div 
                    className="px-6 sm:px-8 pb-6 sm:pb-8 border-t-2 animate-slideDown"
                    style={{ borderColor: theme.colors.accent[200] }}
                  >
                    <p 
                      className="text-base font-light leading-relaxed"
                      style={{ color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ') }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div 
          className={`mt-16 text-center transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <p 
            className="text-base font-light mb-6"
            style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}
          >
            Still have questions?
          </p>
          <a
            href="mailto:support@lucis.com"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105"
            style={{ backgroundColor: theme.colors.accent[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}
          >
            Contact Support
          </a>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </section>
  )
}
