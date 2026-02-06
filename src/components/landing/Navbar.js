'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { theme } from '../../lib/theme'
import {
  ChevronDown,
  X,
  Briefcase,
  Camera,
  Info,
  Mail,
  Layout,
  LogOut,
  Instagram,
  Twitter as TwitterIcon,
  Linkedin,
  User,
  UserPlus,
  Zap,
  ChevronRight,
  Globe
} from 'lucide-react'

function AuthDropdown() {
  const [showLoginMenu, setShowLoginMenu] = useState(false)
  const [showSignupMenu, setShowSignupMenu] = useState(false)
  const loginRef = useRef(null)
  const signupRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setShowLoginMenu(false)
      }
      if (signupRef.current && !signupRef.current.contains(event.target)) {
        setShowSignupMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center gap-3">
      {/* Login Dropdown */}
      <div className="relative" ref={loginRef}>
        <button
          onClick={() => {
            setShowLoginMenu(!showLoginMenu)
            setShowSignupMenu(false)
          }}
          className="px-4 py-2 rounded-full font-semibold transition-all duration-200 flex items-center gap-2 text-sm"
          style={{
            color: theme.colors.gray[700],
            fontFamily: theme.typography.fontFamily.sans.join(', ')
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.gray[100]}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span>Sign In</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showLoginMenu ? 'rotate-180' : ''}`} />
        </button>

        {showLoginMenu && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.colors.gray[500] }}>Choose Account Type</div>
            <Link
              href="/client-login"
              className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 mb-1"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[50]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => setShowLoginMenu(false)}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.colors.accent[100] }}>
                <svg className="w-5 h-5" style={{ color: theme.colors.accent[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Client Portal</div>
                <div className="text-xs" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Find photographers</div>
              </div>
            </Link>
            <Link
              href="/professional-login"
              className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.gray[50]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => setShowLoginMenu(false)}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.colors.gray[100] }}>
                <svg className="w-5 h-5" style={{ color: theme.colors.gray[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Pro Dashboard</div>
                <div className="text-xs" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Manage bookings</div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Signup Button */}
      <div className="relative" ref={signupRef}>
        <button
          onClick={() => {
            setShowSignupMenu(!showSignupMenu)
            setShowLoginMenu(false)
          }}
          className="px-6 py-2 text-white rounded-full font-semibold transition-all duration-200 flex items-center gap-2 text-sm"
          style={{ backgroundColor: theme.colors.accent[500] }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[600]}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[500]}
        >
          <span>Get Started</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSignupMenu ? 'rotate-180' : ''}`} />
        </button>

        {showSignupMenu && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
            <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.colors.gray[500] }}>Start Your Journey</div>
            <Link
              href="/client-signup"
              className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 mb-1"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[50]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => setShowSignupMenu(false)}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.colors.accent[100] }}>
                <svg className="w-5 h-5" style={{ color: theme.colors.accent[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Find Talent</div>
                <div className="text-xs" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Discover amazing photographers</div>
              </div>
            </Link>
            <Link
              href="/professional-signup"
              className="group flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.gray[50]}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => setShowSignupMenu(false)}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: theme.colors.gray[100] }}>
                <svg className="w-5 h-5" style={{ color: theme.colors.gray[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Showcase Skills</div>
                <div className="text-xs" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Build your photography business</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, userType, logout, isAuthenticated } = useAuth()

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4">
        <nav className="rounded-full border shadow-lg" style={{ backgroundColor: `${theme.colors.white}90`, borderColor: theme.colors.gray[100], backdropFilter: 'blur(12px)' }}>
          <div className="flex justify-between items-center h-16 px-6">
            {/* Logo */}
            <Link href="/" className="group flex items-center space-x-3">
              <img src="/Logo/topbar.svg" alt="Lucis" className="h-38 w-auto transition-transform duration-300 group-hover:scale-105" />
            </Link>

            {/* Center Navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {['Services', 'Professional', 'About', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="px-4 py-2 rounded-full font-semibold transition-all duration-200 text-sm"
                  style={{ color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ') }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.gray[100]}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-6">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 p-1 rounded-full border border-gray-100 bg-gray-50/50">
                  <Link
                    href={userType === 'professional' ? '/photographer' : '/client'}
                    className="px-5 py-2 rounded-full font-bold transition-all duration-200 text-sm bg-white shadow-sm border border-gray-100 hover:border-accent-200 hover:text-accent-600"
                    style={{
                      color: theme.colors.gray[700],
                      fontFamily: theme.typography.fontFamily.sans.join(', ')
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-full font-semibold transition-all duration-200 text-sm hover:bg-red-50 hover:text-red-600"
                    style={{
                      color: theme.colors.gray[500],
                      fontFamily: theme.typography.fontFamily.sans.join(', ')
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <AuthDropdown />
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-full transition-all duration-200"
              style={{ color: theme.colors.gray[600] }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.gray[100]
                e.currentTarget.style.color = theme.colors.gray[900]
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = theme.colors.gray[600]
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 right-0 h-screen w-[85%] max-w-sm bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
              style={{ height: '100dvh' }}
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between border-b border-gray-100 h-20 px-6">
                <img src="/Logo/topbar.svg" alt="Lucis" className="h-40 w-auto" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div
                className="flex-1 overflow-y-auto p-6 scrollbar-hide"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div className="space-y-8">
                  {/* Main Navigation */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 px-2">Navigation</h3>
                    <div className="space-y-1">
                      {[
                        { name: 'Services', href: '/services', icon: Briefcase },
                        { name: 'Professional', href: '/professional', icon: Camera },
                        { name: 'About', href: '/about', icon: Info },
                        { name: 'Contact', href: '/contact', icon: Mail },
                      ].map((item, i) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center justify-between p-3 rounded-2xl group hover:bg-gray-50 transition-all"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                                style={{ backgroundColor: theme.colors.gray[50], color: theme.colors.gray[400] }}
                              >
                                <item.icon className="w-5 h-5" />
                              </div>
                              <span className="font-semibold" style={{ color: theme.colors.gray[700] }}>{item.name}</span>
                            </div>
                            <ChevronRight className="w-4 h-4" style={{ color: theme.colors.gray[300] }} />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Account Section */}
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 px-2">Account</h3>
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="p-4 rounded-3xl border flex items-center gap-4" style={{ backgroundColor: theme.colors.gray[50], borderColor: theme.colors.gray[100] }}>
                          <div className="w-12 h-12 rounded-2xl bg-white border flex items-center justify-center shadow-sm" style={{ color: theme.colors.accent[600], borderColor: theme.colors.accent[100] }}>
                            <User className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="text-xs font-medium" style={{ color: theme.colors.gray[500] }}>Signed in as</div>
                            <div className="font-bold truncate" style={{ color: theme.colors.gray[900] }}>{user?.firstName}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <Link
                            href={userType === 'professional' ? '/photographer' : '/client'}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl border font-bold text-sm gap-2 transition-all shadow-sm"
                            style={{
                              backgroundColor: theme.colors.accent[50],
                              color: theme.colors.accent[600],
                              borderColor: theme.colors.accent[100]
                            }}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Layout className="w-5 h-5" />
                            Dashboard
                          </Link>
                          <button
                            onClick={() => {
                              logout()
                              setIsMenuOpen(false)
                            }}
                            className="flex flex-col items-center justify-center p-4 rounded-2xl border font-bold text-sm gap-2 transition-all shadow-sm"
                            style={{
                              backgroundColor: '#FDECEC',
                              color: '#DC2626',
                              borderColor: '#FCA5A5'
                            }}
                          >
                            <LogOut className="w-5 h-5" />
                            Logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 px-2">
                          <Link
                            href="/client-login"
                            className="flex flex-col items-center justify-center p-4 rounded-2xl font-bold text-sm gap-2 transition-all border shadow-sm"
                            style={{
                              backgroundColor: theme.colors.gray[50],
                              color: theme.colors.gray[700],
                              borderColor: theme.colors.gray[100]
                            }}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <User className="w-5 h-5" style={{ color: theme.colors.gray[400] }} />
                            Sign In
                          </Link>
                          <Link
                            href="/client-signup"
                            className="flex flex-col items-center justify-center p-4 rounded-2xl text-white font-bold text-sm gap-2 transition-all shadow-lg"
                            style={{
                              backgroundColor: theme.colors.accent[500],
                              boxShadow: `0 10px 15px -3px ${theme.colors.accent[500]}33`
                            }}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <Zap className="w-5 h-5" />
                            Join Now
                          </Link>
                        </div>
                        <p className="text-[10px] text-center font-medium px-4" style={{ color: theme.colors.gray[400] }}>
                          Join 2,000+ creators and clients globally on Lucis.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-8 border-t" style={{ backgroundColor: `${theme.colors.gray[50]}80`, borderColor: theme.colors.gray[100] }}>
                <div className="flex justify-center gap-6 mb-6">
                  {[
                    { icon: Instagram, href: '#' },
                    { icon: TwitterIcon, href: '#' },
                    { icon: Linkedin, href: '#' },
                    { icon: Globe, href: '#' }
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      className="transition-colors"
                      style={{ color: theme.colors.gray[400] }}
                      onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.accent[600]}
                      onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.gray[400]}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-xs font-medium" style={{ color: theme.colors.gray[500] }}>© 2026 Lucis Global Ltd.</p>
                  <p className="text-[10px] mt-1 uppercase tracking-widest" style={{ color: theme.colors.gray[400] }}>Premium Creative Marketplace</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
