'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useForm } from '../../hooks/useForm'
import { validateSignupForm } from '../../utils/validation'
import { theme } from '../../lib/theme'

export default function SignupForm ({
  formData,
  onSubmit,
  loginLink,
  isProfessional = false
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [focusedField, setFocusedField] = useState(null)

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
    data => validateSignupForm(data, isProfessional)
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
    <div className='flex items-center justify-center lg:col-span-1 col-span-1'>
      <div className='w-full max-w-md p-6 sm:p-10'>
        {/* Logo */}
        <div className='flex items-center justify-center transform hover:scale-105 transition-transform duration-300 '>
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
          {/* Name Fields */}
          {isProfessional ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div className='group'>
                <label
                  htmlFor='fullName'
                  className='block text-sm font-semibold mb-3 transition-colors duration-200'
                  style={{
                    color: focusedField === 'fullName' ? theme.colors.accent[500] : theme.colors.white,
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  Full name
                </label>
                <input
                  id='fullName'
                  type='text'
                  value={values.fullName}
                  onChange={e => setValue('fullName', e.target.value)}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField(null)}
                  placeholder='Full name'
                  required
                  className='w-full px-4 py-3.5 rounded-xl text-base transition-all duration-200 font-medium placeholder-gray-400'
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${
                      errors.fullName
                        ? theme.colors.accent[500]
                        : focusedField === 'fullName'
                        ? theme.colors.accent[500]
                        : theme.colors.gray[200]
                    }`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    boxShadow: focusedField === 'fullName' ? `0 0 0 3px ${theme.colors.accent[500]}20` : 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                {errors.fullName && (
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
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div className='group'>
                <label
                  htmlFor='businessName'
                  className='block text-sm font-semibold mb-3 transition-colors duration-200'
                  style={{
                    color: focusedField === 'businessName' ? theme.colors.accent[500] : theme.colors.white,
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  Business name
                </label>
                <input
                  id='businessName'
                  type='text'
                  value={values.businessName}
                  onChange={e => setValue('businessName', e.target.value)}
                  onFocus={() => setFocusedField('businessName')}
                  onBlur={() => setFocusedField(null)}
                  placeholder='Business name'
                  className='w-full px-4 py-3.5 rounded-xl text-base transition-all duration-200 font-medium placeholder-gray-400'
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${
                      errors.businessName
                        ? theme.colors.accent[500]
                        : focusedField === 'businessName'
                        ? theme.colors.accent[500]
                        : theme.colors.gray[200]
                    }`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    boxShadow: focusedField === 'businessName' ? `0 0 0 3px ${theme.colors.accent[500]}20` : 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                {errors.businessName && (
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
                    {errors.businessName}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className='group'>
              <label
                htmlFor='fullName'
                className='block text-sm font-semibold mb-3 transition-colors duration-200'
                style={{
                  color: focusedField === 'fullName' ? theme.colors.accent[500] : theme.colors.white,
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              >
                Full name
              </label>
              <input
                id='fullName'
                type='text'
                value={values.fullName}
                onChange={e => setValue('fullName', e.target.value)}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField(null)}
                placeholder='Full name'
                required
                className='w-full px-4 py-3.5 rounded-xl text-base transition-all duration-200 font-medium placeholder-gray-400'
                style={{
                  backgroundColor: theme.colors.white,
                  border: `2px solid ${
                    errors.fullName
                      ? theme.colors.accent[500]
                      : focusedField === 'fullName'
                      ? theme.colors.accent[500]
                      : theme.colors.gray[200]
                  }`,
                  color: theme.colors.gray[900],
                  outline: 'none',
                  boxShadow: focusedField === 'fullName' ? `0 0 0 3px ${theme.colors.accent[500]}20` : 'none',
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              />
              {errors.fullName && (
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
                  {errors.fullName}
                </p>
              )}
            </div>
          )}

          {/* Email & Phone */}
          {isProfessional ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div>
                <label
                  className='block text-sm font-bold mb-2'
                  style={{
                    color: theme.colors.white,
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  Email
                </label>
                <input
                  type='email'
                  value={values.email}
                  onChange={e => setValue('email', e.target.value)}
                  placeholder='Email address'
                  required
                  className='w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold'
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${
                      errors.email
                        ? theme.colors.accent[500]
                        : theme.colors.gray[200]
                    }`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                {errors.email && (
                  <p
                    className='text-sm font-semibold mt-1'
                    style={{ color: theme.colors.accent[200] }}
                  >
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <label
                  className='block text-sm font-bold mb-2'
                  style={{
                    color: theme.colors.white,
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  Phone
                </label>
                <input
                  type='tel'
                  value={values.phone}
                  onChange={e => setValue('phone', e.target.value)}
                  placeholder='Phone number'
                  className='w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold'
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${
                      errors.phone
                        ? theme.colors.accent[500]
                        : theme.colors.gray[200]
                    }`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                {errors.phone && (
                  <p
                    className='text-sm font-semibold mt-1'
                    style={{ color: theme.colors.accent[200] }}
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label
                className='block text-sm font-bold mb-2'
                style={{
                  color: theme.colors.white,
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              >
                Email
              </label>
              <input
                type='email'
                value={values.email}
                onChange={e => setValue('email', e.target.value)}
                placeholder='Email address'
                required
                className='w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold'
                style={{
                  backgroundColor: theme.colors.white,
                  border: `2px solid ${
                    errors.email
                      ? theme.colors.accent[500]
                      : theme.colors.gray[200]
                  }`,
                  color: theme.colors.gray[900],
                  outline: 'none',
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              />
              {errors.email && (
                <p
                  className='text-sm font-semibold mt-1'
                  style={{ color: theme.colors.accent[200] }}
                >
                  {errors.email}
                </p>
              )}
            </div>
          )}

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
                <svg className='w-4 h-4 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className='group'>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-semibold mb-3 transition-colors duration-200'
              style={{
                color: focusedField === 'confirmPassword' ? theme.colors.accent[500] : theme.colors.white,
                fontFamily: theme.typography.fontFamily.sans.join(', ')
              }}
            >
              Confirm Password
            </label>
            <div className='relative'>
              <input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={e => setValue('confirmPassword', e.target.value)}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                placeholder='Confirm your password'
                required
                className='w-full px-4 pr-12 py-3.5 rounded-xl text-base transition-all duration-200 font-medium placeholder-gray-400'
                style={{
                  backgroundColor: theme.colors.white,
                  border: `2px solid ${
                    errors.confirmPassword
                      ? theme.colors.accent[500]
                      : focusedField === 'confirmPassword'
                      ? theme.colors.accent[500]
                      : theme.colors.gray[200]
                  }`,
                  color: theme.colors.gray[900],
                  outline: 'none',
                  boxShadow: focusedField === 'confirmPassword' ? `0 0 0 3px ${theme.colors.accent[500]}20` : 'none',
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110'
                style={{ color: theme.colors.gray[400] }}
                onMouseEnter={e =>
                  (e.currentTarget.style.color = theme.colors.accent[500])
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.color = theme.colors.gray[400])
                }
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  strokeWidth={2}
                >
                  {showConfirmPassword ? (
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
            {errors.confirmPassword && (
              <p
                className='text-sm font-medium mt-2 flex items-center gap-1 animate-slideDown'
                style={{ color: theme.colors.accent[200] }}
              >
                <svg className='w-4 h-4 flex-shrink-0' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                </svg>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className='pt-2'>
            <label className='flex items-start gap-2 cursor-pointer'>
              <input
                type='checkbox'
                checked={values.agreeToTerms}
                onChange={e => setValue('agreeToTerms', e.target.checked)}
                className='rounded w-4 h-4 mt-0.5 transition-colors'
                style={{
                  borderWidth: '2px',
                  borderColor: theme.colors.gray[300],
                  backgroundColor: theme.colors.white,
                  accentColor: theme.colors.accent[500]
                }}
              />
              <span
                className='text-sm font-semibold'
                style={{
                  color: theme.colors.white,
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
              >
                I agree to the{' '}
                <Link
                  href='/terms'
                  className='font-bold transition-colors'
                  style={{ color: theme.colors.accent[300] }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.color = theme.colors.accent[200])
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.color = theme.colors.accent[300])
                  }
                >
                  Terms
                </Link>{' '}
                and{' '}
                <Link
                  href='/privacy'
                  className='font-bold transition-colors'
                  style={{ color: theme.colors.accent[300] }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.color = theme.colors.accent[200])
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.color = theme.colors.accent[300])
                  }
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p
                className='text-sm font-semibold mt-1'
                style={{ color: theme.colors.accent[200] }}
              >
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full py-4 rounded-xl font-bold text-base shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white'
            style={{
              backgroundColor: isSubmitting
                ? theme.colors.accent[600]
                : theme.colors.accent[500],
              fontFamily: theme.typography.fontFamily.sans.join(', ')
            }}
            onMouseEnter={e =>
              !isSubmitting &&
              (e.currentTarget.style.backgroundColor = theme.colors.accent[600])
            }
            onMouseLeave={e =>
              !isSubmitting &&
              (e.currentTarget.style.backgroundColor = theme.colors.accent[500])
            }
          >
            {isSubmitting
              ? 'Creating Account...'
              : isProfessional
              ? 'Create Professional Account'
              : 'Create Account'}
          </button>
        </form>

        {/* Sign In Link */}
        <div className='mt-8 text-center'>
          <p
            className='text-sm font-semibold'
            style={{
              color: theme.colors.white,
              fontFamily: theme.typography.fontFamily.sans.join(', ')
            }}
          >
            Already have an account?{' '}
            <Link
              href={loginLink}
              className='font-bold transition-colors'
              style={{ color: theme.colors.accent[300] }}
              onMouseEnter={e =>
                (e.currentTarget.style.color = theme.colors.accent[200])
              }
              onMouseLeave={e =>
                (e.currentTarget.style.color = theme.colors.accent[300])
              }
            >
              Sign in
            </Link>
          </p>
        </div>

        

         
      </div>
    </div>
  )
}
