'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { theme } from '../../lib/theme'
import { Send, CheckCircle } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
            Send Us a <span className="text-accent-600">Message</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Name & Email Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder=" "
                required
                className="peer w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900"
              />
              <label className="absolute left-6 top-4 text-gray-500 transition-all peer-focus:text-xs peer-focus:-top-2 peer-focus:left-4 peer-focus:bg-white peer-focus:px-2 peer-focus:text-accent-600 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2">
                Your Name
              </label>
            </div>

            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                required
                className="peer w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900"
              />
              <label className="absolute left-6 top-4 text-gray-500 transition-all peer-focus:text-xs peer-focus:-top-2 peer-focus:left-4 peer-focus:bg-white peer-focus:px-2 peer-focus:text-accent-600 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2">
                Email Address
              </label>
            </div>
          </div>

          {/* Subject */}
          <div className="relative">
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 appearance-none cursor-pointer"
            >
              <option value="general">General Inquiry</option>
              <option value="support">Technical Support</option>
              <option value="partnership">Partnership Opportunity</option>
              <option value="feedback">Feedback</option>
            </select>
            <label className="absolute left-6 -top-2 bg-white px-2 text-xs text-gray-500">
              Subject
            </label>
          </div>

          {/* Message */}
          <div className="relative">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder=" "
              required
              rows={6}
              className="peer w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors resize-none text-gray-900"
            />
            <label className="absolute left-6 top-4 text-gray-500 transition-all peer-focus:text-xs peer-focus:-top-2 peer-focus:left-4 peer-focus:bg-white peer-focus:px-2 peer-focus:text-accent-600 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:left-4 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-2">
              Your Message
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitted}
              className="group relative px-12 py-4 bg-gray-900 text-white rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-accent-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-3">
                {isSubmitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        </motion.form>

      </div>
    </section>
  )
}
