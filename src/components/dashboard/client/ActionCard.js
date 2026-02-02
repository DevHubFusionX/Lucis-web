import { ArrowRight } from 'lucide-react'
import { theme } from '../../../lib/theme'

export default function ActionCard({ icon: Icon, label, subtext, buttonText, buttonStyle, onClick }) {
  return (
    <div className="bg-white p-6 rounded-lg border flex flex-col h-full" style={{ borderColor: theme.colors.gray[200] }}>
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: theme.colors.primary[50] }}>
        <Icon size={22} style={{ color: theme.colors.primary[700] }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: theme.typography.fontFamily.sans.join(', '), color: theme.colors.gray[900] }}>
        {label}
      </h3>
      <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: theme.colors.gray[500] }}>
        {subtext}
      </p>
      <button onClick={onClick} className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: buttonStyle?.backgroundColor || theme.colors.primary[700] }}>
        {buttonText}
        <ArrowRight size={16} />
      </button>
    </div>
  )
}
