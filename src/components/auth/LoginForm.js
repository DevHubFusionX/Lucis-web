'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from '../../hooks/useForm'
import { validateLoginForm } from '../../utils/validation'
import { theme } from '../../lib/theme'

export default function LoginForm ({
  formData,
  onSubmit,
  signupLink,
  forgotPasswordLink
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [focusedField, setFocusedField] = useState(null)
  const { values, errors, isSubmitting, setValue, handleSubmit } = useForm(
    { email: '', password: '', rememberMe: false },
    validateLoginForm
  )

  const onFormSubmit = async formValues => {
    setSubmitError('')
    const result = await onSubmit(formValues)
    if (!result.success && result.error) {
      setSubmitError(result.error)
    }
    return result
  }

  return (
    <div className='flex items-center justify-center lg:col-span-1 col-span-1 min-h-screen'>
      <div className='w-full max-w-md p-6 sm:p-10 animate-fadeIn'>
        {/* Logo */}
        <div className='flex items-center justify-center transform hover:scale-105 transition-transform duration-300'>
          <img src='/Logo/logo.svg' alt='Lucis Logo' className='h-auto w-42' />
        </div>

        {/* Header */}
        <div className='mb-10 text-center'>
          <h1
            className='text-4xl sm:text-5xl font-bold mb-3 tracking-tight'
            style={{
              color: theme.colors.white,
              fontFamily: theme.typography.fontFamily.display.join(', ')
            }}
          >
            {formData.title}
          </h1>
          <div
            className='h-1 w-16 mx-auto mb-4 rounded-full'
            style={{ backgroundColor: theme.colors.accent[500] }}
          />
          <p
            className='text-base font-medium opacity-90'
            style={{
              color: theme.colors.white,
              fontFamily: theme.typography.fontFamily.sans.join(', ')
            }}
          >
            {formData.subtitle}
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={e => {
            e.preventDefault()
            handleSubmit(onFormSubmit)
          }}
          className='space-y-6'
        >
          {/* Global Error */}
          {submitError && (
            <div
              className='p-4 rounded-xl backdrop-blur-sm animate-slideDown'
              style={{
                backgroundColor: `${theme.colors.accent[500]}15`,
                border: `1.5px solid ${theme.colors.accent[500]}60`
              }}
            >
              <p
                className='text-sm font-semibold flex items-center gap-2'
                style={{ color: theme.colors.accent[200] }}
              >
                <svg
                  className='w-5 h-5 flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
                {submitError}
              </p>
            </div>
          )}

          {/* Email */}
          <div className='group'>
            <label
              htmlFor='email'
              className='block text-sm font-semibold mb-3 transition-colors duration-200'
              style={{
                color: focusedField === 'email' ? theme.colors.accent[500] : theme.colors.white,
                fontFamily: theme.typography.fontFamily.sans.join(', ')
              }}
            >
              Email address
            </label>
            <div className='relative'>
              <input
                id='email'
                type='email'
                value={values.email}
                onChange={e => setValue('email', e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder='you@example.com'
                autoFocus
                autoComplete='email'
                required
                className='w-full px-4 py-3.5 rounded-xl text-base transition-all duration-200 font-medium placeholder-gray-400'
                style={{
                  backgroundColor: theme.colors.white,
                  border: `2px solid ${
                    errors.email
                      ? theme.colors.accent[500]
                      : focusedField === 'email'
                      ? theme.colors.accent[500]
                      : theme.colors.gray[200]
                  }`,
                  color: theme.colors.gray[900],
                  outline: 'none',
                  boxShadow: focusedField === 'email' ? `0 0 0 3px ${theme.colors.accent[500]}20` : 'none',
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              />
            </div>
            {errors.email && (
              <p
                className='text-sm font-medium mt-2 flex items-center gap-1 animate-slideDown'
                style={{ color: theme.colors.accent[200] }}
              >
                <svg
                  className='w-4 h-4 flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className='group'>
            <label
              htmlFor='password'
              className='block text-sm font-semibold mb-3 transition-colors duration-200'
              style={{
                color: focusedField === 'password' ? theme.colors.accent[500] : theme.colors.white,
                fontFamily: theme.typography.fontFamily.sans.join(', ')
              }}
            >
              Password
            </label>
            <div className='relative'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={e => setValue('password', e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder='Enter your password'
                autoComplete='current-password'
                required
                className='w-full px-4 pr-12 py-3.5 rounded-xl text-base transition-all duration-200 font-medium placeholder-gray-400'
                style={{
                  backgroundColor: theme.colors.white,
                  border: `2px solid ${
                    errors.password
                      ? theme.colors.accent[500]
                      : focusedField === 'password'
                      ? theme.colors.accent[500]
                      : theme.colors.gray[200]
                  }`,
                  color: theme.colors.gray[900],
                  outline: 'none',
                  boxShadow: focusedField === 'password' ? `0 0 0 3px ${theme.colors.accent[500]}20` : 'none',
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110'
                style={{ color: theme.colors.gray[400] }}
                onMouseEnter={e =>
                  (e.currentTarget.style.color = theme.colors.accent[500])
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.color = theme.colors.gray[400])
                }
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                >
                  {showPassword ? (
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                    />
                  ) : (
                    <>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>
            {errors.password && (
              <p
                className='text-sm font-medium mt-2 flex items-center gap-1 animate-slideDown'
                style={{ color: theme.colors.accent[200] }}
              >
                <svg
                  className='w-4 h-4 flex-shrink-0'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Remember & Forgot */}
          <div className='flex items-center justify-between pt-2'>
            <label className='flex items-center gap-2 cursor-pointer group'>
              <input
                type='checkbox'
                checked={values.rememberMe}
                onChange={e => setValue('rememberMe', e.target.checked)}
                className='rounded w-4 h-4 transition-colors'
                style={{
                  borderWidth: '2px',
                  borderColor: theme.colors.gray[300],
                  backgroundColor: theme.colors.white,
                  accentColor: theme.colors.accent[500]
                }}
              />
              <span
                className='text-sm font-medium transition-colors group-hover:opacity-80'
                style={{
                  color: theme.colors.gray[300],
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              >
                Remember me
              </span>
            </label>
            {forgotPasswordLink && (
              <Link
                href={forgotPasswordLink}
                className='text-sm font-semibold transition-colors hover:text-accent-400'
                style={{ color: theme.colors.accent[500] }}
              >
                Forgot password?
              </Link>
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full py-3.5 rounded-xl font-semibold text-base shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 text-white'
            style={{
              backgroundColor: theme.colors.accent[500],
              fontFamily: theme.typography.fontFamily.sans.join(', '),
              boxShadow: `0 4px 15px ${theme.colors.accent[500]}40`
            }}
          >
            {isSubmitting ? (
              <>
                <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M13 7l5 5m0 0l-5 5m5-5H6'
                  />
                </svg>
              </>
            )}
          </button>

          {/* Security Badge */}
          <div
            className='flex items-center justify-center gap-2 text-xs font-medium opacity-75'
            style={{
              color: theme.colors.gray[300],
              fontFamily: theme.typography.fontFamily.sans.join(', ')
            }}
          >
            <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M2.166 4.999A11.954 11.954 0 0110 1.944 11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
            Secure SSL encrypted
          </div>
        </form>

        {/* Sign Up Link */}
        {signupLink && (
          <p
            className='text-center mt-8 text-sm'
            style={{
              color: theme.colors.gray[300],
              fontFamily: theme.typography.fontFamily.sans.join(', ')
            }}
          >
            Don't have an account?{' '}
            <Link
              href={signupLink}
              className='font-semibold transition-colors hover:text-accent-400'
              style={{ color: theme.colors.accent[500] }}
            >
              Sign up
            </Link>
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
