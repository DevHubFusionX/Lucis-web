'use client'
import { theme } from '../../lib/theme'
import { Wallet, Globe, Shield, Zap } from 'lucide-react'

export default function ProfessionalBenefits() {
  const benefits = [
    {
      title: 'Premium Earnings',
      description: 'Set your own rates and keep up to 90% of your earnings. We handle payments, so you can focus on creating.',
      icon: Wallet,
      colSpan: 'md:col-span-2',
      bg: 'bg-gradient-to-br from-white to-gray-50',
      border: 'border-gray-100'
    },
    {
      title: 'Global Reach',
      description: 'Connect with high-end clients from around the world looking for your specific style and expertise.',
      icon: Globe,
      colSpan: 'md:col-span-1',
      bg: 'bg-white',
      border: 'border-gray-100'
    },
    {
      title: 'Secure Booking',
      description: 'Protected payments and verified clients. No more chasing invoices or last-minute cancellations.',
      icon: Shield,
      colSpan: 'md:col-span-1',
      bg: 'bg-white',
      border: 'border-gray-100'
    },
    {
      title: 'Smart Tools',
      description: 'Automated scheduling, contract management, and gallery delivery all in one seamless dashboard.',
      icon: Zap,
      colSpan: 'md:col-span-2',
      bg: 'bg-gradient-to-bl from-gray-50 to-white',
      border: 'border-gray-100'
    }
  ]

  return (
    <section className="py-32 bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            Why Join <span style={{ color: theme.colors.accent[500] }}>Lucis?</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We provide the infrastructure, you provide the talent. Build your business on a platform designed for creative professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div 
                key={index}
                className={`
                  ${benefit.colSpan} ${benefit.bg} ${benefit.border}
                  group relative rounded-3xl p-8 md:p-12 overflow-hidden border shadow-sm
                  hover:shadow-xl hover:border-accent-500/30 transition-all duration-500
                `}
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-accent-50 flex items-center justify-center mb-8 text-accent-500 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 
                    className="text-2xl font-bold mb-4 text-gray-900"
                    style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
                  >
                    {benefit.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                    {benefit.description}
                  </p>
                </div>

                {/* Hover Glow */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-accent-500/5 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
