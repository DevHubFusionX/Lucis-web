'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GoogleLogin } from '@react-oauth/google'
import { theme } from '../../../lib/theme'
import { ArrowRight, Mail, Lock, Eye, EyeOff, Sparkles, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useAuth } from '../../../hooks/useAuth'
import authService from '../../../services/authService'
import Image from 'next/image'

export default function ClientLoginPage() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await login(formData, 'client')
      if (result && !result.success) {
        showNotification('error', result.error || 'Login failed. Please try again.')
      } else {
        showNotification('success', 'Login successful! Redirecting...')
      }
    } catch (error) {
      showNotification('error', error.message || 'An error occurred during login.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className='min-h-screen flex'>

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
            <CheckCircle2 className='w-5 h-5' />
          ) : (
            <XCircle className='w-5 h-5' />
          )}
          <span className='font-medium'>{notification.message}</span>
        </motion.div>
      )}
      {/* Left Side - Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center bg-white p-8'>
        <div className='w-full max-w-md'>
          {/* Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='mb-12'
          >
            <Link href='/' className='inline-block'>
              <h1
                className='text-4xl font-bold text-gray-900'
                style={{
                  fontFamily: theme.typography.fontFamily.display.join(', ')
                }}
              >
                Lucis
              </h1>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className='mb-10'
          >
            <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-6'>
              <Sparkles className='w-4 h-4' />
              <span>Client Portal</span>
            </div>

            <h2
              className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'
              style={{
                fontFamily: theme.typography.fontFamily.display.join(', ')
              }}
            >
              Welcome Back
            </h2>
            <p className='text-gray-600 text-lg'>
              Sign in to access your bookings and connect with photographers.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit}
            className='space-y-6'
          >
            {/* Email */}
            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <Mail className='w-5 h-5' />
              </div>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='Email address'
                required
                className='w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400'
              />
            </div>

            {/* Password */}
            <div className='relative'>
              <div className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'>
                <Lock className='w-5 h-5' />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={formData.password}
                onChange={handleChange}
                placeholder='Password'
                required
                className='w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
              >
                {showPassword ? (
                  <EyeOff className='w-5 h-5' />
                ) : (
                  <Eye className='w-5 h-5' />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className='flex justify-end'>
              <Link
                href='/forgot-password'
                className='text-sm text-accent-600 hover:text-accent-700 font-medium transition-colors'
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading}
              className='group w-full px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative'
            >
              <div className='absolute inset-0 bg-accent-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300' />
              <span className='relative flex items-center justify-center gap-3'>
                {isLoading ? (
                  <>
                    <Loader2 className='w-5 h-5 animate-spin' />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                  </>
                )}
              </span>
            </button>

            {/* Divider */}
            <div className='relative my-8'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-200'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-4 bg-white text-gray-500'>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Login */}
            <div className='flex justify-center'>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  console.log('Google login success:', credentialResponse)
                  try {
                    const result = await authService.googleLogin(credentialResponse.credential)
                    if (result.success) {
                      await login({ email: result.data?.user?.email, password: '', isGoogle: true }, 'client')
                    }
                  } catch (error) {
                    console.error('Google login error:', error)
                  }
                }}
                onError={(error) => {
                  console.error('Google login error:', error)
                }}
                theme='outline'
                size='large'
                text='continue_with'
              />
            </div>
          </motion.form>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='mt-8 text-center'
          >
            <p className='text-gray-600'>
              Don't have an account?{' '}
              <Link
                href='/client-signup'
                className='text-accent-600 hover:text-accent-700 font-semibold transition-colors'
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className='hidden lg:block lg:w-1/2 relative bg-gradient-to-br from-gray-900 to-black overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `radial-gradient(${theme.colors.accent[500]} 1px, transparent 1px)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        {/* Floating Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className='absolute top-1/4 right-1/4 w-96 h-96 bg-accent-500/20 rounded-full blur-[100px]'
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1
          }}
          className='absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary-500/20 rounded-full blur-[80px]'
        />

        {/* Content */}
        <div className='relative z-10 h-full flex flex-col justify-center px-16'>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2
              className='text-5xl md:text-6xl font-bold text-white mb-8 leading-tight'
              style={{
                fontFamily: theme.typography.fontFamily.display.join(', ')
              }}
            >
              Capture Your
              <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600 italic font-serif'>
                Perfect Moments
              </span>
            </h2>
            <p className='text-gray-300 text-xl leading-relaxed mb-12'>
              Connect with world-class photographers and bring your vision to
              life. Your next unforgettable session is just a click away.
            </p>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-8'>
              <div>
                <div className='text-3xl font-bold text-white mb-1'>2.5K+</div>
                <div className='text-sm text-gray-400'>Photographers</div>
              </div>
              <div>
                <div className='text-3xl font-bold text-white mb-1'>50K+</div>
                <div className='text-sm text-gray-400'>Sessions</div>
              </div>
              <div>
                <div className='text-3xl font-bold text-white mb-1'>200+</div>
                <div className='text-sm text-gray-400'>Cities</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
