'use client'
import { theme } from '../../lib/theme'

export default function AuthLayout({ backgroundImage, backgroundVideo, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center sm:p-6 relative" style={{ fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundVideo ? (
          <>
            <video 
              autoPlay 
              muted 
              loop 
              className="w-full h-full object-cover"
            >
              <source src={backgroundVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50"></div>
          </>
        ) : (
          <>
            <img 
              src={backgroundImage} 
              alt="Photography background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50"></div>
          </>
        )}
      </div>

      {/* Content Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full relative z-10 p-0 sm:p-8 rounded-none sm:rounded-3xl shadow-2xl"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.08)', 
        backdropFilter: 'blur(20px)', 
        border: `1px solid ${theme.colors.white}20`,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      }}>
        {children}
      </div>
    </div>
  )
}
