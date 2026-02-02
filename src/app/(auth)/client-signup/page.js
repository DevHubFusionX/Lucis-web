'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { theme } from '../../../lib/theme'
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle, Phone, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import authService from '../../../services/authService'
import Image from 'next/image'

export default function ClientSignupPage() {
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      showNotification('error', 'Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const result = await signup(formData, 'client')

      if (result && !result.success) {
        showNotification('error', result.error || 'Signup failed. Please try again.')
      } else {
        showNotification('success', 'Account created successfully! Redirecting...')
      }
    } catch (error) {
      showNotification('error', error.message || 'An error occurred during signup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const benefits = [
    'Access to 2.5K+ verified photographers',
    'Secure booking and payment system',
    'Portfolio browsing and reviews',
    'Direct messaging with creators',
    'Session management dashboard',
    'Priority customer support'
  ]

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-white">

      {/* Notification Toast */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </motion.div>
      )}

      {/* Left Side - Benefits */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-gradient-to-br from-gray-900 to-black overflow-hidden p-16 flex-col justify-between">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(${theme.colors.accent[500]} 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-[100px]"
        />

        {/* Content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/" className="inline-block mb-16">
              <h1
                className="text-4xl font-bold text-white"
                style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
              >
                Lucis
              </h1>
            </Link>

            <h2
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              Join Thousands of
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600 italic font-serif">
                Happy Clients
              </span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-12">
              Create your account and start booking world-class photographers for your next project.
            </p>

            {/* Benefits List */}
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                  </div>
                  <span className="text-gray-300 text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/client-login" className="text-accent-500 hover:text-accent-400 font-semibold transition-colors">
            Sign in
          </Link>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-xl">

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-block">
              <h1
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
              >
                Lucis
              </h1>
            </Link>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Create Account</span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              Get Started
            </h2>
            <p className="text-gray-600 text-lg">
              Fill in your details to create your client account.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* First Name */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                required
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Last Name */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                required
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                required
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Phone className="w-5 h-5" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone number (e.g., +2348022342671)"
                required
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                required
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-2 border-gray-300 text-accent-500 focus:ring-accent-500"
              />
              <p className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-accent-600 hover:text-accent-700 font-medium">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-accent-600 hover:text-accent-700 font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative"
            >
              <div className="absolute inset-0 bg-accent-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center justify-center gap-3">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Signup */}
            <div className='flex justify-center'>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  console.log('Google signup success:', credentialResponse)
                  try {
                    const result = await authService.googleLogin(credentialResponse.credential)
                    if (result.success) {
                      await signup({ email: result.data?.user?.email, password: '', isGoogle: true }, 'client')
                    }
                  } catch (error) {
                    console.error('Google signup error:', error)
                  }
                }}
                onError={(error) => {
                  console.error('Google signup error:', error)
                }}
                theme='outline'
                size='large'
                text='signup_with'
              />
            </div>
          </motion.form>

          {/* Sign In Link (Mobile) */}
          <div className="lg:hidden mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/client-login" className="text-accent-600 hover:text-accent-700 font-semibold transition-colors">
              Sign in
            </Link>
          </div>

        </div>
      </div>

    </div>
  )
}
