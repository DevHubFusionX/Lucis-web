'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import professionalService from '../../../../services/professionalService'
import { theme } from '../../../../lib/theme'
import { Calendar, Clock, Plus, Trash2 } from 'lucide-react'

export default function AvailabilityPage() {
  const [schedules, setSchedules] = useState([])
  const [selectedDays, setSelectedDays] = useState([])
  const [timeSlots, setTimeSlots] = useState([{ start: '09:00', end: '17:00' }])
  const [validPeriod, setValidPeriod] = useState({ 
    from: new Date().toISOString().split('T')[0], 
    until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    try {
      const response = await professionalService.getSchedules()
      setSchedules(response.records || [])
    } catch (err) {
      console.error('Failed to load schedules:', err)
    }
  }

  const toggleDay = (day) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { start: '09:00', end: '17:00' }])
  }

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index))
  }

  const updateTimeSlot = (index, field, value) => {
    const updated = [...timeSlots]
    updated[index][field] = value
    setTimeSlots(updated)
  }

  const saveAvailability = async () => {
    if (selectedDays.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one day' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }

    setLoading(true)
    try {
      for (const day of selectedDays) {
        for (const slot of timeSlots) {
          await professionalService.createSchedule({
            dayOfWeek: day.toLowerCase(),
            startTime: slot.start + ':00',
            endTime: slot.end + ':00',
            isActive: true,
            validFrom: validPeriod.from,
            validUntil: validPeriod.until
          })
        }
      }
      
      setMessage({ type: 'success', text: 'Availability saved successfully!' })
      setSelectedDays([])
      setTimeSlots([{ start: '09:00', end: '17:00' }])
      await loadSchedules()
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  const deleteSchedule = async (id) => {
    try {
      await professionalService.deleteSchedule(id)
      setMessage({ type: 'success', text: 'Schedule deleted' })
      await loadSchedules()
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
          Set Your Availability
        </h1>
        <p className="text-gray-600">Choose when you're available to take bookings</p>
      </motion.div>

      {message.text && (
        <div className={`p-4 rounded-xl ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Set Availability */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5" style={{ color: theme.colors.accent[600] }} />
            <h2 className="text-xl font-bold text-gray-900">Select Days</h2>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6">
            {days.map(day => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className="flex flex-col items-center p-3 rounded-xl transition-all"
                style={{
                  background: selectedDays.includes(day) 
                    ? `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})`
                    : '#F9FAFB',
                  color: selectedDays.includes(day) ? 'white' : '#6B7280'
                }}
              >
                <span className="text-xs font-semibold">{day.slice(0, 3)}</span>
                {selectedDays.includes(day) && (
                  <svg className="w-4 h-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" style={{ color: theme.colors.accent[600] }} />
            <h3 className="text-lg font-bold text-gray-900">Time Slots</h3>
          </div>

          {timeSlots.map((slot, index) => (
            <div key={index} className="flex items-center gap-3 mb-3">
              <input
                type="time"
                value={slot.start}
                onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2"
                style={{ focusRingColor: theme.colors.accent[500] }}
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                value={slot.end}
                onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2"
                style={{ focusRingColor: theme.colors.accent[500] }}
              />
              {timeSlots.length > 1 && (
                <button onClick={() => removeTimeSlot(index)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}

          <button onClick={addTimeSlot} className="w-full py-2 mb-6 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add Time Slot
          </button>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Valid From</label>
              <input
                type="date"
                value={validPeriod.from}
                onChange={(e) => setValidPeriod({...validPeriod, from: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Valid Until</label>
              <input
                type="date"
                value={validPeriod.until}
                onChange={(e) => setValidPeriod({...validPeriod, until: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200"
              />
            </div>
          </div>

          <button
            onClick={saveAvailability}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            style={{ background: `linear-gradient(135deg, ${theme.colors.accent[500]}, ${theme.colors.accent[600]})` }}
          >
            {loading ? 'Saving...' : 'Save Availability'}
          </button>
        </motion.div>

        {/* Current Schedules */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Schedules</h2>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {schedules.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No schedules yet</p>
                <p className="text-sm text-gray-400 mt-1">Set your availability to get started</p>
              </div>
            ) : (
              schedules.map((schedule) => (
                <div key={schedule.id} className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${schedule.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="font-semibold text-gray-900 capitalize">{schedule.dayOfWeek}</span>
                    </div>
                    <button onClick={() => deleteSchedule(schedule.id)} className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{schedule.startTime} - {schedule.endTime}</p>
                  <p className="text-xs text-gray-500">{schedule.validFrom} to {schedule.validUntil}</p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
