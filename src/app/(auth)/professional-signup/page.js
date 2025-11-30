'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { theme } from '../../../lib/theme'
import { ArrowRight, ArrowLeft, Mail, Lock, User, Eye, EyeOff, Camera, CheckCircle, Phone, MapPin, Upload, X } from 'lucide-react'

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
  const [formData, setFormData] = useState({
    // Step 1: Account
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    // Step 2: Location
    baseCity: '',
    currentAddress: '',
    latitude: '',
    longitude: '',
    // Step 3: Professional
    skills: [],
    bio: '',
    // Step 4: Portfolio
    media: []
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrls, setPreviewUrls] = useState([])

  // Auto-get location when entering Step 2
  useEffect(() => {
    if (currentStep === 2 && !formData.latitude && !formData.longitude) {
      getCurrentLocation()
    }
  }, [currentStep])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    try {
      const formDataToSend = new FormData()
      
      // Add text fields
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('baseCity', formData.baseCity)
      formDataToSend.append('latitude', formData.latitude)
      formDataToSend.append('longitude', formData.longitude)
      formDataToSend.append('bio', formData.bio)
      
      if (formData.currentAddress) {
        formDataToSend.append('currentAddress', formData.currentAddress)
      }
      
      // Add skills array
      formData.skills.forEach(skill => {
        formDataToSend.append('skills[]', skill)
      })
      
      // Add media files
      formData.media.forEach(file => {
        formDataToSend.append('media', file)
      })

      const response = await fetch('https://lucis-api.onrender.com/api/v1/auth/professionals/sign-up', {
        method: 'POST',
        body: formDataToSend
      })

      const data = await response.json()

      if (data.error) {
        alert(data.message || 'Signup failed')
      } else {
        // Store token and redirect
        localStorage.setItem('token', data.data.token)
        window.location.href = '/photographer'
      }
    } catch (error) {
      console.error('Signup error:', error)
      alert('An error occurred during signup')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleSkill = (skill) => {
    const current = formData.skills || []
    if (current.includes(skill)) {
      setFormData({ ...formData, skills: current.filter(s => s !== skill) })
    } else {
      setFormData({ ...formData, skills: [...current, skill] })
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || [])
    const currentFiles = formData.media || []
    
    if (currentFiles.length + files.length > 6) {
      alert('Maximum 6 files allowed')
      return
    }

    const newFiles = [...currentFiles, ...files]
    setFormData({ ...formData, media: newFiles })

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setPreviewUrls([...previewUrls, ...newPreviews])
  }

  const removeFile = (index) => {
    const newFiles = formData.media.filter((_, i) => i !== index)
    const newPreviews = previewUrls.filter((_, i) => i !== index)
    setFormData({ ...formData, media: newFiles })
    setPreviewUrls(newPreviews)
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          })
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
                  className={`h-2 flex-1 rounded-full transition-all ${
                    currentStep >= step.id ? 'bg-accent-500' : 'bg-gray-200'
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
          <form onSubmit={handleSubmit} className="space-y-6">
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
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

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

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone className="w-5 h-5" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number (e.g., +2348019341670)"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password (min 8 characters)"
                      required
                      minLength={8}
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
                      name="baseCity"
                      value={formData.baseCity}
                      onChange={handleChange}
                      placeholder="Base city (e.g., Lagos, New York)"
                      required
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleChange}
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
                          type="number"
                          name="latitude"
                          value={formData.latitude}
                          readOnly
                          placeholder={locationLoading ? 'Loading...' : 'Auto-detected'}
                          required
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">Longitude</label>
                        <input
                          type="number"
                          name="longitude"
                          value={formData.longitude}
                          readOnly
                          placeholder={locationLoading ? 'Loading...' : 'Auto-detected'}
                          required
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 cursor-not-allowed"
                        />
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
                          className={`px-4 py-3 rounded-xl border-2 transition-all font-medium ${
                            formData.skills?.includes(skill)
                              ? 'border-accent-500 bg-accent-50 text-accent-700'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Professional Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about your photography style and experience..."
                      required
                      rows={5}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-accent-500 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-400 resize-none"
                    />
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
                  className="px-8 py-4 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
              
              <button
                type="submit"
                disabled={isLoading}
                className="group flex-1 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg overflow-hidden transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                <div className="absolute inset-0 bg-accent-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center justify-center gap-3">
                  {isLoading ? 'Submitting...' : currentStep === 4 ? 'Submit Application' : 'Continue'}
                  {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>
            </div>
          </form>

          {/* Sign In Link (Mobile) */}
          <div className="lg:hidden mt-8 text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/professional-login" className="text-accent-600 hover:text-accent-700 font-semibold transition-colors">
              Sign in
            </Link>
          </div>

        </div>
      </div>

    </div>
  )
}
