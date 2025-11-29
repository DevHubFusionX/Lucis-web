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
      {/* Subtle Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Main Footer Content - Map + Newsletter */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 py-16 sm:py-20 lg:py-24">
          
          {/* Left - Static Map Illustration */}
          <div className="relative">
            <div className="mb-6">
              <h3 
                className="text-2xl sm:text-3xl font-light mb-2"
                style={{ color: theme.colors.gray[900] }}
              >
                Find Photographers{' '}
                <span style={{ color: theme.colors.accent[500] }} className="font-light italic font-serif">
                  Near You
                </span>
              </h3>
              <p 
                className="text-sm font-light"
                style={{ color: theme.colors.gray[600] }}
              >
                Thousands of verified professionals across the country
              </p>
            </div>

            {/* Map Container */}
            <div className="relative aspect-[4/3] rounded-2xl lg:rounded-3xl overflow-hidden border-2 shadow-lg" style={{ borderColor: theme.colors.gray[100] }}>
              {/* Map Background - Simple gradient to represent map */}
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.colors.gray[50]} 0%, ${theme.colors.gray[100]} 100%)` }}>
                {/* Map Grid Lines */}
                <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke={theme.colors.gray[300]} strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Simple USA Outline Illustration */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <svg viewBox="0 0 200 120" className="w-4/5 h-4/5" fill={theme.colors.gray[400]}>
                    <path d="M20,40 L30,35 L45,30 L60,35 L75,30 L90,35 L105,30 L120,25 L135,30 L150,35 L165,40 L175,50 L180,60 L175,75 L165,85 L150,90 L135,95 L120,90 L105,95 L90,100 L75,95 L60,100 L45,95 L30,90 L20,80 L15,65 L20,50 Z" />
                  </svg>
                </div>
              </div>

              {/* Location Pins */}
              {photographerLocations.map((location, index) => (
                <div
                  key={index}
                  className="absolute group cursor-pointer"
                  style={{ top: location.top, left: location.left }}
                >
                  {/* Pin */}
                  <div 
                    className="relative flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: theme.colors.accent[500] }}
                  >
                    <MapPin className="w-5 h-5 text-white" />
                    
                    {/* Pulse Animation */}
                    <div 
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ backgroundColor: theme.colors.accent[500] }}
                    />
                  </div>

                  {/* Tooltip */}
                  <div 
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundColor: theme.colors.gray[900] }}
                  >
                    <p className="text-xs font-medium text-white">
                      {location.city}
                    </p>
                    <p className="text-xs text-gray-300">
                      {location.count} photographers
                    </p>
                    <div 
                      className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45"
                      style={{ backgroundColor: theme.colors.gray[900] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Map Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div 
                  className="text-2xl font-light mb-1"
                  style={{ color: theme.colors.gray[900] }}
                >
                  2.5K+
                </div>
                <div 
                  className="text-xs font-light"
                  style={{ color: theme.colors.gray[600] }}
                >
                  Photographers
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-2xl font-light mb-1"
                  style={{ color: theme.colors.gray[900] }}
                >
                  50+
                </div>
                <div 
                  className="text-xs font-light"
                  style={{ color: theme.colors.gray[600] }}
                >
                  States
                </div>
              </div>
              <div className="text-center">
                <div 
                  className="text-2xl font-light mb-1"
                  style={{ color: theme.colors.gray[900] }}
                >
                  200+
                </div>
                <div 
                  className="text-xs font-light"
                  style={{ color: theme.colors.gray[600] }}
                >
                  Cities
                </div>
              </div>
            </div>
          </div>

          {/* Right - Newsletter + Links */}
          <div className="space-y-10">
            {/* Newsletter */}
            <div>
              <div className="mb-6">
                <h3 
                  className="text-xl sm:text-2xl font-light mb-2"
                  style={{ color: theme.colors.gray[900] }}
                >
                  Stay Updated
                </h3>
                <p 
                  className="text-sm font-light"
                  style={{ color: theme.colors.gray[600] }}
                >
                  Get the latest photography tips and exclusive offers
                </p>
              </div>

              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Mail 
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                    style={{ color: theme.colors.gray[400] }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-full border-2 text-sm font-light focus:outline-none focus:border-gray-300 transition-colors"
                    style={{ 
                      borderColor: theme.colors.gray[200],
                      color: theme.colors.gray[900]
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white text-sm font-medium transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: theme.colors.accent[500] }}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Links Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* Services */}
              <div>
                <h4 
                  className="text-sm font-medium mb-4"
                  style={{ color: theme.colors.gray[900] }}
                >
                  Services
                </h4>
                <ul className="space-y-2.5">
                  {['Wedding', 'Portrait', 'Events', 'Commercial'].map((item) => (
                    <li key={item}>
                      <Link 
                        href={`/services/${item.toLowerCase()}`}
                        className="text-sm font-light transition-colors"
                        style={{ color: theme.colors.gray[600] }}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 
                  className="text-sm font-medium mb-4"
                  style={{ color: theme.colors.gray[900] }}
                >
                  Company
                </h4>
                <ul className="space-y-2.5">
                  {['About', 'Careers', 'Blog', 'Contact'].map((item) => (
                    <li key={item}>
                      <Link 
                        href={`/${item.toLowerCase()}`}
                        className="text-sm font-light transition-colors"
                        style={{ color: theme.colors.gray[600] }}
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Legal Links */}
            <div className="pt-6 border-t" style={{ borderColor: theme.colors.gray[100] }}>
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {['Privacy', 'Terms', 'Cookies'].map((item) => (
                  <li key={item}>
                    <Link 
                      href={`/${item.toLowerCase()}`}
                      className="text-xs font-light transition-colors"
                      style={{ color: theme.colors.gray[500] }}
                    >
                      {item} Policy
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div 
          className="py-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderColor: theme.colors.gray[100] }}
        >
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span 
              className="text-xl font-light tracking-tight"
              style={{ color: theme.colors.gray[900] }}
            >
              Lucis
            </span>
            <span 
              className="text-xs font-light"
              style={{ color: theme.colors.gray[500] }}
            >
              © {new Date().getFullYear()}
            </span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {[
              { icon: Instagram, label: 'Instagram' },
              { icon: Twitter, label: 'Twitter' },
              { icon: Facebook, label: 'Facebook' }
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 hover:scale-110"
                style={{ 
                  borderColor: theme.colors.gray[200],
                  color: theme.colors.gray[600]
                }}
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
