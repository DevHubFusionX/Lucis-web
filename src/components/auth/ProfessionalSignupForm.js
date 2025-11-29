'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useForm } from '../../hooks/useForm'
import { theme } from '../../lib/theme'

const STEPS = {
  PERSONAL: 1,
  PROFESSIONAL: 2,
  MEDIA: 3
}

export default function ProfessionalSignupForm ({
  formData,
  onSubmit,
  loginLink
}) {
  const [currentStep, setCurrentStep] = useState(STEPS.PERSONAL)
  const [showPassword, setShowPassword] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [focusedField, setFocusedField] = useState(null)

  const { values, errors, isSubmitting, setValue, handleSubmit } = useForm({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    bio: '',
    baseCity: '',
    longitude: '',
    latitude: '',
    skills: [],
    currentAddress: '',
    media: [],
    agreeToTerms: false
  })

  const onFormSubmit = async formValues => {
    setSubmitError('')
    const result = await onSubmit(formValues)
    if (!result.success && result.error) {
      setSubmitError(result.error)
    }
    return result
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const addSkill = skill => {
    if (skill && !values.skills.includes(skill)) {
      setValue('skills', [...values.skills, skill])
    }
  }

  const removeSkill = skill => {
    setValue(
      'skills',
      values.skills.filter(s => s !== skill)
    )
  }

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser')
      return
    }

    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      position => {
        setValue('longitude', position.coords.longitude.toString())
        setValue('latitude', position.coords.latitude.toString())
        setLocationLoading(false)
      },
      error => {
        console.error('Error getting location:', error)
        alert('Unable to get your location. Please enter coordinates manually.')
        setLocationLoading(false)
      }
    )
  }

  useEffect(() => {
    if (
      currentStep === STEPS.PROFESSIONAL &&
      !values.longitude &&
      !values.latitude
    ) {
      getUserLocation()
    }
  }, [currentStep])

  return (
    <div className='flex items-center justify-center lg:col-span-1 col-span-1'>
      <div className='w-full max-w-md p-6 sm:p-10'>

        {/* Logo */}
        <div className='flex items-center justify-center transform hover:scale-105 transition-transform duration-300 mb-10'>
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

        {/* Progress Steps */}
        <div className='flex justify-between mb-8 gap-2'>
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className='flex-1 h-1 rounded-full transition-all'
              style={{
                backgroundColor:
                  step <= currentStep
                    ? theme.colors.accent[500]
                    : theme.colors.white + '30'
              }}
            />
          ))}
        </div>

        <form
          onSubmit={e => {
            e.preventDefault()
            currentStep === 3 ? handleSubmit(onFormSubmit) : nextStep()
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
          {/* Step 1: Personal Info */}
          {currentStep === STEPS.PERSONAL && (
            <>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div>
                  <label
                    className='block text-sm font-bold mb-2'
                    style={{
                      color: theme.colors.white,
                      fontFamily: theme.typography.fontFamily.sans.join(', ')
                    }}
                  >
                    First name
                  </label>
                  <input
                    type='text'
                    value={values.firstName}
                    onChange={e => setValue('firstName', e.target.value)}
                    placeholder='First name'
                    required
                    className='w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold'
                    style={{
                      backgroundColor: theme.colors.white,
                      border: `2px solid ${
                        errors.firstName
                          ? theme.colors.accent[500]
                          : theme.colors.gray[200]
                      }`,
                      color: theme.colors.gray[900],
                      outline: 'none',
                      fontFamily: theme.typography.fontFamily.sans.join(', ')
                    }}
                  />
                  {errors.firstName && (
                    <p
                      className='text-sm font-semibold mt-1'
                      style={{ color: theme.colors.accent[200] }}
                    >
                      {errors.firstName}
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
                    Last name
                  </label>
                  <input
                    type='text'
                    value={values.lastName}
                    onChange={e => setValue('lastName', e.target.value)}
                    placeholder='Last name'
                    required
                    className='w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold'
                    style={{
                      backgroundColor: theme.colors.white,
                      border: `2px solid ${
                        errors.lastName
                          ? theme.colors.accent[500]
                          : theme.colors.gray[200]
                      }`,
                      color: theme.colors.gray[900],
                      outline: 'none',
                      fontFamily: theme.typography.fontFamily.sans.join(', ')
                    }}
                  />
                  {errors.lastName && (
                    <p
                      className='text-sm font-semibold mt-1'
                      style={{ color: theme.colors.accent[200] }}
                    >
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  className='block text-sm font-bold mb-2'
                  style={{
                    color: theme.colors.white,
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  Email address
                </label>
                <input
                  type='email'
                  value={values.email}
                  onChange={e => setValue('email', e.target.value)}
                  placeholder='you@example.com'
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
                  Phone number
                </label>
                <input
                  type='tel'
                  value={values.phone}
                  onChange={e => setValue('phone', e.target.value)}
                  placeholder='Phone number'
                  required
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

              <div>
                <label
                  className='block text-sm font-bold mb-2'
                  style={{
                    color: theme.colors.white,
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  Password
                </label>
                <div className='relative'>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={e => setValue('password', e.target.value)}
                    placeholder='Enter your password'
                    required
                    className='w-full px-4 pr-12 py-3.5 rounded-xl text-base transition-all font-semibold'
                    style={{
                      backgroundColor: theme.colors.white,
                      border: `2px solid ${
                        errors.password
                          ? theme.colors.accent[500]
                          : theme.colors.gray[200]
                      }`,
                      color: theme.colors.gray[900],
                      outline: 'none',
                      fontFamily: theme.typography.fontFamily.sans.join(', ')
                    }}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-4 top-1/2 -translate-y-1/2 transition-colors'
                    style={{ color: theme.colors.gray[400] }}
                    onMouseEnter={e =>
                      (e.currentTarget.style.color = theme.colors.gray[600])
                    }
                    onMouseLeave={e =>
                      (e.currentTarget.style.color = theme.colors.gray[400])
                    }
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
                    className='text-sm font-semibold mt-1'
                    style={{ color: theme.colors.accent[200] }}
                  >
                    {errors.password}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Step 2: Professional Info */}
          {currentStep === STEPS.PROFESSIONAL && (
            <>
              <div>
                <label
                  className='block text-sm font-bold mb-2'
                  style={{
                    color: theme.colors.white,
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  Professional bio
                </label>
                <textarea
                  value={values.bio}
                  onChange={e => setValue('bio', e.target.value)}
                  placeholder='Tell us about yourself and your photography style...'
                  rows={3}
                  className='w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold resize-none'
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${
                      errors.bio
                        ? theme.colors.accent[500]
                        : theme.colors.gray[200]
                    }`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                {errors.bio && (
                  <p
                    className='text-sm font-semibold mt-1'
                    style={{ color: theme.colors.accent[200] }}
                  >
                    {errors.bio}
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
                  Base city
                </label>
                <input
                  type='text'
                  value={values.baseCity}
                  onChange={e => setValue('baseCity', e.target.value)}
                  placeholder='Base city'
                  required
                  className='w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold'
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${
                      errors.baseCity
                        ? theme.colors.accent[500]
                        : theme.colors.gray[200]
                    }`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                {errors.baseCity && (
                  <p
                    className='text-sm font-semibold mt-1'
                    style={{ color: theme.colors.accent[200] }}
                  >
                    {errors.baseCity}
                  </p>
                )}
              </div>

              <div>
                <div className='flex justify-between items-center mb-2'>
                  <label
                    className='text-sm font-bold'
                    style={{
                      color: theme.colors.white,
                      fontFamily: theme.typography.fontFamily.sans.join(', ')
                    }}
                  >
                    Location coordinates
                  </label>
                  <button
                    type='button'
                    onClick={getUserLocation}
                    disabled={locationLoading}
                    className='text-xs px-3 py-1.5 rounded-full font-bold transition-all'
                    style={{
                      backgroundColor: theme.colors.accent[500],
                      color: theme.colors.white,
                      fontFamily: theme.typography.fontFamily.sans.join(', ')
                    }}
                    onMouseEnter={e =>
                      !locationLoading &&
                      (e.currentTarget.style.backgroundColor =
                        theme.colors.accent[600])
                    }
                    onMouseLeave={e =>
                      !locationLoading &&
                      (e.currentTarget.style.backgroundColor =
                        theme.colors.accent[500])
                    }
                  >
                    {locationLoading ? 'Getting...' : 'Use My Location'}
                  </button>
                </div>
                <div className='grid grid-cols-2 gap-3'>
                  <input
                    type='number'
                    step='any'
                    value={values.longitude}
                    onChange={e => setValue('longitude', e.target.value)}
                    placeholder='Longitude'
                    required
                    className='w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold'
                    style={{
                      backgroundColor: theme.colors.white,
                      border: `2px solid ${
                        errors.longitude
                          ? theme.colors.accent[500]
                          : theme.colors.gray[200]
                      }`,
                      color: theme.colors.gray[900],
                      outline: 'none',
                      fontFamily: theme.typography.fontFamily.sans.join(', ')
                    }}
                  />
                  <input
                    type='number'
                    step='any'
                    value={values.latitude}
                    onChange={e => setValue('latitude', e.target.value)}
                    placeholder='Latitude'
                    required
                    className='w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold'
                    style={{
                      backgroundColor: theme.colors.white,
                      border: `2px solid ${
                        errors.latitude
                          ? theme.colors.accent[500]
                          : theme.colors.gray[200]
                      }`,
                      color: theme.colors.gray[900],
                      outline: 'none',
                      fontFamily: theme.typography.fontFamily.sans.join(', ')
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className='block text-sm font-bold mb-2'
                  style={{
                    color: theme.colors.white,
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  Add skills
                </label>
                <input
                  type='text'
                  placeholder='Add a skill (e.g., Wedding Photography)'
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSkill(e.target.value)
                      e.target.value = ''
                    }
                  }}
                  className='w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold'
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${theme.colors.gray[200]}`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                <div className='flex flex-wrap gap-2 mt-3'>
                  {values.skills.map(skill => (
                    <span
                      key={skill}
                      className='px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2'
                      style={{
                        backgroundColor: theme.colors.accent[100],
                        color: theme.colors.accent[700]
                      }}
                    >
                      {skill}
                      <button
                        type='button'
                        onClick={() => removeSkill(skill)}
                        className='font-bold'
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 3: Media Upload */}
          {currentStep === STEPS.MEDIA && (
            <>
              <div>
                <label
                  className='block text-sm font-bold mb-2'
                  style={{
                    color: theme.colors.white,
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  Media files
                </label>
                <p
                  className='text-xs font-semibold mb-3'
                  style={{
                    color: theme.colors.white,
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                >
                  Upload up to 6 files (images/videos)
                </p>
                <input
                  type='file'
                  accept='image/*,video/*'
                  multiple
                  onChange={e =>
                    setValue('media', Array.from(e.target.files).slice(0, 6))
                  }
                  className='w-full px-4 py-3.5 rounded-xl text-base transition-all font-semibold'
                  style={{
                    backgroundColor: theme.colors.white,
                    border: `2px solid ${theme.colors.gray[200]}`,
                    color: theme.colors.gray[900],
                    outline: 'none',
                    fontFamily: theme.typography.fontFamily.sans.join(', ')
                  }}
                />
                {values.media.length > 0 && (
                  <p
                    className='text-xs font-semibold mt-2'
                    style={{
                      color: theme.colors.white,
                      fontFamily: theme.typography.fontFamily.sans.join(', ')
                    }}
                  >
                    {values.media.length} file(s) selected
                  </p>
                )}
              </div>

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
            </>
          )}

          {/* Navigation Buttons */}
          <div className='flex gap-3 pt-4'>
            {currentStep > 1 && (
              <button
                type='button'
                onClick={prevStep}
                className='flex-1 py-4 rounded-xl font-bold text-base transition-all'
                style={{
                  backgroundColor: theme.colors.white + '20',
                  border: `2px solid ${theme.colors.white}40`,
                  color: theme.colors.white,
                  fontFamily: theme.typography.fontFamily.sans.join(', ')
                }}
                onMouseEnter={e =>
                  (e.currentTarget.style.backgroundColor =
                    theme.colors.white + '30')
                }
                onMouseLeave={e =>
                  (e.currentTarget.style.backgroundColor =
                    theme.colors.white + '20')
                }
              >
                Back
              </button>
            )}

            <button
              type='submit'
              disabled={isSubmitting}
              className='flex-1 py-4 rounded-xl font-bold text-base shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white'
              style={{
                backgroundColor: isSubmitting
                  ? theme.colors.accent[600]
                  : theme.colors.accent[500],
                fontFamily: theme.typography.fontFamily.sans.join(', ')
              }}
              onMouseEnter={e =>
                !isSubmitting &&
                (e.currentTarget.style.backgroundColor =
                  theme.colors.accent[600])
              }
              onMouseLeave={e =>
                !isSubmitting &&
                (e.currentTarget.style.backgroundColor =
                  theme.colors.accent[500])
              }
            >
              {isSubmitting
                ? 'Creating Account...'
                : currentStep === 3
                ? 'Create Account'
                : 'Next'}
            </button>
          </div>
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
