'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { theme } from '../../lib/theme'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: 'How do I book a photographer?',
    answer: 'Simply browse our network of verified photographers, review their portfolios, and send a booking request through their profile. You can discuss your vision, confirm availability, and finalize details directly through our platform.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, and digital payment methods. All transactions are secured and processed through our encrypted payment gateway for your safety.'
  },
  {
    question: 'How do I become a professional on Lucis?',
    answer: 'Click "Join as Pro" and submit your application with your portfolio and credentials. Our curation team reviews all applications to ensure quality. Once approved, you can set up your profile and start receiving bookings.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellation policies vary by photographer. Most offer free cancellation up to 48 hours before the session. Please review the specific photographer\'s policy before booking.'
  },
  {
    question: 'How long does it take to receive my photos?',
    answer: 'Delivery times vary by photographer and package. Typically, you can expect to receive your edited photos within 1-2 weeks after your session. Rush delivery options may be available for an additional fee.'
  }
]

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-32 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
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
            Frequently Asked <span className="text-accent-600">Questions</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Quick answers to common questions. Can't find what you're looking for? Contact us directly.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-accent-200 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-100 flex items-center justify-center text-accent-600">
                  {openIndex === index ? (
                    <Minus className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
