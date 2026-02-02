'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format, addDays, parseISO, isBefore } from 'date-fns'
import professionalService from '../../../../services/professionalService'
import { theme } from '../../../../lib/theme'
import { cn } from '../../../../lib/utils'
import {
  Calendar, Clock, Plus, Trash2,
  Info, CheckCircle2, ChevronRight,
  HelpCircle, AlertCircle, Loader2
} from 'lucide-react'

const availabilitySchema = z.object({
  selectedDays: z.array(z.string()).min(1, 'Please select at least one day'),
  timeSlots: z.array(z.object({
    start: z.string().min(1, 'Start time is required'),
    end: z.string().min(1, 'End time is required')
  })).min(1, 'Please add at least one time slot'),
  validFrom: z.string().min(1, 'Valid from date is required'),
  validUntil: z.string().min(1, 'Valid until date is required')
}).refine((data) => {
  return data.timeSlots.every(slot => {
    return slot.start < slot.end
  })
}, {
  message: "Start time must be before end time",
  path: ["timeSlots"] // This will associate the error with the array itself
})

export default function AvailabilityPage() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showHelp, setShowHelp] = useState(true)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitted }
  } = useForm({
    resolver: zodResolver(availabilitySchema),
    mode: 'onChange',
    defaultValues: {
      selectedDays: [],
      timeSlots: [{ start: '09:00', end: '17:00' }],
      validFrom: format(new Date(), 'yyyy-MM-dd'),
      validUntil: format(addDays(new Date(), 90), 'yyyy-MM-dd')
    }
  })

  // Debug errors
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Form Validation Errors:', errors)
    }
  }, [errors])

  const { fields, append, remove } = useFieldArray({
    control,
    name: "timeSlots"
  })

  const formData = watch()
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
    const current = formData.selectedDays
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day]
    setValue('selectedDays', updated, { shouldValidate: true })
  }

  const onSaveAvailability = async (data) => {
    setLoading(true)
    try {
      let successCount = 0
      for (const day of data.selectedDays) {
        for (const slot of data.timeSlots) {
          await professionalService.createSchedule({
            dayOfWeek: day.toLowerCase(),
            startTime: slot.start + ':00',
            endTime: slot.end + ':00',
            isActive: true,
            validFrom: data.validFrom,
            validUntil: data.validUntil
          })
          successCount++
        }
      }

      setMessage({ type: 'success', text: `Successfully saved ${successCount} availability slots!` })
      setValue('selectedDays', [])
      setValue('timeSlots', [{ start: '09:00', end: '17:00' }])
      await loadSchedules()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (err) {
      setMessage({ type: 'error', text: `Failed to save: ${err.message}` })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } finally {
      setLoading(false)
    }
  }

  const deleteSchedule = async (id) => {
    try {
      await professionalService.deleteSchedule(id)
      setMessage({ type: 'success', text: 'Slot removed' })
      await loadSchedules()
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: theme.typography.fontFamily.display.join(', ') }}>
            Availability Manager
          </h1>
          <p className="text-gray-500 mt-2 text-lg">Control when clients can book your services</p>
        </div>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <HelpCircle size={18} />
          {showHelp ? 'Hide Help' : 'How it works'}
        </button>
      </header>

      {/* Help Section */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">1</div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Pick Days</h4>
                  <p className="text-sm text-blue-700">Select which days of the week you want to work.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">2</div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Set Hours</h4>
                  <p className="text-sm text-blue-700">Add one or more time slots for those days.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">3</div>
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Active Window</h4>
                  <p className="text-sm text-blue-700">Define the date range these slots will stay active.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-xl flex items-center gap-3 border shadow-sm ${message.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-100'
              : 'bg-green-50 text-green-700 border-green-100'
              }`}
          >
            {message.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            <span className="font-medium">{message.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Setup Column */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="space-y-10">

              {/* Step 1: Days */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-50 text-accent-600 rounded-xl flex items-center justify-center font-bold">1</div>
                    <h2 className="text-xl font-bold text-gray-900">Which days are you available?</h2>
                  </div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Required</span>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                  {days.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "group flex flex-col items-center p-4 rounded-2xl transition-all border-2",
                        formData.selectedDays.includes(day)
                          ? "border-accent-500 bg-accent-50 text-accent-700"
                          : "border-gray-100 bg-white text-gray-500"
                      )}
                    >
                      <span className="text-xs font-bold uppercase tracking-tighter mb-1">{day.slice(0, 3)}</span>
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center transition-all",
                        formData.selectedDays.includes(day) ? "bg-accent-500 text-white" : "bg-gray-100"
                      )}>
                        {formData.selectedDays.includes(day) ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 rounded-full bg-gray-300" />}
                      </div>
                    </button>
                  ))}
                </div>
                {errors.selectedDays && <p className="text-red-500 text-xs mt-3 ml-1">{errors.selectedDays.message}</p>}
              </section>

              {/* Step 2: Times */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-50 text-accent-600 rounded-xl flex items-center justify-center font-bold">2</div>
                    <h2 className="text-xl font-bold text-gray-900">At what times?</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group">
                      <div className="flex-1 w-full space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Start Time</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="time"
                            {...register(`timeSlots.${index}.start`)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                      <div className="hidden sm:block text-gray-300 font-bold mt-5 italic">to</div>
                      <div className="flex-1 w-full space-y-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">End Time</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="time"
                            {...register(`timeSlots.${index}.end`)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-accent-500 focus:border-transparent outline-none transition-all font-medium"
                          />
                        </div>
                      </div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-5 p-3 text-red-500 hover:bg-red-100 rounded-xl transition-colors sm:opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => append({ start: '09:00', end: '17:00' })}
                    className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 font-bold hover:border-accent-300 hover:text-accent-600 hover:bg-accent-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={20} />
                    Add another time block
                  </button>
                  {errors.timeSlots && <p className="text-red-500 text-xs mt-2 ml-1">{errors.timeSlots.message}</p>}
                </div>
              </section>

              {/* Step 3: Range */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent-50 text-accent-600 rounded-xl flex items-center justify-center font-bold">3</div>
                    <h2 className="text-xl font-bold text-gray-900">Active range</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-gray-50 border border-gray-100 rounded-2xl">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">From</label>
                    <input
                      type="date"
                      {...register('validFrom')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-accent-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Until</label>
                    <input
                      type="date"
                      {...register('validUntil')}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-accent-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                {(errors.validFrom || errors.validUntil) && (
                  <p className="text-red-500 text-xs mt-3 ml-1">
                    {errors.validFrom?.message || errors.validUntil?.message}
                  </p>
                )}
              </section>

              {/* Validation Summary */}
              {isSubmitted && !isValid && (
                <div className="p-5 bg-red-50 border border-red-100 rounded-3xl space-y-3">
                  <div className="flex items-center gap-3 text-red-700">
                    <AlertCircle size={22} className="shrink-0" />
                    <p className="font-bold text-lg">Wait, some things are missing!</p>
                  </div>
                  <ul className="space-y-2 ml-9">
                    {errors.selectedDays && (
                      <li className="text-red-600 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <strong>Step 1:</strong> {errors.selectedDays.message}
                      </li>
                    )}
                    {errors.timeSlots && (
                      <li className="text-red-600 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <strong>Step 2:</strong> {errors.timeSlots.root?.message || errors.timeSlots.message || "Check your time slots"}
                      </li>
                    )}
                    {formData.timeSlots.map((_, idx) => (
                      errors.timeSlots?.[idx] && (
                        <li key={idx} className="text-red-500 text-xs ml-4 flex items-center gap-2 italic">
                          <span>↳ Slot #{idx + 1}: {errors.timeSlots[idx].start?.message || errors.timeSlots[idx].end?.message || "Invalid range"}</span>
                        </li>
                      )
                    ))}
                    {(errors.validFrom || errors.validUntil) && (
                      <li className="text-red-600 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                        <strong>Step 3:</strong> {errors.validFrom?.message || errors.validUntil?.message}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit(onSaveAvailability)}
                disabled={loading}
                className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-xl hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 disabled:opacity-50 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin text-accent-500" />
                    <span>Saving Schedule...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Setup</span>
                    <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

            </div>
          </motion.div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-5">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-between">
              Your Current Schedule
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-lg">{schedules.length} Items</span>
            </h2>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {schedules.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
                    <Calendar size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">No slots yet</h3>
                  <p className="text-sm text-gray-500 px-6">Set your availability on the left to start receiving bookings!</p>
                </div>
              ) : (
                schedules.map((schedule) => (
                  <motion.div
                    layout
                    key={schedule.id}
                    className="group p-5 rounded-2xl border border-gray-100 bg-white hover:border-accent-200 hover:shadow-lg hover:shadow-accent-50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${schedule.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                          <div className={`w-3 h-3 rounded-full ${schedule.isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-400'}`} />
                        </div>
                        <span className="text-lg font-bold text-gray-900 capitalize italic">{schedule.dayOfWeek}</span>
                      </div>
                      <button
                        onClick={() => deleteSchedule(schedule.id)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium text-gray-600 pl-1">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-accent-500" />
                        <span>{schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-400 bg-gray-50 p-2 rounded-lg">
                      <span>{new Date(schedule.validFrom).toLocaleDateString()}</span>
                      <ChevronRight size={10} />
                      <span>{new Date(schedule.validUntil).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

