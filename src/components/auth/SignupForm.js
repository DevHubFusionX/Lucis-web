'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from '../../hooks/useForm'
import { validateSignupForm } from '../../utils/validation'
import { theme } from '../../lib/theme'

export default function SignupForm({ formData, onSubmit, loginLink, isProfessional = false }) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const initialValues = {
    fullName: '',
    businessName: isProfessional ? '' : undefined,
    email: '',
    phone: isProfessional ? '' : undefined,
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  }

  const { values, errors, isSubmitting, setValue, handleSubmit } = useForm(
    initialValues,
    (data) => validateSignupForm(data, isProfessional)
  )

  const onFormSubmit = async (formValues) => {
    const result = await onSubmit(formValues)
    if (!result.success && result.error) {
      alert(result.error)
    }
    return result
  }

  return (
    <div className="flex items-center justify-center lg:col-span-1 col-span-1">
      <div className="w-full max-w-md p-6 sm:p-10">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-sm font-bold transition-colors group" style={{ color: theme.colors.white }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Logo */}
        <div className="flex items-center mb-8">
          <img src="/Logo/logo.svg" alt="Lucis Logo" className="h-12 w-auto" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.display.join(', ') }}>{formData.title}</h1>
          <p className="text-base font-semibold" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>{formData.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(onFormSubmit) }} className="space-y-4">
          {/* Name Fields */}
          {isProfessional ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Full name</label>
                <input
                  type="text"
                  value={values.fullName}
                  onChange={(e) => setValue('fullName', e.target.value)}
                  placeholder="Full name"
                  required
                  className="w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold"
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${errors.fullName ? theme.colors.accent[500] : theme.colors.gray[200]}`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                {errors.fullName && <p className="text-sm font-semibold mt-1" style={{ color: theme.colors.accent[200] }}>{errors.fullName}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Business name</label>
                <input
                  type="text"
                  value={values.businessName}
                  onChange={(e) => setValue('businessName', e.target.value)}
                  placeholder="Business name"
                  className="w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold"
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${errors.businessName ? theme.colors.accent[500] : theme.colors.gray[200]}`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                {errors.businessName && <p className="text-sm font-semibold mt-1" style={{ color: theme.colors.accent[200] }}>{errors.businessName}</p>}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Full name</label>
              <input
                type="text"
                value={values.fullName}
                onChange={(e) => setValue('fullName', e.target.value)}
                placeholder="Full name"
                required
                className="w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold"
                style={{
                  backgroundColor: theme.colors.white,
                  border: `2px solid ${errors.fullName ? theme.colors.accent[500] : theme.colors.gray[200]}`,
                  color: theme.colors.gray[900],
                  outline: 'none',
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              />
              {errors.fullName && <p className="text-sm font-semibold mt-1" style={{ color: theme.colors.accent[200] }}>{errors.fullName}</p>}
            </div>
          )}

          {/* Email & Phone */}
          {isProfessional ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Email</label>
                <input
                  type="email"
                  value={values.email}
                  onChange={(e) => setValue('email', e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold"
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${errors.email ? theme.colors.accent[500] : theme.colors.gray[200]}`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                {errors.email && <p className="text-sm font-semibold mt-1" style={{ color: theme.colors.accent[200] }}>{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Phone</label>
                <input
                  type="tel"
                  value={values.phone}
                  onChange={(e) => setValue('phone', e.target.value)}
                  placeholder="Phone number"
                  className="w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold"
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${errors.phone ? theme.colors.accent[500] : theme.colors.gray[200]}`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                {errors.phone && <p className="text-sm font-semibold mt-1" style={{ color: theme.colors.accent[200] }}>{errors.phone}</p>}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Email</label>
              <input
                type="email"
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                placeholder="Email address"
                required
                className="w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold"
                style={{
                  backgroundColor: theme.colors.white,
                  border: `2px solid ${errors.email ? theme.colors.accent[500] : theme.colors.gray[200]}`,
                  color: theme.colors.gray[900],
                  outline: 'none',
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              />
              {errors.email && <p className="text-sm font-semibold mt-1" style={{ color: theme.colors.accent[200] }}>{errors.email}</p>}
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={(e) => setValue('password', e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full px-4 pr-12 py-3.5 rounded-xl text-base transition-all font-semibold"
                style={{
                  backgroundColor: theme.colors.white,
                  border: `2px solid ${errors.password ? theme.colors.accent[500] : theme.colors.gray[200]}`,
                  color: theme.colors.gray[900],
                  outline: 'none',
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: theme.colors.gray[400] }}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.gray[600]}
                onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.gray[400]}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && <p className="text-sm font-semibold mt-1" style={{ color: theme.colors.accent[200] }}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold mb-2" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={(e) => setValue('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full px-4 pr-12 py-3.5 rounded-xl text-base transition-all font-semibold"
                style={{
                  backgroundColor: theme.colors.white,
                  border: `2px solid ${errors.confirmPassword ? theme.colors.accent[500] : theme.colors.gray[200]}`,
                  color: theme.colors.gray[900],
                  outline: 'none',
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: theme.colors.gray[400] }}
                onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.gray[600]}
                onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.gray[400]}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  {showConfirmPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm font-semibold mt-1" style={{ color: theme.colors.accent[200] }}>{errors.confirmPassword}</p>}
          </div>

          {/* Terms Checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={values.agreeToTerms}
                onChange={(e) => setValue('agreeToTerms', e.target.checked)}
                className="rounded w-4 h-4 mt-0.5 transition-colors"
                style={{
                  borderWidth: '2px',
                  borderColor: theme.colors.gray[300],
                  backgroundColor: theme.colors.white,
                  accentColor: theme.colors.accent[500]
                }}
              />
              <span className="text-sm font-semibold" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
                I agree to the{' '}
                <Link href="/terms" className="font-bold transition-colors" style={{ color: theme.colors.accent[300] }} onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.accent[200]} onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.accent[300]}>Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="font-bold transition-colors" style={{ color: theme.colors.accent[300] }} onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.accent[200]} onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.accent[300]}>Privacy Policy</Link>
              </span>
            </label>
            {errors.agreeToTerms && <p className="text-sm font-semibold mt-1" style={{ color: theme.colors.accent[200] }}>{errors.agreeToTerms}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl font-bold text-base shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
            style={{ 
              backgroundColor: isSubmitting ? theme.colors.accent[600] : theme.colors.accent[500],
              fontFamily: theme.typography.fontFamily.sans.join(', ')
            }}
            onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = theme.colors.accent[600])}
            onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = theme.colors.accent[500])}
          >
            {isSubmitting ? 'Creating Account...' : (isProfessional ? 'Create Professional Account' : 'Create Account')}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-sm font-semibold" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>
            Already have an account?{' '}
            <Link href={loginLink} className="font-bold transition-colors" style={{ color: theme.colors.accent[300] }} onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.accent[200]} onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.accent[300]}>
              Sign in
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full" style={{ borderTop: `1px solid ${theme.colors.white}40` }}></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent font-bold" style={{ color: theme.colors.white, fontFamily: theme.typography.fontFamily.sans.join(', ') }}>Or continue with</span>
          </div>
        </div>

        {/* Google Sign Up */}
        <button
          type="button"
          className="w-full py-3 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-3"
          style={{
            backgroundColor: theme.colors.white,
            color: theme.colors.gray[900],
            fontFamily: theme.typography.fontFamily.sans.join(', ')
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.gray[100]}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors.white}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>
      </div>
    </div>
  )
}
