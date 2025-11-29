export default function ServicesSection({ config, professional, theme }) {
  const services = config.services || [
    {
      title: 'Portrait Photography',
      description: 'Professional headshots and personal portraits that capture your unique personality.',
      price: 'From $200',
      features: ['1-2 hour session', 'Professional editing', '10+ final images', 'Online gallery']
    },
    {
      title: 'Wedding Photography',
      description: 'Complete wedding day coverage with artistic storytelling and candid moments.',
      price: 'From $1,500',
      features: ['Full day coverage', 'Engagement session', '500+ edited photos', 'Wedding album']
    },
    {
      title: 'Event Photography',
      description: 'Corporate events, parties, and special occasions documented professionally.',
      price: 'From $300',
      features: ['Event coverage', 'Quick turnaround', 'High-res images', 'Usage rights']
    }
  ]

  return (
    <section className={`py-20 px-4 ${theme.background}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${theme.text} mb-6`}>
            Services
          </h2>
          <p className={`text-lg ${theme.text} opacity-80 max-w-2xl mx-auto`}>
            Professional photography services tailored to capture your most important moments with artistic excellence.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={`p-8 border ${theme.border} rounded-2xl hover:shadow-lg transition-shadow ${theme.background}`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${theme.accent} bg-current/10 rounded-xl flex items-center justify-center mb-6`}>
                <svg className={`w-8 h-8 ${theme.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>

              {/* Content */}
              <h3 className={`text-xl font-semibold ${theme.text} mb-3`}>
                {service.title}
              </h3>
              
              <p className={`${theme.text} opacity-70 mb-4 leading-relaxed`}>
                {service.description}
              </p>

              {/* Price */}
              <div className={`text-2xl font-bold ${theme.accent} mb-6`}>
                {service.price}
              </div>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={`flex items-center gap-3 ${theme.text} opacity-80`}>
                    <svg className={`w-5 h-5 ${theme.accent} flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button className={`w-full px-6 py-3 border-2 ${theme.border} ${theme.text} font-semibold rounded-lg hover:${theme.accent} hover:bg-current hover:text-white transition-colors`}>
                Book Now
              </button>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className={`inline-block p-8 border ${theme.border} rounded-2xl ${theme.background}`}>
            <h3 className={`text-2xl font-semibold ${theme.text} mb-4`}>
              Custom Packages Available
            </h3>
            <p className={`${theme.text} opacity-70 mb-6 max-w-md`}>
              Need something specific? Let's create a custom package that perfectly fits your needs and budget.
            </p>
            <button className={`px-8 py-4 ${theme.accent} bg-current text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}>
              Get Custom Quote
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}