'use client'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format, parse, addMinutes, isAfter, isToday, isBefore, startOfDay } from 'date-fns'
import bookingService from '../services/bookingService'
import professionalService from '../services/professionalService'
import logger from '../utils/logger'
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
} from 'lucide-react'
import BookingReview from './booking/BookingReview'
import { useBookingMutation } from '../hooks/useBookings'
import { theme } from '../lib/theme'
import { cn } from '../lib/utils'

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

const bookingSchema = z.object({
  selectedPackages: z.array(z.string()).min(1, 'Please select a package'),
  selectedDate: z.string().min(1, 'Please select a date'),
  selectedTime: z.string().min(1, 'Please select a time')
})

/**
 * Booking modal with step-based wizard flow
 */
export default function BookingModal({ professional, isOpen, onClose, onSuccess }) {
  // -- Hooks
  const { addToast } = useToast()

  // -- Form State --
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      selectedPackages: [],
      selectedDate: '',
      selectedTime: ''
    }
  })

  const formData = watch()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [error, setError] = useState(null)
  const [selectedSchedules, setSelectedSchedules] = useState([])

  // -- Data Fetching with TanStack Query --
  const { data: packagesData, isLoading: packagesLoading } = useQuery({
    queryKey: ['packages', professional?.id],
    queryFn: () => professionalService.getPackagesByProfessional(professional.id),
    enabled: isOpen && !!professional?.id
  })
  const packages = packagesData?.records || []

  const { data: schedulesData, isLoading: schedulesLoading } = useQuery({
    queryKey: ['schedules', professional?.id],
    queryFn: () => professionalService.getProfessionalSchedules(professional.id),
    enabled: isOpen && !!professional?.id
  })
  const schedules = schedulesData?.records || []

  // -- Helpers --
  const selectedPackagesData = useMemo(() =>
    packages.filter(pkg => formData.selectedPackages.includes(pkg.id)),
    [packages, formData.selectedPackages]
  )

  const totalDuration = useMemo(() =>
    selectedPackagesData.reduce((acc, pkg) => acc + (parseInt(pkg.duration) || 0), 0),
    [selectedPackagesData]
  )

  const totalPrice = useMemo(() =>
    selectedPackagesData.reduce((acc, pkg) => acc + (parseFloat(pkg.price) || 0), 0),
    [selectedPackagesData]
  )

  // Calculate Available Times with date-fns
  const availableTimes = useMemo(() => {
    if (!selectedSchedules || selectedSchedules.length === 0) return []

    const timesSet = new Set()
    const duration = totalDuration || 60
    const now = new Date()

    console.log('[DEBUG] availableTimes calculating. selectedSchedules:', selectedSchedules.length, 'totalDuration:', duration)

    const baseDate = formData.selectedDate ? parse(formData.selectedDate, 'yyyy-MM-dd', new Date()) : now

    selectedSchedules.forEach(schedule => {
      console.log('[DEBUG] Processing schedule:', { startTime: schedule.startTime, endTime: schedule.endTime })

      // Normalize time strings - remove milliseconds if present (09:00:00.000 -> 09:00:00)
      const normalizeTime = (timeStr) => {
        if (!timeStr) return timeStr
        // Remove milliseconds (.000) if present
        return timeStr.replace(/\.\d{3}$/, '')
      }

      const startTimeNormalized = normalizeTime(schedule.startTime)
      const endTimeNormalized = normalizeTime(schedule.endTime)
      console.log('[DEBUG] Normalized times:', { start: startTimeNormalized, end: endTimeNormalized })

      // Robust parsing for multiple formats
      let start, end
      const formats = ['HH:mm:ss', 'HH:mm']

      for (const f of formats) {
        const s = parse(startTimeNormalized, f, baseDate)
        const e = parse(endTimeNormalized, f, baseDate)
        console.log('[DEBUG] Trying format:', f, '-> start:', s, 'end:', e, 'valid:', !isNaN(s.getTime()) && !isNaN(e.getTime()))
        if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
          start = s
          end = e
          break
        }
      }

      if (!start || !end) {
        console.log('[DEBUG] Failed to parse schedule times')
        return
      }

      console.log('[DEBUG] Parsed times - start:', start, 'end:', end)

      let current = start
      while (isBefore(current, end)) {
        const slotEnd = addMinutes(current, duration)

        if (!isAfter(slotEnd, end)) {
          const timeString = format(current, 'HH:mm')

          // If session is today, only show future slots
          if (isToday(baseDate)) {
            if (isAfter(current, now)) {
              timesSet.add(timeString)
            }
          } else {
            timesSet.add(timeString)
          }
        }
        // Advance by 30 minutes for slot starts
        current = addMinutes(current, 30)
      }
    })

    const result = Array.from(timesSet).sort()
    console.log('[DEBUG] availableTimes result:', result)
    return result
  }, [selectedSchedules, totalDuration, formData.selectedDate])

  // -- Handlers --
  const handleNext = async () => {
    let isValid = false
    if (step === 1) {
      isValid = await trigger('selectedPackages')
    } else if (step === 2) {
      isValid = await trigger(['selectedDate', 'selectedTime'])
    }

    if (isValid) {
      setDirection(1)
      setStep(prev => prev + 1)
      setError(null)
    }
  }

  const selectPackage = (packageId) => {
    const current = [...formData.selectedPackages]
    const index = current.indexOf(packageId)

    if (index > -1) {
      current.splice(index, 1)
    } else {
      current.push(packageId)
    }

    setValue('selectedPackages', current, { shouldValidate: true })
    setError(null)
  }

  const handleDateChange = (date) => {
    setValue('selectedDate', date, { shouldValidate: true })
    setValue('selectedTime', '', { shouldValidate: false })

    const parsedDate = parse(date, 'yyyy-MM-dd', new Date())
    const dayName = format(parsedDate, 'eeee').toLowerCase()

    // Get ALL active schedules for this day that are also within the valid date range
    const matchingSchedules = schedules.filter(s => {
      if (!s.isActive || s.dayOfWeek.toLowerCase() !== dayName) return false

      // Helper to parse dates that might be ISO or yyyy-MM-dd format
      const parseFlexibleDate = (dateStr) => {
        if (!dateStr) return null
        // Try ISO format first (includes T), then yyyy-MM-dd
        if (dateStr.includes('T')) {
          return startOfDay(new Date(dateStr))
        }
        return startOfDay(parse(dateStr, 'yyyy-MM-dd', new Date()))
      }

      const validFrom = parseFlexibleDate(s.validFrom)
      const validUntil = parseFlexibleDate(s.validUntil)
      const current = startOfDay(parsedDate)

      if (validFrom && current < validFrom) return false
      if (validUntil && current > validUntil) return false

      return true
    })

    console.log('[DEBUG] handleDateChange:', { date, dayName, schedulesCount: schedules.length })
    console.log('[DEBUG] All schedules:', schedules.map(s => ({ day: s.dayOfWeek, isActive: s.isActive, validFrom: s.validFrom, validUntil: s.validUntil })))

    if (matchingSchedules.length === 0) {
      // Check if it's generally a bad day or just out of range
      const hasAnyScheduleForDay = schedules.some(s => s.dayOfWeek.toLowerCase() === dayName && s.isActive)
      console.log('[DEBUG] No matching schedules. hasAnyScheduleForDay:', hasAnyScheduleForDay)
      if (hasAnyScheduleForDay) {
        setError(`This date is outside the active availability window for ${format(parsedDate, 'eeee')}s.`)
      } else {
        setError(`Not available on ${format(parsedDate, 'eeee')}s. Please choose another date.`)
      }
      setSelectedSchedules([])
    } else {
      console.log('[DEBUG] Matching schedules found:', matchingSchedules.map(s => ({ day: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime })))
      setError(null)
      setSelectedSchedules(matchingSchedules)
    }
  }

  const { mutateAsync: createBooking, isPending: submitting } = useBookingMutation()

  const handleBack = () => {
    setDirection(-1)
    setStep(prev => prev - 1)
    setError(null)
  }

  const onBookingSubmit = async (data) => {
    setError(null)

    try {
      const duration = totalDuration || 60
      const baseDate = parse(data.selectedDate, 'yyyy-MM-dd', new Date())
      const startDateTime = parse(data.selectedTime, 'HH:mm', baseDate)
      const endDateTime = addMinutes(startDateTime, duration)

      const bookingData = {
        professionalId: professional.id,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        packageId: data.selectedPackages[0], // Using primary package ID
        packageIds: data.selectedPackages, // Sending all packages
        totalPrice: totalPrice,
        status: 'pending'
      }

      await createBooking(bookingData)
      addToast('Booking request sent successfully!', 'success')
      onSuccess?.()
      onClose()
    } catch (err) {
      let errorMessage = err?.message || 'Failed to create booking'

      if (errorMessage.toLowerCase().includes('not available') ||
        errorMessage.toLowerCase().includes('outside') ||
        errorMessage.toLowerCase().includes('no schedule')) {

        const activeSchedules = schedules.filter(s => s.isActive && s.validFrom && s.validUntil)
        if (activeSchedules.length > 0) {
          const validFromDates = activeSchedules.map(s => parse(s.validFrom, 'yyyy-MM-dd', new Date()))
          const validUntilDates = activeSchedules.map(s => parse(s.validUntil, 'yyyy-MM-dd', new Date()))

          const earliestDate = new Date(Math.min(...validFromDates))
          const latestDate = new Date(Math.max(...validUntilDates))

          errorMessage = `This date is outside the availability window.\n📅 Available: ${format(earliestDate, 'MMM d, yyyy')} - ${format(latestDate, 'MMM d, yyyy')}\n💡 Please select a date within this range.`
        }
      }

      setError(errorMessage)
      logger.error('Booking submission error:', err)
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
                  className={`h-2 rounded-full transition-all duration-300 ${s === step ? 'w-6' : 'w-2 opacity-30'
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
                {...slideVariants}
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
                {errors.selectedPackages && <p className="text-red-500 text-xs text-center mt-2">{errors.selectedPackages.message}</p>}
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
                    selectedSchedule={selectedSchedules[0]}
                    selectedDate={formData.selectedDate}
                    handleDateChange={handleDateChange}
                    selectedTime={formData.selectedTime}
                    setSelectedTime={(time) => setValue('selectedTime', time, { shouldValidate: true })}
                    availableTimes={availableTimes}
                    theme={theme}
                  />
                )}
                {(errors.selectedDate || errors.selectedTime) && (
                  <p className="text-red-500 text-xs text-center mt-4">
                    {errors.selectedDate?.message || errors.selectedTime?.message}
                  </p>
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
              >
                <BookingReview
                  professional={professional}
                  selectedPackages={selectedPackagesData}
                  selectedDate={formData.selectedDate}
                  selectedTime={formData.selectedTime}
                  totalPrice={totalPrice}
                  theme={theme}
                />
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
                  <p className="text-xs text-red-700 whitespace-pre-line">{error}</p>
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
                    onClick={handleSubmit(onBookingSubmit)}
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
                    style={{ backgroundColor: submitting ? theme.colors.gray[400] : theme.colors.accent[600] }}
                  >
                    {submitting ? (
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