import { dashboardTheme } from '../../lib/dashboardTheme'

export default function PricingSection() {
  const plans = [
    {
      name: 'Starter',
      price: '$299',
      description: 'Perfect for individuals',
      features: ['2 hours session', '50+ edited photos', 'Digital delivery']
    },
    {
      name: 'Professional',
      price: '$599',
      description: 'Most popular',
      features: ['4 hours session', '100+ edited photos', 'Digital + prints', 'Album included'],
      featured: true
    },
    {
      name: 'Premium',
      price: '$999',
      description: 'Full day coverage',
      features: ['8 hours session', '200+ edited photos', 'Digital + prints', 'Album + video']
    }
  ]

  return (
    <section className="py-20 lg:py-32" style={{backgroundColor: dashboardTheme.colors.main.bg}}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16" style={{color: dashboardTheme.colors.text.primary}}>
          Pricing Plans
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-2xl p-8 transition-all ${plan.featured ? 'ring-2 shadow-2xl scale-105' : 'shadow-lg'}`}
              style={{
                backgroundColor: dashboardTheme.colors.card.bg,
                border: `1px solid ${dashboardTheme.colors.neutral.border}`,
                ringColor: plan.featured ? dashboardTheme.colors.primary[600] : 'transparent'
              }}
            >
              {plan.featured && (
                <div className="mb-4 inline-block px-3 py-1 rounded-full text-xs font-bold text-white" style={{backgroundColor: dashboardTheme.colors.accent[600]}}>
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2" style={{color: dashboardTheme.colors.text.primary}}>
                {plan.name}
              </h3>
              <p className="mb-4" style={{color: dashboardTheme.colors.text.secondary}}>
                {plan.description}
              </p>
              <div className="text-4xl font-bold mb-6" style={{color: dashboardTheme.colors.primary[600]}}>
                {plan.price}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke={dashboardTheme.colors.status.success} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{color: dashboardTheme.colors.text.secondary}}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:shadow-lg" style={{backgroundColor: plan.featured ? dashboardTheme.colors.primary[600] : dashboardTheme.colors.neutral.gray[300], color: plan.featured ? 'white' : dashboardTheme.colors.text.primary}}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
