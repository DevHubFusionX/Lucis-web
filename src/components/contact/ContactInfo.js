'use client'
import { motion } from 'framer-motion'
import { theme } from '../../lib/theme'
import { Mail, MessageSquare, MapPin, Phone } from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us an email anytime',
    contact: 'hello@lucis.com',
    link: 'mailto:hello@lucis.com'
  },
  {
    icon: MessageSquare,
    title: 'Live Chat',
    description: 'Chat with our support team',
    contact: 'Available 24/7',
    link: '#'
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Mon-Fri from 9am to 6pm',
    contact: '+1 (555) 123-4567',
    link: 'tel:+15551234567'
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    description: 'Come say hello',
    contact: 'San Francisco, CA',
    link: '#'
  }
]

export default function ContactInfo() {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
          >
            Other Ways to <span className="text-accent-600">Connect</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the method that works best for you. We're here to help however you prefer to reach out.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <motion.a
                key={index}
                href={method.link}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group block p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-accent-500 transition-all duration-500 hover:shadow-xl"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-100 flex items-center justify-center mb-6 text-accent-600 group-hover:bg-accent-500 group-hover:text-white transition-colors">
                  <Icon className="w-7 h-7" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {method.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4">
                  {method.description}
                </p>
                
                <p className="text-accent-600 font-semibold group-hover:text-accent-700">
                  {method.contact}
                </p>
              </motion.a>
            )
          })}
        </div>

      </div>
    </section>
  )
}
