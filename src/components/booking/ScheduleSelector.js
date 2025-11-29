'use client'
import { theme } from '../../lib/theme'

export default function ScheduleSelector({
  schedules,
  loading,
  selectedSchedule,
  handleScheduleClick,
  selectedDate,
  handleDateChange,
  selectedTime,
  setSelectedTime,
  getAvailableTimes
}) {
  const formatScheduleTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.lg }}>
      {/* Available Schedule */}
      <div>
        <h3 style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: '600',
          color: theme.colors.gray[900],
          marginBottom: theme.spacing.sm
        }}>Available Schedule</h3>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: theme.spacing.sm }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: `2px solid ${theme.colors.primary[600]}`,
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ marginLeft: theme.spacing.xs, fontSize: theme.typography.fontSize.sm, color: theme.colors.gray[600] }}>Loading...</span>
          </div>
        ) : schedules.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: theme.spacing.xs,
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: theme.colors.gray[50]
          }}>
            {schedules.filter(schedule => schedule.isActive).map((schedule) => (
              <div 
                key={schedule.id} 
                onClick={() => handleScheduleClick(schedule)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: theme.spacing.xs,
                  borderRadius: theme.borderRadius.md,
                  backgroundColor: selectedSchedule?.id === schedule.id ? theme.colors.primary[50] : theme.colors.white,
                  border: `2px solid ${selectedSchedule?.id === schedule.id ? theme.colors.primary[600] : theme.colors.gray[200]}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  color: selectedSchedule?.id === schedule.id ? theme.colors.primary[700] : theme.colors.gray[900],
                  fontSize: theme.typography.fontSize.sm
                }}>{schedule.dayOfWeek}</span>
                <span style={{
                  color: selectedSchedule?.id === schedule.id ? theme.colors.primary[600] : theme.colors.gray[600],
                  fontSize: theme.typography.fontSize.xs
                }}>
                  {formatScheduleTime(schedule.startTime)} - {formatScheduleTime(schedule.endTime)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: theme.spacing.sm,
            color: theme.colors.gray[500],
            fontSize: theme.typography.fontSize.sm
          }}>
            No schedule available
          </div>
        )}
      </div>

      {/* Date Selection */}
      <div>
        <label style={{
          display: 'block',
          fontSize: theme.typography.fontSize.sm,
          fontWeight: '600',
          marginBottom: theme.spacing.xs,
          color: theme.colors.gray[700]
        }}>Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          style={{
            width: '100%',
            padding: theme.spacing.sm,
            borderRadius: theme.borderRadius.lg,
            border: `2px solid ${theme.colors.gray[200]}`,
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.gray[900]
          }}
          required
        />
      </div>

      {/* Time Selection */}
      {selectedSchedule && (
        <div>
          <label style={{
            display: 'block',
            fontSize: theme.typography.fontSize.sm,
            fontWeight: '600',
            marginBottom: theme.spacing.xs,
            color: theme.colors.gray[700]
          }}>Select Time</label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: theme.spacing.xs
          }}>
            {getAvailableTimes().map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                style={{
                  padding: theme.spacing.xs,
                  borderRadius: theme.borderRadius.md,
                  border: `2px solid ${selectedTime === time ? theme.colors.primary[600] : theme.colors.gray[200]}`,
                  backgroundColor: selectedTime === time ? theme.colors.primary[50] : theme.colors.white,
                  color: selectedTime === time ? theme.colors.primary[700] : theme.colors.gray[700],
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
