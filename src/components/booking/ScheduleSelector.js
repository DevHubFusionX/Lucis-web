'use client'
import { Calendar, Clock } from 'lucide-react'

export default function ScheduleSelector({
  schedules,
  loading,
  selectedSchedule,
  selectedDate,
  handleDateChange,
  selectedTime,
  setSelectedTime,
  availableTimes,
  theme
}) {
  const primaryColor = theme?.colors?.primary?.[800] || '#1F3A5F'

  const formatScheduleTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Helper to parse date string as local date (avoids UTC timezone shift)
  // Handles both 'yyyy-MM-dd' and ISO timestamp formats
  const parseLocalDate = (dateString) => {
    if (!dateString) return null
    // If ISO format (contains 'T'), parse and extract local date
    if (dateString.includes('T')) {
      const d = new Date(dateString)
      return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    }
    // Otherwise parse yyyy-MM-dd directly
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day) // month is 0-indexed
  }

  // Calculate min and max dates from schedules
  const getDateLimits = () => {
    const validSchedules = schedules.filter(s => s.isActive && s.validFrom && s.validUntil)

    if (validSchedules.length === 0) {
      const today = new Date()
      return {
        min: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`,
        max: null
      }
    }

    const validFromDates = validSchedules.map(s => parseLocalDate(s.validFrom))
    const validUntilDates = validSchedules.map(s => parseLocalDate(s.validUntil))

    const earliestDate = new Date(Math.min(...validFromDates))
    const latestDate = new Date(Math.max(...validUntilDates))

    // Use today as min if earliest is in the past
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const minDate = earliestDate > today ? earliestDate : today

    // Format as YYYY-MM-DD without timezone conversion
    const formatLocal = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    return {
      min: formatLocal(minDate),
      max: formatLocal(latestDate)
    }
  }

  const dateLimits = getDateLimits()

  // Find the next available date for a specific schedule, respecting its active window
  const getNextDateForDay = (schedule) => {
    const daysMap = {
      'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
      'thursday': 4, 'friday': 5, 'saturday': 6
    }

    const targetDay = daysMap[schedule.dayOfWeek.toLowerCase()]
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Window limits - parse as local dates to avoid timezone issues
    const validFrom = schedule.validFrom ? parseLocalDate(schedule.validFrom) : new Date(today)
    validFrom.setHours(0, 0, 0, 0)
    const validUntil = schedule.validUntil ? parseLocalDate(schedule.validUntil) : null
    if (validUntil) validUntil.setHours(23, 59, 59, 999)

    // We start searching from the later of [today, validFrom]
    let current = validFrom > today ? new Date(validFrom) : new Date(today)
    current.setHours(0, 0, 0, 0)

    // Find the first occurrence of targetDay starting from 'current'
    const daysToAdd = (targetDay - current.getDay() + 7) % 7
    current.setDate(current.getDate() + daysToAdd)

    // Verify it's not past the validUntil
    if (validUntil && current > validUntil) {
      return null
    }

    // Format as YYYY-MM-DD without timezone conversion
    return `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
  }

  const handleDayClick = (schedule) => {
    const nextDate = getNextDateForDay(schedule)
    if (nextDate) {
      handleDateChange(nextDate)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* 1. Date Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block ml-1">Select Date</label>

        <div className="flex gap-4 items-start">
          {/* Date Input */}
          <div className="relative group flex-1">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={dateLimits.min}
              max={dateLimits.max || undefined}
              className="w-full bg-white text-gray-900 font-bold border-2 border-gray-100 focus:ring-4 focus:ring-gray-50 rounded-xl px-4 py-3 outline-none transition-all cursor-pointer shadow-sm text-sm"
              style={{
                borderColor: selectedDate ? primaryColor : '#f3f4f6'
              }}
            />
          </div>

          {/* Quick Availability Indicators - Now Clickable */}
          <div className="flex-1 hidden sm:block">
            {schedules.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {/* Group schedules by day to avoid duplicate buttons */}
                {Object.values(schedules.reduce((acc, s) => {
                  if (!s.isActive) return acc;
                  if (!acc[s.dayOfWeek]) acc[s.dayOfWeek] = s;
                  return acc;
                }, {})).map((schedule) => {
                  const nextDate = getNextDateForDay(schedule)
                  const isSelected = selectedDate === nextDate

                  return (
                    <button
                      key={schedule.id}
                      type="button"
                      onClick={() => handleDayClick(schedule)}
                      className="px-2 py-1 rounded-md text-[10px] font-bold border flex items-center gap-1 transition-all hover:scale-105 cursor-pointer"
                      style={{
                        backgroundColor: isSelected ? primaryColor : '#f9fafb',
                        borderColor: isSelected ? primaryColor : '#e5e7eb',
                        color: isSelected ? '#ffffff' : '#4b5563'
                      }}
                      title={`Click to select ${schedule.dayOfWeek}`}
                    >
                      <span className="uppercase">{schedule.dayOfWeek.slice(0, 3)}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Time Selection */}
      <div className={`space-y-2 transition-opacity duration-300 ${selectedDate ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block ml-1">Select Time</label>

        {selectedDate && (
          <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4">
            {availableTimes.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                {availableTimes.map((time) => {
                  const isSelected = selectedTime === time
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`
                        relative py-2 px-1 rounded-lg text-xs font-bold border transition-all duration-200
                        ${isSelected ? 'shadow-md scale-105' : 'hover:border-gray-300 hover:bg-white'}
                      `}
                      style={{
                        backgroundColor: isSelected ? primaryColor : '#ffffff',
                        borderColor: isSelected ? primaryColor : 'transparent',
                        color: isSelected ? '#ffffff' : '#4b5563'
                      }}
                    >
                      {formatScheduleTime(time)}
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-center">
                <Clock size={20} className="text-gray-300 mb-2" />
                <p className="text-xs text-gray-400 font-medium">No slots available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


