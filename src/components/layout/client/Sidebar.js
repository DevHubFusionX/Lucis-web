import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { theme } from '../../../lib/theme'
import { clientNavigation } from './navigation'
import NavItem from './NavItem'

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside 
      className="hidden md:block fixed inset-y-0 left-0 z-50 w-64 text-gray-400 md:static md:inset-0"
      style={{ backgroundColor: theme.colors.neutral.deepGray }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center h-20 px-6 border-b border-gray-800/50">
           <Link href="/client" className="flex items-center">
              <img 
                src="/Logo/logo.svg" 
                alt="Logo" 
                className="h-70 w-auto"
              />
           </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {clientNavigation.map((item) => (
            <NavItem 
              key={item.name} 
              item={item} 
              isActive={pathname === item.href} 
            />
          ))}
        </div>
      </div>
    </aside>
  )
}
