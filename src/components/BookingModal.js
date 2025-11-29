'use client'
import { useState, useEffect } from 'react'
import bookingService from '../services/bookingService'
import professionalService from '../services/professionalService'
import { theme } from '../lib/theme'
import ScheduleSelector from './booking/ScheduleSelector'
import PackageSelector from './booking/PackageSelector'

export default function BookingModal({ professional, isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [packagesLoading, setPackagesLoading] = useState(false)
  const [schedulesLoading, setSchedulesLoading] = useState(false)
  const [packages, setPackages] = useState([])
  const [schedules, setSchedules] = useState([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [formData, setFormData] = useState({
    selectedPackages: []
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('🔍 Debug - Form values:', {
        selectedDate,
        selectedTime,
        selectedPackages: formData.selectedPackages
      })

      const selectedPackage = packages.find(pkg => formData.selectedPackages.includes(pkg.id))
      const duration = selectedPackage?.duration || 60
      
      console.log('🔍 Debug - Package info:', { 
        selectedPackage, 
        duration, 
        packageDuration: selectedPackage?.duration,
        packageId: selectedPackage?.id
      })
      
      // Ensure duration is a valid number
      const validDuration = Number(duration) || 60
      
      // Create proper datetime strings in UTC to match server expectations
      const dateTimeString = `${selectedDate}T${selectedTime}:00Z`
      console.log('🔍 Debug - DateTime string (UTC):', dateTimeString)
      
      const startDateTime = new Date(dateTimeString)
      const endDateTime = new Date(startDateTime.getTime() + validDuration * 60000)
      
      console.log('🔍 Debug - Duration calculation:', {
        originalDuration: duration,
        validDuration,
        startTime: startDateTime.getTime(),
        durationMs: validDuration * 60000,
        endTime: startDateTime.getTime() + validDuration * 60000
      })

      console.log('🔍 Debug - Created dates:', {
        startDateTime: startDateTime.toString(),
        endDateTime: endDateTime.toString(),
        startValid: !isNaN(startDateTime.getTime()),
        endValid: !isNaN(endDateTime.getTime())
      })

      // Validate dates
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error('Invalid date or time selected')
      }

      const bookingData = {
        professionalId: professional.id,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
        packageIds: formData.selectedPackages
      }

      console.log('🔍 Debug - Final booking data:', bookingData)
      await bookingService.createBooking(bookingData)
      onSuccess?.()
      onClose()
      alert('✅ Booking request sent successfully!')
    } catch (error) {
      console.error('❌ Booking failed:', error)
      alert(`❌ Failed to create booking: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && professional?.id) {
      fetchPackages()
      fetchSchedules()
    }
  }, [isOpen, professional?.id])

  const fetchPackages = async () => {
    setPackagesLoading(true)
    try {
      const response = await professionalService.getPackagesByProfessional(professional.id)
      setPackages(response.records || [])
    } catch (error) {
      console.error('Failed to fetch packages:', error)
      setPackages([])
    } finally {
      setPackagesLoading(false)
    }
  }

  const fetchSchedules = async () => {
    setSchedulesLoading(true)
    try {
      const response = await professionalService.getProfessionalSchedules(professional.id)
      setSchedules(response.records || [])
    } catch (error) {
      console.error('Failed to fetch schedules:', error)
      setSchedules([])
    } finally {
      setSchedulesLoading(false)
    }
  }

  const formatScheduleTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const selectPackage = (packageId) => {
    setFormData(prev => ({
      ...prev,
      selectedPackages: [packageId]
    }))
  }

  const getAvailableTimes = () => {
    if (!selectedSchedule) return []
    const times = []
    const start = new Date(`2000-01-01T${selectedSchedule.startTime}`)
    const end = new Date(`2000-01-01T${selectedSchedule.endTime}`)
    
    // Get selected package duration or default to 60
    const selectedPackage = packages.find(pkg => formData.selectedPackages.includes(pkg.id))
    const duration = selectedPackage?.duration || 60

    while (start < end) {
      // Check if this slot + duration fits within the schedule
      const slotEnd = new Date(start.getTime() + duration * 60000)
      
      if (slotEnd <= end) {
        times.push(start.toTimeString().slice(0, 5))
      }
      
      start.setMinutes(start.getMinutes() + 30)
    }
    return times
  }

  const handleDateChange = (date) => {
    setSelectedDate(date)
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    const schedule = schedules.find(s => s.dayOfWeek === dayOfWeek && s.isActive)
    setSelectedSchedule(schedule)
    setSelectedTime('')
  }

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule)
    // Set date to next occurrence of this day
    const today = new Date()
    const targetDay = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(schedule.dayOfWeek)
    const currentDay = today.getDay()
    const daysUntilTarget = (targetDay - currentDay + 7) % 7 || 7
    const targetDate = new Date(today.getTime() + daysUntilTarget * 24 * 60 * 60 * 1000)
    setSelectedDate(targetDate.toISOString().split('T')[0])
    setSelectedTime('')
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    }}>
      <div style={{
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        maxWidth: '900px',
        width: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.lg
        }}>
          <h2 style={{
            fontSize: theme.typography.fontSize['2xl'],
            fontWeight: 'bold',
            color: theme.colors.neutral.deepGray,
            fontFamily: theme.typography.fontFamily.display.join(', ')
          }}>
            Book {professional.firstName} {professional.lastName}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: theme.spacing.xs,
              borderRadius: theme.borderRadius.md,
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme.colors.gray[400]
            }}
          >
            <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xl }}>
            {/* Left Column - Schedule & Date Selection */}
            <ScheduleSelector
              schedules={schedules}
              loading={schedulesLoading}
              selectedSchedule={selectedSchedule}
              handleScheduleClick={handleScheduleClick}
              selectedDate={selectedDate}
              handleDateChange={handleDateChange}
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              getAvailableTimes={getAvailableTimes}
            />

            {/* Right Column - Package Selection */}
            <PackageSelector
              packages={packages}
              loading={packagesLoading}
              selectedPackages={formData.selectedPackages}
              selectPackage={selectPackage}
            />
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: theme.spacing.sm,
            marginTop: theme.spacing.xl,
            paddingTop: theme.spacing.lg,
            borderTop: `1px solid ${theme.colors.gray[200]}`
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.lg,
                border: `2px solid ${theme.colors.gray[200]}`,
                backgroundColor: theme.colors.white,
                color: theme.colors.gray[700],
                fontWeight: '600',
                fontFamily: theme.typography.fontFamily.sans.join(', '),
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedDate || !selectedTime || formData.selectedPackages.length === 0}
              style={{
                flex: 2,
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.lg,
                border: 'none',
                backgroundColor: theme.colors.primary[800],
                color: theme.colors.white,
                fontWeight: '600',
                fontFamily: theme.typography.fontFamily.sans.join(', '),
                cursor: 'pointer',
                opacity: (loading || !selectedDate || !selectedTime || formData.selectedPackages.length === 0) ? 0.5 : 1
              }}
            >
              {loading ? '⏳ Booking...' : 'Book Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}