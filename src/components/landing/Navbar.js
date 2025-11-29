'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'
import { theme } from '../../lib/theme'
import { ChevronDown } from 'lucide-react'

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
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl px-4">
        <nav className="rounded-full border shadow-lg" style={{ backgroundColor: `${theme.colors.white}90`, borderColor: theme.colors.gray[100], backdropFilter: 'blur(12px)' }}>
          <div className="flex justify-between items-center h-16 px-6">
            {/* Logo */}
            <Link href="/" className="group flex items-center space-x-3">
              <img src="/Logo/Navbar.svg" alt="Lucis" className="h-8 w-auto transition-transform duration-300 group-hover:scale-105" />
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
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Welcome, {user?.firstName}</span>
                  <button
                    onClick={logout}
                    className="font-semibold transition-colors text-sm"
                    style={{ color: theme.colors.gray[700], fontFamily: theme.typography.fontFamily.sans.join(', ') }}
                    onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.gray[900]}
                    onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.gray[700]}
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
      {isMenuOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsMenuOpen(false)} />
          <div className="lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform translate-x-0 transition-transform duration-300 overflow-y-auto" style={{ backdropFilter: 'blur(12px)' }}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <img src="/Logo/Navbar.svg" alt="Lucis" className="h-8 w-auto" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full transition-all duration-200"
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider px-4 mb-3" style={{ color: theme.colors.gray[500] }}>Navigation</div>
                  {['Services', 'Professional', 'About', 'Contact'].map((item) => (
                    <Link 
                      key={item}
                      href={`/${item.toLowerCase()}`} 
                      className="flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm"
                      style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.gray[100]
                        e.currentTarget.style.color = theme.colors.gray[900]
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = theme.colors.gray[600]
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
                
                {isAuthenticated ? (
                  <div className="border-t pt-6" style={{ borderColor: theme.colors.gray[200] }}>
                    <div className="text-sm font-semibold px-4 py-2" style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Welcome, {user?.firstName}</div>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm"
                      style={{ color: theme.colors.gray[600], fontFamily: theme.typography.fontFamily.sans.join(', ') }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = theme.colors.gray[100]
                        e.currentTarget.style.color = theme.colors.gray[900]
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.color = theme.colors.gray[600]
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="border-t pt-6 space-y-4" style={{ borderColor: theme.colors.gray[200] }}>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider px-4 mb-3" style={{ color: theme.colors.gray[500] }}>Sign In</div>
                      <Link href="/client-login" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-2" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[50]} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => setIsMenuOpen(false)}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.colors.accent[100] }}>
                          <svg className="w-4 h-4" style={{ color: theme.colors.accent[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Client Login</div>
                          <div className="text-xs" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Find photographers</div>
                        </div>
                      </Link>
                      <Link href="/professional-login" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.gray[50]} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => setIsMenuOpen(false)}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.colors.gray[100] }}>
                          <svg className="w-4 h-4" style={{ color: theme.colors.gray[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Professional Login</div>
                          <div className="text-xs" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Manage bookings</div>
                        </div>
                      </Link>
                    </div>
                    
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider px-4 mb-3" style={{ color: theme.colors.gray[500] }}>Get Started</div>
                      <Link href="/client-signup" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-2" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.accent[50]} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => setIsMenuOpen(false)}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.colors.accent[100] }}>
                          <svg className="w-4 h-4" style={{ color: theme.colors.accent[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Join as Client</div>
                          <div className="text-xs" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Discover photographers</div>
                        </div>
                      </Link>
                      <Link href="/professional-signup" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200" style={{ backgroundColor: 'transparent' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.gray[50]} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'} onClick={() => setIsMenuOpen(false)}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.colors.gray[100] }}>
                          <svg className="w-4 h-4" style={{ color: theme.colors.gray[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: theme.colors.gray[900], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Join as Photographer</div>
                          <div className="text-xs" style={{ color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Build your business</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
