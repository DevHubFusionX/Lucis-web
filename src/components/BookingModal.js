'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import bookingService from '../services/bookingService'
import professionalService from '../services/professionalService'
import logger from '../utils/logger'
import { useQuery } from '../hooks/useQuery'
import { useToast } from './ui/Toast'
import BaseModal from './BaseModal'
import ScheduleSelector from './booking/ScheduleSelector'
import PackageSelector from './booking/PackageSelector'
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react'
import { theme } from '../lib/theme' // Keeping original theme import path

// Animation variants
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 30 : -30,
    opacity: 0
  })
}

/**
 * Booking modal with step-based wizard flow
 */
export default function BookingModal({ professional, isOpen, onClose, onSuccess }) {
  // -- Hooks
  const { addToast } = useToast()

  // -- State
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Form State
  const [formData, setFormData] = useState({
    selectedPackages: [],
    selectedDate: '', // Moved into formData
    selectedTime: ''  // Moved into formData
  })
  const [selectedSchedules, setSelectedSchedules] = useState([]) // Changed to array to support multiple blocks per day

  // -- Data Fetching --
  const { data: packagesData, isLoading: packagesLoading } = useQuery(
    `packages-${professional?.id}`,
    () => professionalService.getPackagesByProfessional(professional.id),
    { enabled: isOpen && !!professional?.id }
  )
  const packages = packagesData?.records || []

  const { data: schedulesData, isLoading: schedulesLoading } = useQuery(
    `schedules-${professional?.id}`,
    () => professionalService.getProfessionalSchedules(professional.id),
    { enabled: isOpen && !!professional?.id }
  )
  const schedules = schedulesData?.records || []

  // -- Helpers --
  const formatScheduleTime = (timeString) => {
    if (!timeString) return ''
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const selectedPackageData = packages.find(pkg => formData.selectedPackages.includes(pkg.id))
  
  // Calculate Available Times
  const availableTimes = useMemo(() => {
    if (!selectedSchedules || selectedSchedules.length === 0) return []
    
    // Using a Set to avoid duplicate slots if schedules overlap
    const timesSet = new Set()
    const duration = selectedPackageData?.duration || 60
    const now = new Date()
    const selectedDateObj = formData.selectedDate ? new Date(formData.selectedDate) : null
    const isToday = selectedDateObj && selectedDateObj.toDateString() === now.toDateString()

    selectedSchedules.forEach(schedule => {
      const start = new Date(`2000-01-01T${schedule.startTime}`)
      const end = new Date(`2000-01-01T${schedule.endTime}`)
      
      const current = new Date(start)
      while (current < end) {
        const slotEnd = new Date(current.getTime() + duration * 60000)
        
        if (slotEnd <= end) {
          const timeString = current.toTimeString().slice(0, 5)
          
          if (isToday) {
            const [hours, minutes] = timeString.split(':').map(Number)
            const slotDateTime = new Date(selectedDateObj)
            slotDateTime.setHours(hours, minutes, 0, 0)
            
            if (slotDateTime > now) {
              timesSet.add(timeString)
            }
          } else {
            timesSet.add(timeString)
          }
        }
        // Advance by 30 minutes for slot starts
        current.setMinutes(current.getMinutes() + 30)
      }
    })
    
    return Array.from(timesSet).sort()
  }, [selectedSchedules, selectedPackageData, formData.selectedDate])

  // -- Handlers --
  const handleNext = () => {
    if (step === 1 && formData.selectedPackages.length === 0) {
      setError('Please select a package to continue')
      return
    }
    if (step === 2 && (!formData.selectedDate || !formData.selectedTime || selectedSchedules.length === 0)) {
      setError('Please select both a date and time')
      return
    }
    
    setDirection(1)
    setStep(prev => prev + 1)
    setError(null)
  }

  const selectPackage = (packageId) => {
    setFormData(prev => ({ ...prev, selectedPackages: [packageId] }))
    setError(null)
    
    // Auto-advance to next step
    setTimeout(() => {
      setDirection(1)
      setStep(2)
    }, 400)
  }

  const handleDateChange = (date) => {
    setFormData(prev => ({ ...prev, selectedDate: date, selectedTime: '' }))
    const [year, month, day] = date.split('-').map(Number)
    const localDate = new Date(year, month - 1, day)
    const dayName = localDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    
    // Get ALL active schedules for this day
    const matchingSchedules = schedules.filter(s => s.dayOfWeek.toLowerCase() === dayName && s.isActive)
    
    if (matchingSchedules.length === 0) {
      setError(`Not available on ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}s. Please choose another date.`)
      setSelectedSchedules([])
    } else {
      setError(null)
      setSelectedSchedules(matchingSchedules)
    }
  }


  const handleBack = () => {
    setDirection(-1)
    setStep(prev => prev - 1)
    setError(null)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)

    try {
      const duration = parseInt(selectedPackageData?.duration) || 60
      const [year, month, day] = formData.selectedDate.split('-').map(Number)
      const [hours, minutes] = formData.selectedTime.split(':').map(Number)
      
      const startDateTime = new Date(year, month - 1, day, hours, minutes)
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000)
      
      const bookingData = {
        professionalId: professional.id,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        packageIds: formData.selectedPackages
      }
      
      console.log('🚀 Submitting Booking Payload:', JSON.stringify(bookingData, null, 2))

      await bookingService.createBooking(bookingData)
      
      // Show success notification
      addToast('Booking confirmed! Check your bookings page for details.', 'success')
      
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      logger.error('Booking failed', err)
      
      // Enhance error message for availability issues
      let errorMessage = err.message || 'Failed to create booking'
      
      if (errorMessage.toLowerCase().includes('not available') || 
          errorMessage.toLowerCase().includes('outside') ||
          errorMessage.toLowerCase().includes('no schedule')) {
        
        // Find the earliest and latest valid dates from schedules
        const validSchedules = schedulesData?.records?.filter(s => s.isActive && s.validFrom && s.validUntil) || []
        
        if (validSchedules.length > 0) {
          const validFromDates = validSchedules.map(s => new Date(s.validFrom))
          const validUntilDates = validSchedules.map(s => new Date(s.validUntil))
          
          const earliestDate = new Date(Math.min(...validFromDates))
          const latestDate = new Date(Math.max(...validUntilDates))
          
          const formatDate = (date) => date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          })
          
          errorMessage = `This date is outside the availability window.\n📅 Available: ${formatDate(earliestDate)} - ${formatDate(latestDate)}\n💡 Please select a date within this range.`
        }
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Common Props for styles
  const primaryColor = theme.colors.primary[800]

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="lg"
      className="max-h-[85vh] flex flex-col overflow-hidden"
    >
      <div className="flex flex-col h-full bg-white relative">
        {/* Header / Stepper */}
        <div className="px-6 pt-5 pb-3 border-b border-gray-100 bg-white z-20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-gray-900">
               {step === 1 && 'Select Service'}
               {step === 2 && 'Select Time'}
               {step === 3 && 'Confirm Booking'}
            </h2>
             
             {/* Simple Steps Dots */}
             <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((s) => (
                    <div 
                      key={s}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        s === step ? 'w-6' : 'w-2 opacity-30'
                      }`}
                      style={{ backgroundColor: s <= step ? primaryColor : theme.colors.gray[300] }}
                    />
                ))}
             </div>
          </div>
          
          {/* Availability Range Info */}
          {step === 2 && schedulesData?.records?.length > 0 && (() => {
            const validSchedules = schedulesData.records.filter(s => s.isActive && s.validFrom && s.validUntil)
            if (validSchedules.length === 0) return null
            
            const validFromDates = validSchedules.map(s => new Date(s.validFrom))
            const validUntilDates = validSchedules.map(s => new Date(s.validUntil))
            const earliestDate = new Date(Math.min(...validFromDates))
            const latestDate = new Date(Math.max(...validUntilDates))
            
            const formatDate = (date) => date.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })
            
            return (
              <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg flex items-center gap-2">
                <Calendar size={14} className="text-blue-600 shrink-0" />
                <p className="text-xs font-semibold text-blue-900">
                  Available: <span className="font-bold">{formatDate(earliestDate)}</span> - <span className="font-bold">{formatDate(latestDate)}</span>
                </p>
              </div>
            )
          })()}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-gray-50/30 relative">
          <AnimatePresence initial={false} custom={direction} mode='wait'>
            
            {/* STEP 1: PACKAGES */}
            {step === 1 && (
              <motion.div 
                key={1}
                custom={direction}
                key="step-1"
                {...slideVariants}
                custom={direction}
                className="px-6 py-4"
              >
                  <div className="text-center mb-6">
                     <p className="text-gray-500 text-sm">Choose a package to see availability</p>
                  </div>

                  {packagesLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse border border-gray-200" />
                      ))}
                    </div>
                  ) : (
                    <PackageSelector
                      packages={packages}
                      loading={packagesLoading}
                      selectedPackages={formData.selectedPackages}
                      selectPackage={selectPackage}
                      theme={theme}
                    />
                  )}
              </motion.div>
            )}

            {/* STEP 2: SCHEDULE */}
            {step === 2 && (
              <motion.div 
                key={2}
                custom={direction}
                variants={slideVariants}
                 initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="max-w-2xl mx-auto"
              >
                 {schedulesLoading ? (
                   <div className="space-y-4">
                     <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                     <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                   </div>
                 ) : (
                   <ScheduleSelector
                      schedules={schedules}
                      loading={schedulesLoading}
                      selectedSchedule={selectedSchedules[0]} // Use first as reference or update Selector
                      selectedDate={formData.selectedDate}
                      handleDateChange={handleDateChange}
                      selectedTime={formData.selectedTime}
                      setSelectedTime={(time) => setFormData(prev => ({ ...prev, selectedTime: time }))}
                      availableTimes={availableTimes}
                      theme={theme}
                   />
                 )}
              </motion.div>
            )}

            {/* STEP 3: REVIEW */}
            {step === 3 && (
              <motion.div 
                key={3}
                custom={direction}
                variants={slideVariants}
                 initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="max-w-xl mx-auto"
              >
                  <div className="bg-white rounded-2xl p-5 shadow-lg shadow-gray-200/50 border border-gray-100 space-y-6">
                     {/* Professional */}
                     <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 overflow-hidden">
                           {professional.profilePicture?.url ? (
                              <img src={professional.profilePicture.url} className="w-full h-full object-cover" />
                           ) : professional.firstName?.[0]}
                        </div>
                        <div>
                           <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">Professional</div>
                           <h4 className="text-base font-bold text-gray-900">{professional.firstName} {professional.lastName}</h4>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Package Info */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                           <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                             <Sparkles size={12} className="text-blue-500" /> Service
                           </div>
                           <div className="font-bold text-gray-900 text-sm mb-1">{selectedPackageData?.name}</div>
                           <p className="text-xs text-gray-500 mb-2 line-clamp-1">{selectedPackageData?.description}</p>
                           <div className="text-xs font-bold text-gray-600 flex items-center gap-1">
                                <Clock size={10} /> {selectedPackageData?.duration} mins
                           </div>
                        </div>

                        {/* Date & Time */}
                         <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                           <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                             <Calendar size={12} className="text-purple-500" /> Date & Time
                           </div>
                           <div className="font-bold text-gray-900 text-sm mb-1">
                             {formData.selectedDate ? new Date(formData.selectedDate).toLocaleDateString('en-US', { 
                               weekday: 'short', 
                               month: 'short', 
                               day: 'numeric' 
                             }) : 'No date'}
                           </div>
                           <div className="text-blue-600 text-sm font-bold flex items-center gap-1.5 mt-1">
                             <Clock size={14} />
                             {formData.selectedTime ? formatScheduleTime(formData.selectedTime) : 'No time'}
                           </div>
                        </div>
                     </div>

                     {/* Total */}
                     <div className="pt-2 flex items-center justify-between">
                        <div className="text-gray-500 text-sm font-medium">Total Amount</div>
                        <div className="text-2xl font-display font-medium text-gray-900">
                           ₦{selectedPackageData?.price}
                        </div>
                     </div>
                  </div>

                   <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-xl border border-blue-100 mt-4">
                      <ShieldCheck size={16} className="text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-blue-700 leading-relaxed opacity-80 font-medium">
                        Your booking is secure. Payment will be handled at the venue.
                      </p>
                  </div>
              </motion.div>
            )}
            
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 bg-white z-20">
           {/* Error Display */}
           {error && (
              <div className="px-4 pt-3 pb-2">
                 <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                       <p className="text-sm font-semibold text-red-900 mb-0.5">Booking Failed</p>
                       <p className="text-xs text-red-700">{error}</p>
                    </div>
                 </div>
              </div>
           )}
           
           <div className="p-4">
              <div className="max-w-2xl mx-auto flex items-center justify-between">
                 {step > 1 ? (
                   <button
                     onClick={handleBack}
                     className="px-4 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm"
                   >
                     <ChevronLeft size={16} /> Back
                   </button>
                 ) : (
                   <div /> // Spacer
                 )}

                 <div className="flex items-center gap-3">
                    {step < 3 ? (
                      <button
                       onClick={handleNext}
                       className="px-6 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                       style={{ backgroundColor: primaryColor }}
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button
                       onClick={handleSubmit}
                       disabled={loading}
                       className="px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                       style={{ backgroundColor: loading ? theme.colors.gray[400] : theme.colors.accent[600] }}
                      >
                        {loading ? (
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                           <>Confirm <CheckCircle2 size={16} /></>
                        )}
                      </button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </BaseModal>
  )
}