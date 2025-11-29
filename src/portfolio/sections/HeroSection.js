export default function HeroSection({ config, professional, theme, globalSettings, spacingClass }) {
  const name = config.name || `${professional?.firstName || ''} ${professional?.lastName || ''}`.trim() || 'Professional Photographer'
  const tagline = config.tagline || professional?.bio || 'Wedding & Event Photographer'
  const location = config.location || professional?.baseCity || 'Location'
  const headerStyle = config.headerStyle || 'hero'
  const alignment = config.alignment || 'center'
  const coverPhoto = config.coverPhoto
  
  // Use global settings
  const buttonStyle = globalSettings?.buttonStyle || 'rounded'
  const primaryColor = globalSettings?.primaryColor || '#3B82F6'

  const getBackgroundClass = () => {
    switch (backgroundStyle) {
      case 'gradient':
        return 'bg-gradient-to-br from-gray-900 via-gray-800 to-black'
      case 'solid':
        return 'bg-gray-900'
      default:
        return 'bg-gray-900'
    }
  }

  const getAlignmentClass = () => {
    return alignment === 'left' ? 'text-left' : 'text-center'
  }

  const getHeaderClass = () => {
    switch (headerStyle) {
      case 'simple':
        return 'py-16'
      case 'card':
        return 'py-20 bg-gray-50'
      default:
        return 'min-h-screen flex items-center justify-center bg-gray-900'
    }
  }

  return (
    <section 
      className={`relative ${getHeaderClass()} ${spacingClass || ''}`}
      style={{ backgroundColor: theme.background }}
    >
      {/* Cover Photo */}
      {coverPhoto && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${URL.createObjectURL(coverPhoto)})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 ${getAlignmentClass()} px-4 max-w-4xl mx-auto`}>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
          {name}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          {tagline}
        </p>
        
        {/* CTA Buttons */}
        <div className={`flex flex-col sm:flex-row gap-4 mb-8 ${alignment === 'left' ? 'justify-start' : 'justify-center'}`}>
          <button 
            className="px-8 py-4 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            Book Now
          </button>
          <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors">
            Contact
          </button>
        </div>

        {/* Skills */}
        {professional?.skills?.length > 0 && (
          <div className="mt-12">
            <div className="flex flex-wrap justify-center gap-3">
              {professional.skills.slice(0, 4).map((skill, index) => (
                <span 
                  key={index}
                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm border border-white/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  )
}