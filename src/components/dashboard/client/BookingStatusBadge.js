import { theme } from '../../../lib/theme'

export default function BookingStatusBadge({ status, mini }) {
  const styles = {
    paid: { bg: theme.colors.primary[100], color: theme.colors.primary[700] },
    completed: { bg: theme.colors.gray[100], color: theme.colors.gray[700] },
    pending: { bg: theme.colors.accent[100], color: theme.colors.accent[800] }, 
    accepted: { bg: theme.colors.primary[100], color: theme.colors.primary[700] },
    confirmed: { bg: theme.colors.primary[100], color: theme.colors.primary[700] },
    cancelled: { bg: '#FEE2E2', color: '#B91C1C' } // Keeping red as error state
  }
  
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'
  const style = styles[status?.toLowerCase()] || styles.completed

  if (mini) {
    return (
       <span className="w-2 h-2 rounded-full" style={{ backgroundColor: style.color }} title={label}></span>
    )
  }
  
  return (
    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: style.bg, color: style.color }}>
      {label}
    </span>
  )
}
