import { useState } from 'react'

export default function ContactSection({ config, professional, theme }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Contact form submitted:', formData)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section className={`py-20 px-4 ${theme.background}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold ${theme.text} mb-6`}>
            Let's Create Together
          </h2>
          <p className={`text-lg ${theme.text} opacity-80 max-w-2xl mx-auto`}>
            Ready to capture your special moments? Get in touch and let's discuss your vision.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h3 className={`text-2xl font-semibold ${theme.text} mb-8`}>Get In Touch</h3>
            
            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${theme.accent} bg-current/10 rounded-lg flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${theme.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className={`font-medium ${theme.text}`}>Email</div>
                  <div className={`${theme.text} opacity-70`}>{professional?.email || 'hello@photographer.com'}</div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${theme.accent} bg-current/10 rounded-lg flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${theme.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className={`font-medium ${theme.text}`}>Phone</div>
                  <div className={`${theme.text} opacity-70`}>{professional?.phone || '+1 (555) 123-4567'}</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${theme.accent} bg-current/10 rounded-lg flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${theme.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className={`font-medium ${theme.text}`}>Location</div>
                  <div className={`${theme.text} opacity-70`}>{professional?.baseCity || 'New York, NY'}</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h4 className={`font-medium ${theme.text} mb-4`}>Follow My Work</h4>
              <div className="flex gap-4">
                {['instagram', 'facebook', 'twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className={`w-10 h-10 ${theme.accent} bg-current/10 rounded-lg flex items-center justify-center hover:bg-current/20 transition-colors`}
                  >
                    <span className={`text-sm font-bold ${theme.accent} capitalize`}>
                      {social[0]}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border ${theme.border} rounded-lg focus:ring-2 focus:ring-current focus:border-transparent ${theme.background} ${theme.text}`}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 border ${theme.border} rounded-lg focus:ring-2 focus:ring-current focus:border-transparent ${theme.background} ${theme.text}`}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`w-full px-4 py-3 border ${theme.border} rounded-lg focus:ring-2 focus:ring-current focus:border-transparent resize-none ${theme.background} ${theme.text}`}
                  placeholder="Tell me about your project..."
                />
              </div>

              <button
                type="submit"
                className={`w-full px-8 py-4 ${theme.accent} bg-current text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}