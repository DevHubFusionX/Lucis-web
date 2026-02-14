'use client'
import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Mail, ArrowRight, Instagram, Twitter, Facebook } from 'lucide-react'
import { theme } from '@/lib/theme'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Handle newsletter signup
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  // Static map locations with photographers
  const photographerLocations = [
    { city: 'San Francisco', count: 125, top: '35%', left: '15%' },
    { city: 'New York', count: 200, top: '28%', left: '85%' },
    { city: 'Los Angeles', count: 180, top: '60%', left: '20%' },
    { city: 'Austin', count: 95, top: '65%', left: '55%' },
    { city: 'Seattle', count: 110, top: '15%', left: '18%' }
  ]

  return (
    <footer className="relative bg-white border-t border-gray-100 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.4]" />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Main Footer Content - Map + Newsletter */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 py-16 sm:py-20 lg:py-24">
          
          {/* Left - Map Illustration */}
          <div className="relative order-2 lg:order-1">
            <div className="mb-8 text-center lg:text-left">
              <h3 
                className="text-2xl sm:text-3xl lg:text-4xl font-light mb-3 tracking-tight"
                style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.display.join(', ') }}
              >
                Find Photographers{' '}
                <span style={{ color: theme.colors.accent[500] }} className="italic">
                  Near You
                </span>
              </h3>
              <p 
                className="text-sm sm:text-base font-light max-w-md mx-auto lg:mx-0"
                style={{ color: theme.colors.gray[600] }}
              >
                Thousands of verified professionals across the country, ready to capture your moments.
              </p>
            </div>

            {/* Map Container - Taller on desktop, square on mobile */}
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-[16/10] rounded-2xl lg:rounded-3xl overflow-hidden border border-gray-100 shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
              {/* Map Background */}
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.colors.gray[50]} 0%, ${theme.colors.gray[100]} 100%)` }}>
                {/* Map Grid */}
                <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-footer" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke={theme.colors.gray[300]} strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-footer)" />
                </svg>

                {/* USA Path */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] p-8">
                  <svg viewBox="0 0 200 120" className="w-full h-full" fill={theme.colors.gray[900]}>
                    <path d="M20,40 L30,35 L45,30 L60,35 L75,30 L90,35 L105,30 L120,25 L135,30 L150,35 L165,40 L175,50 L180,60 L175,75 L165,85 L150,90 L135,95 L120,90 L105,95 L90,100 L75,95 L60,100 L45,95 L30,90 L20,80 L15,65 L20,50 Z" />
                  </svg>
                </div>
              </div>

              {/* Pins */}
              {photographerLocations.map((location, index) => (
                <div
                  key={index}
                  className="absolute group"
                  style={{ top: location.top, left: location.left }}
                >
                  <div 
                    className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-lg transition-all duration-500 cursor-pointer group-hover:scale-125"
                    style={{ backgroundColor: theme.colors.accent[500] }}
                  >
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: theme.colors.accent[500] }} />
                  </div>

                  {/* Enhanced Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 rounded-xl shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none backdrop-blur-md"
                    style={{ backgroundColor: 'rgba(12, 12, 13, 0.9)' }}
                  >
                    <p className="text-xs font-medium text-white mb-0.5">{location.city}</p>
                    <p className="text-[10px] text-gray-400 capitalize">{location.count} professionals</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" style={{ backgroundColor: 'rgba(12, 12, 13, 0.9)' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Map Stats - Hidden on tiny mobile, visible on sm+ */}
            <div className="grid grid-cols-3 gap-8 mt-10">
              {[
                { label: 'Photographers', val: '2.5K+' },
                { label: 'States Coverage', val: '50+' },
                { label: 'Cities Present', val: '200+' }
              ].map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="text-xl sm:text-2xl font-light mb-1 transition-colors duration-300 group-hover:text-accent-500" style={{ color: theme.colors.gray[900] }}>
                    {stat.val}
                  </div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest font-medium" style={{ color: theme.colors.gray[400] }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Newsletter + Links */}
          <div className="space-y-16 order-1 lg:order-2">
            {/* Newsletter Section */}
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="mb-8 text-center lg:text-left">
                <h3 className="text-xl sm:text-2xl font-light mb-3 tracking-tight" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.display.join(', ') }}>
                  The Lucis Newsletter
                </h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: theme.colors.gray[600] }}>
                  Curation of exceptional photography, professional resources, and exclusive community updates.
                </p>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors" style={{ color: theme.colors.gray[400] }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-100 text-sm font-light focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500 transition-all bg-gray-50/30"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white text-sm font-medium transition-all duration-300 hover:shadow-xl active:scale-95 group"
                  style={{ backgroundColor: theme.colors.accent[500] }}
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-8">
              {/* Category: Services */}
              <div className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.colors.gray[900] }}>Services</h4>
                <ul className="space-y-4">
                  {['Wedding', 'Portrait', 'Events', 'Commercial'].map((item) => (
                    <li key={item}>
                      <Link href={`/services/${item.toLowerCase()}`} className="text-sm font-light transition-all hover:pl-2" style={{ color: theme.colors.gray[500] }}>
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Category: Company */}
              <div className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.colors.gray[900] }}>Company</h4>
                <ul className="space-y-4">
                  {['About', 'Careers', 'Blog', 'Contact'].map((item) => (
                    <li key={item}>
                      <Link href={`/${item.toLowerCase()}`} className="text-sm font-light transition-all hover:pl-2" style={{ color: theme.colors.gray[500] }}>
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support/Social on Tablet+ */}
              <div className="hidden sm:block space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: theme.colors.gray[900] }}>Connect</h4>
                <ul className="space-y-4">
                  {['Instagram', 'Twitter', 'Facebook'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-sm font-light transition-all hover:pl-2" style={{ color: theme.colors.gray[500] }}>
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-10 border-t flex flex-col md:flex-row justify-between items-center gap-8" style={{ borderColor: theme.colors.gray[100] }}>
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-2xl font-light tracking-tighter" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.display.join(', ') }}>
              Lucis
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: theme.colors.gray[400] }}>
              &copy; {new Date().getFullYear()} Lucis Photography Network
            </p>
          </div>

          {/* Social Links - Mobile Friendly */}
          <div className="flex items-center gap-3">
            {[
              { icon: Instagram, label: 'Instagram' },
              { icon: Twitter, label: 'Twitter' },
              { icon: Facebook, label: 'Facebook' }
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                className="w-11 h-11 rounded-full flex items-center justify-center border border-gray-100 transition-all duration-500 hover:bg-gray-900 group"
                aria-label={label}
              >
                <Icon className="w-4 h-4 transition-colors group-hover:text-white" style={{ color: theme.colors.gray[600] }} />
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex gap-6">
            {['Privacy', 'Terms'].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="text-[10px] font-medium uppercase tracking-widest transition-colors hover:text-accent-500" style={{ color: theme.colors.gray[400] }}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
