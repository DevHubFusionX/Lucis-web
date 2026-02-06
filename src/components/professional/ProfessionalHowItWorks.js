'use client'
import Link from 'next/link'
import { theme } from '../../lib/theme'

export default function ProfessionalHowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Apply',
      desc: 'Submit your portfolio and details for our curation team to review.'
    },
    {
      num: '02',
      title: 'Verify',
      desc: 'Complete our identity and quality verification process.'
    },
    {
      num: '03',
      title: 'List',
      desc: 'Set up your profile, packages, and availability.'
    },
    {
      num: '04',
      title: 'Earn',
      desc: 'Receive bookings and get paid securely through the platform.'
    }
  ]

  return (
    <section id="how-it-works" className="py-32 bg-neutral-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-16 items-center">

          {/* Left Content */}
          <div className="md:w-1/3">
            <h2
              className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              Your Journey <br />
              <span className="text-gray-500">Starts Here</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              We've streamlined the process so you can start connecting with clients faster. No complex onboarding, just pure opportunity.
            </p>
            <Link href="/professional-signup" className="px-8 py-4 rounded-full border border-white/20 text-white font-semibold hover:bg-white hover:text-black transition-all inline-block">
              Start Application
            </Link>
          </div>

          {/* Right Steps */}
          <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
              >
                <div
                  className="text-6xl font-bold mb-6 opacity-20 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    color: theme.colors.accent[500],
                    fontFamily: theme.typography.fontFamily.display.join(', ')
                  }}
                >
                  {step.num}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
