import Link from 'next/link'
import { theme } from '../../../lib/theme'

export default function NavItem({ item, isActive, isMobile = false }) {
  const Icon = item.icon

  if (isMobile) {
    return (
      <Link
        href={item.href}
        className={`flex flex-col items-center justify-center min-w-[4.5rem] py-3 px-1 transition-colors ${
          isActive ? 'text-white' : 'text-gray-400'
        }`}
      >
        <Icon 
          size={20} 
          style={{ color: isActive ? theme.colors.accent[500] : 'currentColor', marginBottom: '4px' }} 
        />
        <span className="text-[10px] font-medium truncate w-full text-center">
          {item.name}
        </span>
      </Link>
    )
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        isActive 
          ? 'text-white bg-white/10' 
          : 'hover:text-white hover:bg-white/5'
      }`}
      style={isActive ? { borderLeft: `3px solid ${theme.colors.accent[500]}` } : { borderLeft: '3px solid transparent' }}
    >
      <Icon size={18} style={{ color: isActive ? theme.colors.accent[500] : 'currentColor' }} />
      <span>{item.name}</span>
    </Link>
  )
}
