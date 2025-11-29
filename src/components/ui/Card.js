export default function Card({ children, className = '', hover = true }) {
  return (
    <div 
      className={`
        bg-white rounded-2xl border border-gray-100 p-6
        ${hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : 'shadow-sm'}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
