'use client'
import { useState, useEffect } from 'react'
import professionalService from '../../../../services/professionalService'
import { theme } from '../../../../lib/theme'

export default function AvailabilityPage() {
  const [schedules, setSchedules] = useState([])
  const [workingDays, setWorkingDays] = useState({
    Monday: false, Tuesday: false, Wednesday: false, Thursday: false, Friday: false, Saturday: false, Sunday: false
  })
  const [hours, setHours] = useState({ start: '09:00', end: '18:00' })
  const [validPeriod, setValidPeriod] = useState({ from: '', until: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [editForm, setEditForm] = useState({})

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  useEffect(() => {
    loadSchedules()
  }, [])

  const loadSchedules = async () => {
    try {
      setLoading(true)
      const response = await professionalService.getSchedules()
      const scheduleData = response.records || []
      setSchedules(scheduleData)
      
      // Update working days based on existing schedules
      const activeDays = {}
      scheduleData.forEach(schedule => {
        if (schedule.isActive) {
          activeDays[schedule.dayOfWeek.charAt(0).toUpperCase() + schedule.dayOfWeek.slice(1)] = true
        }
      })
      setWorkingDays(prev => ({ ...prev, ...activeDays }))
      
      // Set hours from first active schedule
      const firstSchedule = scheduleData.find(s => s.isActive)
      if (firstSchedule) {
        setHours({ start: firstSchedule.startTime, end: firstSchedule.endTime })
        setValidPeriod({ from: firstSchedule.validFrom, until: firstSchedule.validUntil })
      }
    } catch (err) {
      setError('Failed to load schedules')
    } finally {
      setLoading(false)
    }
  }

  const toggleDay = async (day) => {
    const isCurrentlyActive = workingDays[day]
    const dayLower = day.toLowerCase()
    
    try {
      if (isCurrentlyActive) {
        // Find and delete existing schedule
        const existingSchedule = schedules.find(s => s.dayOfWeek === dayLower)
        if (existingSchedule) {
          await professionalService.deleteSchedule(existingSchedule.id)
        }
      } else {
        // Create new schedule
        const scheduleData = {
          dayOfWeek: dayLower,
          startTime: hours.start + ':00',
          endTime: hours.end + ':00',
          isActive: true,
          validFrom: validPeriod.from || new Date().toISOString().split('T')[0],
          validUntil: validPeriod.until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
        await professionalService.createSchedule(scheduleData)
      }
      
      setWorkingDays(prev => ({ ...prev, [day]: !prev[day] }))
      await loadSchedules()
      setSuccess(`Schedule ${isCurrentlyActive ? 'removed' : 'created'} for ${day}`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const updateAllSchedules = async () => {
    try {
      setLoading(true)
      const activeSchedules = schedules.filter(s => workingDays[s.dayOfWeek.charAt(0).toUpperCase() + s.dayOfWeek.slice(1)])
      
      for (const schedule of activeSchedules) {
        const updatedData = {
          dayOfWeek: schedule.dayOfWeek,
          startTime: hours.start + ':00',
          endTime: hours.end + ':00',
          isActive: true,
          validFrom: validPeriod.from || schedule.validFrom,
          validUntil: validPeriod.until || schedule.validUntil
        }
        await professionalService.updateSchedule(schedule.id, updatedData)
      }
      
      await loadSchedules()
      setSuccess('All schedules updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    } finally {
      setLoading(false)
    }
  }

  const startEditSchedule = (schedule) => {
    setEditingSchedule(schedule.id)
    setEditForm({
      startTime: schedule.startTime.slice(0, 5),
      endTime: schedule.endTime.slice(0, 5),
      validFrom: schedule.validFrom,
      validUntil: schedule.validUntil,
      isActive: schedule.isActive
    })
  }

  const cancelEdit = () => {
    setEditingSchedule(null)
    setEditForm({})
  }

  const updateIndividualSchedule = async (scheduleId) => {
    try {
      const schedule = schedules.find(s => s.id === scheduleId)
      const updatedData = {
        dayOfWeek: schedule.dayOfWeek,
        startTime: editForm.startTime + ':00',
        endTime: editForm.endTime + ':00',
        isActive: editForm.isActive,
        validFrom: editForm.validFrom,
        validUntil: editForm.validUntil
      }
      
      await professionalService.updateSchedule(scheduleId, updatedData)
      await loadSchedules()
      setEditingSchedule(null)
      setEditForm({})
      setSuccess('Schedule updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const deleteIndividualSchedule = async (scheduleId) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return
    
    try {
      await professionalService.deleteSchedule(scheduleId)
      await loadSchedules()
      setSuccess('Schedule deleted successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div style={{ padding: theme.spacing.md }}>
      {/* Header */}
      <div style={{ marginBottom: theme.spacing.lg }}>
        <h1 style={{ 
          fontSize: theme.typography.fontSize['3xl'], 
          fontWeight: 'bold', 
          color: theme.colors.gray[900],
          marginBottom: theme.spacing.xs
        }}>Availability</h1>
        <p style={{ color: theme.colors.gray[600] }}>Manage your schedule and availability</p>
        
        {error && (
          <div style={{
            marginTop: theme.spacing.sm,
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: '#FEE2E2',
            color: '#DC2626'
          }}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={{
            marginTop: theme.spacing.sm,
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: '#D1FAE5',
            color: '#065F46'
          }}>
            {success}
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.lg }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
          {/* Working Days */}
          <div style={{
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.xl,
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.gray[200]}`,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginBottom: theme.spacing.sm }}>
              <svg style={{ width: '20px', height: '20px', color: theme.colors.primary[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v16a2 2 0 002 2z" />
              </svg>
              <h2 style={{ fontSize: theme.typography.fontSize.lg, fontWeight: '600', color: theme.colors.gray[900] }}>Working Days</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: theme.spacing.xs }}>
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  style={{
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.lg,
                    fontWeight: '600',
                    fontSize: theme.typography.fontSize.sm,
                    backgroundColor: workingDays[day] ? theme.colors.primary[600] : theme.colors.gray[100],
                    color: workingDays[day] ? theme.colors.white : theme.colors.gray[600],
                    border: workingDays[day] ? 'none' : `1px solid ${theme.colors.gray[200]}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: theme.typography.fontSize.xs, marginBottom: '4px' }}>{day.slice(0, 3)}</div>
                  {workingDays[day] && (
                    <svg style={{ width: '16px', height: '16px', margin: '0 auto', display: 'block' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Working Hours */}
          <div style={{
            padding: theme.spacing.lg,
            borderRadius: theme.borderRadius.xl,
            backgroundColor: theme.colors.white,
            border: `1px solid ${theme.colors.gray[200]}`,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginBottom: theme.spacing.sm }}>
              <svg style={{ width: '20px', height: '20px', color: theme.colors.primary[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 style={{ fontSize: theme.typography.fontSize.lg, fontWeight: '600', color: theme.colors.gray[900] }}>Working Hours</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
              <div>
                <label style={{ display: 'block', fontSize: theme.typography.fontSize.sm, fontWeight: '600', marginBottom: theme.spacing.xs, color: theme.colors.gray[700] }}>Start Time</label>
                <input
                  type="time"
                  value={hours.start}
                  onChange={(e) => setHours({...hours, start: e.target.value})}
                  style={{
                    width: '100%',
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.gray[200]}`,
                    color: theme.colors.gray[900]
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: theme.typography.fontSize.sm, fontWeight: '600', marginBottom: theme.spacing.xs, color: theme.colors.gray[700] }}>End Time</label>
                <input
                  type="time"
                  value={hours.end}
                  onChange={(e) => setHours({...hours, end: e.target.value})}
                  style={{
                    width: '100%',
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.gray[200]}`,
                    color: theme.colors.gray[900]
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
              <div>
                <label style={{ display: 'block', fontSize: theme.typography.fontSize.sm, fontWeight: '600', marginBottom: theme.spacing.xs, color: theme.colors.gray[700] }}>Valid From</label>
                <input
                  type="date"
                  value={validPeriod.from}
                  onChange={(e) => setValidPeriod({...validPeriod, from: e.target.value})}
                  style={{
                    width: '100%',
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.gray[200]}`,
                    color: theme.colors.gray[900]
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: theme.typography.fontSize.sm, fontWeight: '600', marginBottom: theme.spacing.xs, color: theme.colors.gray[700] }}>Valid Until</label>
                <input
                  type="date"
                  value={validPeriod.until}
                  onChange={(e) => setValidPeriod({...validPeriod, until: e.target.value})}
                  style={{
                    width: '100%',
                    padding: theme.spacing.sm,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.gray[200]}`,
                    color: theme.colors.gray[900]
                  }}
                />
              </div>
            </div>
            <button
              onClick={updateAllSchedules}
              disabled={loading}
              style={{
                width: '100%',
                padding: theme.spacing.sm,
                borderRadius: theme.borderRadius.lg,
                backgroundColor: theme.colors.primary[600],
                color: theme.colors.white,
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? 'Updating...' : 'Update All Active Schedules'}
            </button>
          </div>
        </div>

        {/* Right Column - Current Schedules */}
        <div style={{
          padding: theme.spacing.lg,
          borderRadius: theme.borderRadius.xl,
          backgroundColor: theme.colors.white,
          border: `1px solid ${theme.colors.gray[200]}`,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs, marginBottom: theme.spacing.sm }}>
            <svg style={{ width: '20px', height: '20px', color: theme.colors.primary[600] }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 style={{ fontSize: theme.typography.fontSize.lg, fontWeight: '600', color: theme.colors.gray[900] }}>Current Schedules</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs, maxHeight: '500px', overflowY: 'auto' }}>
            {schedules.length === 0 ? (
              <p style={{ textAlign: 'center', padding: theme.spacing.xl, color: theme.colors.gray[500] }}>No schedules created yet. Select working days to get started.</p>
            ) : (
              schedules.map((schedule, i) => (
                <div key={i} style={{
                  padding: theme.spacing.sm,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: schedule.isActive ? theme.colors.primary[50] : theme.colors.gray[50],
                  border: `1px solid ${schedule.isActive ? theme.colors.primary[200] : theme.colors.gray[200]}`
                }}>
                  {editingSchedule === schedule.id ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.xs }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: editForm.isActive ? '#10B981' : theme.colors.gray[400]
                        }}></div>
                        <p style={{ fontWeight: '600', textTransform: 'capitalize', color: theme.colors.gray[900] }}>{schedule.dayOfWeek}</p>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xs }}>
                        <div>
                          <label style={{ display: 'block', fontSize: theme.typography.fontSize.xs, fontWeight: '600', marginBottom: '2px', color: theme.colors.gray[600] }}>Start</label>
                          <input
                            type="time"
                            value={editForm.startTime}
                            onChange={(e) => setEditForm({...editForm, startTime: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '6px',
                              borderRadius: theme.borderRadius.md,
                              border: `1px solid ${theme.colors.gray[200]}`,
                              fontSize: theme.typography.fontSize.sm
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: theme.typography.fontSize.xs, fontWeight: '600', marginBottom: '2px', color: theme.colors.gray[600] }}>End</label>
                          <input
                            type="time"
                            value={editForm.endTime}
                            onChange={(e) => setEditForm({...editForm, endTime: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '6px',
                              borderRadius: theme.borderRadius.md,
                              border: `1px solid ${theme.colors.gray[200]}`,
                              fontSize: theme.typography.fontSize.sm
                            }}
                          />
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xs }}>
                        <div>
                          <label style={{ display: 'block', fontSize: theme.typography.fontSize.xs, fontWeight: '600', marginBottom: '2px', color: theme.colors.gray[600] }}>From</label>
                          <input
                            type="date"
                            value={editForm.validFrom}
                            onChange={(e) => setEditForm({...editForm, validFrom: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '6px',
                              borderRadius: theme.borderRadius.md,
                              border: `1px solid ${theme.colors.gray[200]}`,
                              fontSize: theme.typography.fontSize.sm
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: theme.typography.fontSize.xs, fontWeight: '600', marginBottom: '2px', color: theme.colors.gray[600] }}>Until</label>
                          <input
                            type="date"
                            value={editForm.validUntil}
                            onChange={(e) => setEditForm({...editForm, validUntil: e.target.value})}
                            style={{
                              width: '100%',
                              padding: '6px',
                              borderRadius: theme.borderRadius.md,
                              border: `1px solid ${theme.colors.gray[200]}`,
                              fontSize: theme.typography.fontSize.sm
                            }}
                          />
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                        <input
                          type="checkbox"
                          id={`active-${schedule.id}`}
                          checked={editForm.isActive}
                          onChange={(e) => setEditForm({...editForm, isActive: e.target.checked})}
                        />
                        <label htmlFor={`active-${schedule.id}`} style={{ fontSize: theme.typography.fontSize.sm, fontWeight: '600', color: theme.colors.gray[700] }}>Active</label>
                      </div>
                      
                      <div style={{ display: 'flex', gap: theme.spacing.xs }}>
                        <button
                          onClick={() => updateIndividualSchedule(schedule.id)}
                          style={{
                            flex: 1,
                            padding: '6px 12px',
                            borderRadius: theme.borderRadius.md,
                            backgroundColor: theme.colors.primary[600],
                            color: theme.colors.white,
                            fontWeight: '600',
                            fontSize: theme.typography.fontSize.sm,
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          style={{
                            flex: 1,
                            padding: '6px 12px',
                            borderRadius: theme.borderRadius.md,
                            backgroundColor: theme.colors.gray[200],
                            color: theme.colors.gray[700],
                            fontWeight: '600',
                            fontSize: theme.typography.fontSize.sm,
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: theme.spacing.xs }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.xs }}>
                          <div style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: schedule.isActive ? '#10B981' : theme.colors.gray[400]
                          }}></div>
                          <p style={{ fontWeight: '600', textTransform: 'capitalize', color: theme.colors.gray[900] }}>{schedule.dayOfWeek}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            onClick={() => startEditSchedule(schedule)}
                            style={{
                              padding: '6px',
                              borderRadius: theme.borderRadius.md,
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: theme.colors.primary[600]
                            }}
                            title="Edit"
                          >
                            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteIndividualSchedule(schedule.id)}
                            style={{
                              padding: '6px',
                              borderRadius: theme.borderRadius.md,
                              backgroundColor: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#DC2626'
                            }}
                            title="Delete"
                          >
                            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.gray[600], marginBottom: theme.spacing.xs }}>{schedule.startTime} - {schedule.endTime}</p>
                      <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.gray[500], marginBottom: theme.spacing.xs }}>{schedule.validFrom} to {schedule.validUntil}</p>
                      <span style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: '600',
                        backgroundColor: schedule.isActive ? '#D1FAE5' : theme.colors.gray[100],
                        color: schedule.isActive ? '#065F46' : theme.colors.gray[600]
                      }}>
                        {schedule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}