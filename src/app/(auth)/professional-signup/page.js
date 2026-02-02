'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { theme } from '../../../lib/theme'
import { cn } from '../../../lib/utils'
import { ArrowRight, ArrowLeft, Mail, Lock, User, Eye, EyeOff, Camera, CheckCircle, Phone, MapPin, Upload, X, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import authService from '../../../services/authService'

const signupSchema = z.object({
  // Step 1: Account
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  // Step 2: Location
  baseCity: z.string().min(1, 'Base city is required'),
  currentAddress: z.string().optional(),
  latitude: z.string().min(1, 'Latitude is required'),
  longitude: z.string().min(1, 'Longitude is required'),
  // Step 3: Professional
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  bio: z.string().min(20, 'Bio should be at least 20 characters'),
  // Step 4: Portfolio
  media: z.array(z.any()).optional().default([])
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

const STEPS = [
  { id: 1, title: 'Account', description: 'Basic information' },
  { id: 2, title: 'Location', description: 'Where you work' },
  { id: 3, title: 'Professional', description: 'Your expertise' },
  { id: 4, title: 'Portfolio', description: 'Showcase your work' }
]

const SKILL_OPTIONS = [
  'Events', 'Weddings', 'Portrait', 'Commercial', 'Fashion',
  'Product', 'Real Estate', 'Food', 'Landscape', 'Sports'
]

export default function ProfessionalSignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [locationLoading, setLocationLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState([])
  const [notification, setNotification] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      baseCity: '',
      currentAddress: '',
      latitude: '',
      longitude: '',
      skills: [],
      bio: '',
      media: []
    }
  })

  const formData = watch()

  // Auto-get location when entering Step 2
  useEffect(() => {
    if (currentStep === 2 && !formData.latitude && !formData.longitude) {
      getCurrentLocation()
    }
  }, [currentStep])

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const onFormSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Prepare user data for signup
      const userData = {
        email: data.email,
        phone: data.phone,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        baseCity: data.baseCity,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        bio: data.bio,
        skills: data.skills,
        currentAddress: data.currentAddress,
        galleryImages: data.media.filter(file => file.type.startsWith('image/')),
        galleryVideos: data.media.filter(file => file.type.startsWith('video/'))
      }

      await authService.signup(userData, 'professional')

      showNotification('success', 'Account created successfully! Redirecting...')
      setTimeout(() => {
        window.location.href = '/photographer'
      }, 1500)
    } catch (error) {
      console.error('Signup error:', error)
      showNotification('error', error.message || 'An error occurred during signup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = async () => {
    // Define fields to validate for each step
    const fieldsByStep = {
      1: ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'],
      2: ['baseCity', 'latitude', 'longitude'],
      3: ['skills', 'bio'],
      4: [] // Portfolio is step 4, button will trigger main submit
    }

    const fieldsToValidate = fieldsByStep[currentStep]
    const isStepValid = await trigger(fieldsToValidate)

    if (isStepValid) {
      setCurrentStep(currentStep + 1)
    }
  }

  const toggleSkill = (skill) => {
    const current = formData.skills || []
    const updated = current.includes(skill)
      ? current.filter(s => s !== skill)
      : [...current, skill]

    setValue('skills', updated, { shouldValidate: true })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    const currentFiles = formData.media || []

    if (currentFiles.length + files.length > 6) {
      alert('Maximum 6 files allowed')
      return
    }

    const newFiles = [...currentFiles, ...files]
    setValue('media', newFiles)

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewUrls([...previewUrls, ...newPreviews])
  }

  const removeFile = (index) => {
    const newFiles = formData.media.filter((_, i) => i !== index)
    const newPreviews = previewUrls.filter((_, i) => i !== index)
    setValue('media', newFiles)
    setPreviewUrls(newPreviews)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude.toString(), { shouldValidate: true })
          setValue('longitude', position.coords.longitude.toString(), { shouldValidate: true })
          setLocationLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location. Please enable location access or enter coordinates manually.')
          setLocationLoading(false)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser. Please enter coordinates manually.')
    }
  }

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

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

      {/* Left Side - Progress & Info */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-gradient-to-br from-gray-900 to-black overflow-hidden p-16 flex-col justify-between">
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

        <div className="relative z-10">
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
            Join Elite
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-600 italic font-serif">
              Photographers
            </span>
          </h2>

          {/* Progress Steps */}
          <div className="space-y-6 mt-12">
            {STEPS.map((step) => (
              <div key={step.id} className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                  ${currentStep > step.id ? 'bg-accent-500 text-white' :
                    currentStep === step.id ? 'bg-accent-500 text-white' :
                      'bg-white/10 text-gray-500'}
                `}>
                  {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
                </div>
                <div>
                  <div className={`font-semibold ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                    {step.title}
                  </div>
                  <div className="text-sm text-gray-400">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-gray-400 text-sm">
          Already have an account?{' '}
          <Link href="/professional-login" className="text-accent-500 hover:text-accent-400 font-semibold transition-colors">
            Sign in
          </Link>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-xl">

          {/* Mobile Logo & Progress */}
          <div className="lg:hidden mb-8">
            <Link href="/" className="inline-block mb-6">
              <h1
                className="text-3xl font-bold text-gray-900"
                style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
              >
                Lucis
              </h1>
            </Link>

            <div className="flex gap-2 mb-6">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`h-2 flex-1 rounded-full transition-all ${currentStep >= step.id ? 'bg-accent-500' : 'bg-gray-200'
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Header */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-100 text-accent-700 text-sm font-medium mb-6">
              <Camera className="w-4 h-4" />
              <span>Step {currentStep} of {STEPS.length}</span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
              style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}
            >
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-gray-600 text-lg">
              {STEPS[currentStep - 1].description}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">

              {/* Step 1: Account */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        {...register('firstName')}
                        placeholder="First name"
                        className={cn(
                          "w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400",
                          errors.firstName ? "border-red-500" : "border-gray-200"
                        )}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName.message}</p>}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        {...register('lastName')}
                        placeholder="Last name"
                        className={cn(
                          "w-full px-4 py-4 border-2 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400",
                          errors.lastName ? "border-red-500" : "border-gray-200"
                        )}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="Email address"
                      className={cn(
                        "w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400",
                        errors.email ? "border-red-500" : "border-gray-200"
                      )}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      {...register('phone')}
                      placeholder="Phone number (e.g., +2348019341670)"
                      className={cn(
                        "w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400",
                        errors.phone ? "border-red-500" : "border-gray-200"
                      )}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</p>}
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      placeholder="Password (min 8 characters)"
                      className={cn(
                        "w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400",
                        errors.password ? "border-red-500" : "border-gray-200"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      placeholder="Confirm password"
                      className={cn(
                        "w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400",
                        errors.confirmPassword ? "border-red-500" : "border-gray-200"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      {...register('baseCity')}
                      placeholder="Base city (e.g., Lagos, New York)"
                      className={cn(
                        "w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400",
                        errors.baseCity ? "border-red-500" : "border-gray-200"
                      )}
                    />
                    {errors.baseCity && <p className="text-red-500 text-xs mt-1 ml-1">{errors.baseCity.message}</p>}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      {...register('currentAddress')}
                      placeholder="Current address (optional)"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Auto-detected Coordinates */}
                  <div className="p-6 bg-accent-50 border-2 border-accent-200 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-accent-600" />
                      <span className="font-semibold text-gray-900">
                        {locationLoading ? 'Detecting your location...' : 'Your Coordinates'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Latitude</label>
                        <input
                          type="text"
                          {...register('latitude')}
                          readOnly
                          placeholder={locationLoading ? 'Loading...' : 'Auto-detected'}
                          className={cn(
                            "w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-400 cursor-not-allowed",
                            errors.latitude ? "border-red-500" : "border-gray-200"
                          )}
                        />
                        {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Longitude</label>
                        <input
                          type="text"
                          {...register('longitude')}
                          readOnly
                          placeholder={locationLoading ? 'Loading...' : 'Auto-detected'}
                          className={cn(
                            "w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-400 cursor-not-allowed",
                            errors.longitude ? "border-red-500" : "border-gray-200"
                          )}
                        />
                        {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude.message}</p>}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={locationLoading}
                      className="w-full mt-4 px-4 py-3 bg-accent-500 text-white rounded-xl font-semibold hover:bg-accent-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <MapPin className="w-5 h-5" />
                      {locationLoading ? 'Detecting...' : 'Refresh Location'}
                    </button>
                  </div>

                  <p className="text-sm text-gray-500 text-center">
                    We automatically detect your location to connect you with nearby clients
                  </p>
                </motion.div>
              )}

              {/* Step 3: Professional */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Skills (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {SKILL_OPTIONS.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={cn(
                            "px-4 py-3 rounded-xl border-2 transition-all font-medium",
                            formData.skills?.includes(skill)
                              ? "border-accent-500 bg-accent-50 text-accent-700"
                              : "border-gray-200 text-gray-700 hover:border-gray-300"
                          )}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                    {errors.skills && <p className="text-red-500 text-xs mt-2 ml-1">{errors.skills.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Professional Bio
                    </label>
                    <textarea
                      {...register('bio')}
                      placeholder="Tell us about your photography style and experience..."
                      rows={5}
                      className={cn(
                        "w-full px-4 py-4 border-2 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 resize-none",
                        errors.bio ? "border-red-500" : "border-gray-200"
                      )}
                    />
                    {errors.bio && <p className="text-red-500 text-xs mt-1 ml-1">{errors.bio.message}</p>}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Portfolio */}
              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Upload Portfolio Images (Optional - Max 6)
                    </label>

                    <label className="block p-8 border-2 border-dashed border-gray-300 rounded-2xl text-center hover:border-accent-500 transition-colors cursor-pointer">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        Images or videos (Max 6 files)
                      </p>
                    </label>

                    {/* Preview Grid */}
                    {previewUrls.length > 0 && (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

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
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-4 pt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 px-8 py-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-[2] bg-accent-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-accent-600 transition-all shadow-lg shadow-accent-200 flex items-center justify-center gap-2 group"
                >
                  Continue
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] bg-accent-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-accent-600 transition-all shadow-lg shadow-accent-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Complete Signup
                      <CheckCircle className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="mt-8 text-center text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-600 font-bold hover:text-accent-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
