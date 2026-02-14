'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { theme } from '../../../lib/theme'
import { clientNavigation } from './navigation'
import { useNotify } from '../../../stores/useNotificationStore'

export default function MobileNav() {
  const pathname = usePathname()
  const notify = useNotify()

  const handleNavClick = (e, item) => {
    if (item.comingSoon) {
      e.preventDefault()
      notify.info('This feature is coming soon!', 'Coming Soon')
    }
  }

  // Select specific 5 items for the bottom nav
  const navItems = [
    clientNavigation.find(i => i.name === 'Dashboard'),
    clientNavigation.find(i => i.name === 'My Bookings'),
    clientNavigation.find(i => i.name === 'Book a Photographer'), // This will be the center FAB
    clientNavigation.find(i => i.name === 'Messages'),
    clientNavigation.find(i => i.name === 'Settings'),
  ].filter(Boolean)

  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-10" style={{ fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
      {/* Semi-floating Bar with Glassmorphism */}
      <nav
        className="relative backdrop-blur-xl border rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-2"
        style={{
          height: '74px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderColor: 'rgba(255, 255, 255, 0.3)'
        }}
      >
        <div className="flex items-center justify-between h-full relative">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            const isCenter = index === 2 // Middle item is the FAB

            if (isCenter) {
              return (
                <div key={item.name} className="relative flex-1 flex flex-col items-center justify-center">
                  {/* Floating Action Button */}
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className="absolute -top-12 w-16 h-16 rounded-full shadow-[0_8px_24px_rgba(255,107,107,0.4)] flex items-center justify-center transition-all duration-300 active:scale-90 hover:scale-105"
                    style={{
                      backgroundColor: '#FF6B6B', // Custom warm coral accent as requested
                      border: '4px solid white',
                      zIndex: 20
                    }}
                  >
                    <Icon size={28} className="text-white" />
                  </Link>
                  <span className="text-[10px] font-bold mt-8 uppercase tracking-tighter" style={{ color: theme.colors.gray[500] }}>
                    {item.label}
                  </span>
                </div>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className="flex-1 flex flex-col items-center justify-center transition-all duration-200 active:scale-90"
                style={{ color: isActive ? theme.colors.primary[900] : theme.colors.gray[400] }}
              >
                <div className="relative">
                  <Icon
                    size={20}
                    className="transition-colors duration-200"
                    style={{ color: isActive ? theme.colors.accent[600] : 'currentColor' }}
                  />
                  {isActive && (
                    <div
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: theme.colors.accent[500] }}
                    />
                  )}
                </div>
                <span
                  className="text-[10px] font-bold mt-1 transition-colors duration-200"
                  style={{ color: isActive ? theme.colors.primary[900] : theme.colors.gray[500] }}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
