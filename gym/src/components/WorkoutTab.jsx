import React, { useState } from 'react'
import { WORKOUT_DAYS } from '../workoutData.js'
import { sessionKey, getToday, shouldProgressWeight } from '../useStorage.js'
import ExerciseCard from './ExerciseCard.jsx'

const C = {
  bg: '#000', card: '#1C1C1E', card2: '#2C2C2E', border: '#3A3A3C',
  text: '#FFF', sub: '#8E8E93', green: '#30D158', blue: '#0A84FF',
  orange: '#FF9F0A', red: '#FF3B30',
}

const DAY_COLORS = ['', '#FF6B35', '#4FC3F7', '#81C784', '#FF6B35', '#4FC3F7', '#CE93D8', '#8E8E93']

export default function WorkoutTab({ data, updateExercise, setExerciseSet }) {
  const today = getToday()
  const [selectedDay, setSelectedDay] = useState(() => {
    const dow = new Date().getDay()
    return dow === 0 ? 7 : dow
  })

  const sKey = sessionKey(today, selectedDay)
  const session = data.workoutSessions[sKey] || { date: today, dayNum: selectedDay, exercises: {} }
  const dayPlan = WORKOUT_DAYS[selectedDay]

  const completedCount = dayPlan.exercises.filter(ex => session.exercises?.[ex.id]?.checked).length
  const totalCount = dayPlan.exercises.length

  function handleUpdateExercise(exId, patch) {
    updateExercise(sKey, exId, { ...patch, date: today, dayNum: selectedDay })
    if (!data.workoutSessions[sKey]) {
      updateExercise(sKey, '__meta__', { date: today, dayNum: selectedDay })
    }
  }

  function handleSetChange(exId, idx, field, value) {
    setExerciseSet(sKey, exId, idx, field, value)
  }

  return (
    <div>
      {/* Day selector */}
      <div style={{ padding: '12px 16px 8px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
          {Object.entries(WORKOUT_DAYS).map(([num, day]) => {
            const n = parseInt(num)
            const isSelected = n === selectedDay
            const color = DAY_COLORS[n]
            return (
              <button
                key={n}
                onClick={() => setSelectedDay(n)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  padding: '10px 14px', borderRadius: 14,
                  background: isSelected ? color : C.card,
                  border: isSelected ? `2px solid ${color}` : `2px solid transparent`,
                  cursor: 'pointer', transition: 'all 0.15s', minWidth: 54,
                }}
              >
                <span style={{
                  color: isSelected ? '#000' : C.sub,
                  fontSize: 13, fontWeight: 700,
                }}>{day.label}</span>
                {day.rest ? (
                  <span style={{ fontSize: 10, color: isSelected ? '#000' : C.sub }}>☽</span>
                ) : (
                  <span style={{ fontSize: 10, color: isSelected ? '#000' : C.sub, marginTop: 2 }}>
                    {day.exercises.length}ej
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Day header */}
      <div style={{ padding: '8px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ color: C.text, fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>{dayPlan.name}</h2>
            <p style={{ color: C.sub, fontSize: 14, marginTop: 2 }}>{dayPlan.subtitle}</p>
          </div>
          {!dayPlan.rest && (
            <div style={{
              background: C.card, borderRadius: 12, padding: '8px 14px', textAlign: 'center',
            }}>
              <div style={{ color: completedCount === totalCount ? C.green : C.text, fontSize: 22, fontWeight: 700 }}>
                {completedCount}/{totalCount}
              </div>
              <div style={{ color: C.sub, fontSize: 11 }}>ejercicios</div>
            </div>
          )}
        </div>

        {!dayPlan.rest && totalCount > 0 && (
          <div style={{ marginTop: 10, height: 4, background: C.card2, borderRadius: 4 }}>
            <div style={{
              height: '100%', borderRadius: 4,
              background: completedCount === totalCount ? C.green : C.blue,
              width: `${(completedCount / totalCount) * 100}%`,
              transition: 'width 0.3s',
            }} />
          </div>
        )}
      </div>

      {/* Rest day */}
      {dayPlan.rest && (
        <div style={{ padding: '40px 16px', textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌙</div>
          <h3 style={{ color: C.text, fontSize: 22, fontWeight: 700 }}>Descanso Total</h3>
          <p style={{ color: C.sub, fontSize: 15, marginTop: 8, lineHeight: 1.5 }}>
            El músculo crece durante el descanso.<br />Duerme 8h, hidrátate y relájate.
          </p>
        </div>
      )}

      {/* Exercises */}
      {!dayPlan.rest && (
        <div style={{ padding: '0 16px' }}>
          {dayPlan.exercises.map((exercise, idx) => {
            const exData = session.exercises?.[exercise.id] || {}
            return (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                exData={exData}
                sessionKey={sKey}
                workoutSessions={data.workoutSessions}
                onUpdateExercise={handleUpdateExercise}
                onSetChange={handleSetChange}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
