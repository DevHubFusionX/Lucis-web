export default function PackagesSection({ config, professional, theme }) {
  const sectionTitle = config.sectionTitle || 'Packages'
  const packages = config.packages || [
    {
      id: 1,
      name: 'Basic Package',
      price: '₦75,000',
      duration: '2 hours',
      description: 'Perfect for small events and portrait sessions',
      deliverables: ['20 edited photos', 'Online gallery', '48hr delivery', 'Print release']
    },
    {
      id: 2,
      name: 'Premium Package',
      price: '₦150,000',
      duration: '4 hours',
      description: 'Comprehensive coverage for weddings and major events',
      deliverables: ['50 edited photos', 'Online gallery', '24hr delivery', 'Print release', 'USB drive']
    },
    {
      id: 3,
      name: 'Deluxe Package',
      price: '₦250,000',
      duration: '8 hours',
      description: 'Full day coverage with premium editing and extras',
      deliverables: ['100+ edited photos', 'Online gallery', 'Same day preview', 'Print release', 'USB drive', 'Photo album']
    }
  ]
  
  const cardDesign = config.cardDesign || 'shadow'
  const cardStyle = config.cardStyle || 'light'
  const showPricing = config.showPricing !== false

  const getCardClass = () => {
    const baseClass = 'p-8 rounded-2xl transition-all duration-300 hover:transform hover:scale-105'
    const designClass = {
      border: 'border-2 border-gray-200',
      shadow: 'shadow-lg hover:shadow-xl',
      minimal: 'border border-gray-100'
    }[cardDesign]
    
    const styleClass = cardStyle === 'dark' 
      ? 'bg-gray-800 text-white border-gray-700' 
      : 'bg-white text-gray-900'
    
    return `${baseClass} ${designClass} ${styleClass}`
  }

  const getButtonClass = () => {
    return cardStyle === 'dark'
      ? 'w-full px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors'
      : `w-full px-6 py-3 ${theme.accent} bg-current text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`
  }

  const getTextClass = (opacity = 'full') => {
    if (cardStyle === 'dark') {
      return opacity === 'muted' ? 'text-gray-300' : 'text-white'
    }
    return opacity === 'muted' ? 'text-gray-600' : 'text-gray-900'
  }

  return (
    <section className={`py-20 px-4 ${theme.background}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${theme.text} mb-6`}>
            {sectionTitle}
          </h2>
          <p className={`text-lg ${theme.text} opacity-80 max-w-2xl mx-auto`}>
            Choose the perfect package for your photography needs. All packages include professional editing and high-resolution images.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <div key={pkg.id} className={getCardClass()}>
              {/* Package Header */}
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold ${getTextClass()} mb-2`}>
                  {pkg.name}
                </h3>
                {showPricing && (
                  <div className={`text-3xl font-bold ${theme.accent} mb-2`}>
                    {pkg.price}
                  </div>
                )}
                <div className={`${getTextClass('muted')} text-sm`}>
                  {pkg.duration}
                </div>
              </div>

              {/* Description */}
              <p className={`${getTextClass('muted')} text-center mb-6 leading-relaxed`}>
                {pkg.description}
              </p>

              {/* Deliverables */}
              <div className="mb-8">
                <h4 className={`font-semibold ${getTextClass()} mb-4`}>What's Included:</h4>
                <ul className="space-y-2">
                  {pkg.deliverables.map((item, itemIndex) => (
                    <li key={itemIndex} className={`flex items-center gap-3 ${getTextClass('muted')}`}>
                      <svg className={`w-5 h-5 ${theme.accent} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <button className={getButtonClass()}>
                Book Package
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className={`inline-block p-8 rounded-2xl ${cardStyle === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}>
            <h3 className={`text-2xl font-semibold ${getTextClass()} mb-4`}>
              Need Something Custom?
            </h3>
            <p className={`${getTextClass('muted')} mb-6 max-w-md`}>
              Every project is unique. Let's discuss your specific needs and create a custom package just for you.
            </p>
            <button className={`px-8 py-4 border-2 ${cardStyle === 'dark' ? 'border-white text-white hover:bg-white hover:text-gray-900' : `border-gray-300 ${theme.text} hover:${theme.accent} hover:bg-current hover:text-white`} font-semibold rounded-lg transition-colors`}>
              Get Custom Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}