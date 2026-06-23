import React, { useState } from 'react'
import { WORKOUT_DAYS } from './workoutData.js'
import { useGymStorage, getToday, sessionKey, getWeekStart, countWeekSessions, calcStreak, countProgressReady, shouldProgressWeight } from './useStorage.js'
import WorkoutTab from './components/WorkoutTab.jsx'
import ProgressTab from './components/ProgressTab.jsx'
import BodyTab from './components/BodyTab.jsx'
import NutritionTab from './components/NutritionTab.jsx'

const C = {
  bg: '#F2F2F7', card: '#FFFFFF', card2: '#F2F2F7', border: '#D1D1D6',
  text: '#000000', sub: '#8E8E93', green: '#34C759', blue: '#007AFF',
  orange: '#FF9500', red: '#FF3B30', purple: '#AF52DE',
}

const ALL_EXERCISES = Object.values(WORKOUT_DAYS).flatMap(d => d.exercises || [])

const TABS = [
  { id: 'workout', label: 'Entrena', icon: '💪' },
  { id: 'progress', label: 'Progreso', icon: '📈' },
  { id: 'body', label: 'Cuerpo', icon: '⚖️' },
  { id: 'nutrition', label: 'Nutrición', icon: '🥗' },
]

function SummaryHeader({ data }) {
  const today = getToday()
  const weekStart = getWeekStart(today)
  const daysThisWeek = countWeekSessions(data.workoutSessions, weekStart)
  const streak = calcStreak(data.workoutSessions)
  const readyToProgress = countProgressReady(data.workoutSessions, ALL_EXERCISES)

  const dow = new Date().getDay()
  const todayDayNum = dow === 0 ? 7 : dow
  const isRestDay = WORKOUT_DAYS[todayDayNum]?.rest

  const todayNutrition = data.nutrition[today] || {}
  const todayHabits = data.habits[today] || {}
  const habitsDone = [todayHabits.creatine, todayHabits.sleep, todayHabits.protein].filter(Boolean).length

  return (
    <div style={{
      background: C.card,
      padding: '16px 16px 12px',
      borderBottom: `1px solid ${C.border}`,
    }}>
      {/* App title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h1 style={{ color: C.text, fontSize: 26, fontWeight: 800, letterSpacing: -0.8, lineHeight: 1 }}>Gym Tracker</h1>
          <p style={{ color: C.sub, fontSize: 13, marginTop: 3 }}>
            {isRestDay ? '🌙 Día de descanso' : `📅 ${WORKOUT_DAYS[todayDayNum]?.name}`}
          </p>
        </div>
        {streak > 0 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26 }}>🔥</div>
            <div style={{ color: C.orange, fontSize: 13, fontWeight: 700 }}>{streak}d</div>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 8 }}>
        {[
          { value: `${daysThisWeek}/6`, label: 'Esta semana', color: daysThisWeek >= 5 ? C.green : daysThisWeek >= 3 ? C.blue : C.sub },
          { value: readyToProgress, label: '↑ Peso', color: readyToProgress > 0 ? C.orange : C.sub },
          { value: `${habitsDone}/3`, label: 'Hábitos', color: habitsDone === 3 ? C.green : habitsDone > 0 ? C.blue : C.sub },
          { value: todayNutrition.protein || 0, label: 'g Prot.', color: (todayNutrition.protein || 0) >= 145 ? C.green : C.sub, suffix: 'g' },
        ].map((stat, i) => (
          <div key={i} style={{
            flex: 1, background: C.card2, borderRadius: 12, padding: '10px 8px', textAlign: 'center',
          }}>
            <div style={{ color: stat.color, fontSize: 18, fontWeight: 800, lineHeight: 1 }}>
              {stat.value}
            </div>
            <div style={{ color: C.sub, fontSize: 10, marginTop: 3, lineHeight: 1.2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Weekly dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
        {['L', 'M', 'X', 'J', 'V', 'S'].map((day, i) => {
          const d = new Date(weekStart + 'T12:00:00')
          d.setDate(d.getDate() + i)
          const dateStr = d.toISOString().slice(0, 10)
          const hasSessions = Object.values(data.workoutSessions).some(
            s => s.date === dateStr && Object.values(s.exercises || {}).some(e => e.checked)
          )
          const isToday = dateStr === today
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ color: isToday ? C.text : C.sub, fontSize: 11, fontWeight: isToday ? 700 : 400 }}>{day}</span>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: hasSessions ? C.green : isToday ? C.blue : C.border,
                border: isToday ? `2px solid ${C.blue}` : '2px solid transparent',
              }} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('workout')
  const { data, updateExercise, setExerciseSet, addBodyMetric, updateNutrition, updateHabits } = useGymStorage()

  return (
    <div style={{
      background: C.bg, minHeight: '100dvh', color: C.text,
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
      maxWidth: 430, margin: '0 auto', position: 'relative',
    }}>
      <SummaryHeader data={data} />

      {/* Tab content */}
      <main style={{ paddingBottom: 86 }}>
        {activeTab === 'workout' && (
          <WorkoutTab
            data={data}
            updateExercise={updateExercise}
            setExerciseSet={setExerciseSet}
          />
        )}
        {activeTab === 'progress' && <ProgressTab data={data} />}
        {activeTab === 'body' && <BodyTab data={data} addBodyMetric={addBodyMetric} />}
        {activeTab === 'nutrition' && (
          <NutritionTab
            data={data}
            updateNutrition={updateNutrition}
            updateHabits={updateHabits}
          />
        )}
      </main>

      {/* Bottom nav */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 430,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: `1px solid ${C.border}`,
        padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
        display: 'flex',
        zIndex: 100,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '6px 0',
            }}
          >
            <span style={{ fontSize: 22, lineHeight: 1 }}>{tab.icon}</span>
            <span style={{
              fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 400,
              color: activeTab === tab.id ? C.blue : C.sub,
              letterSpacing: 0.2,
            }}>{tab.label}</span>
            {activeTab === tab.id && (
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: C.blue }} />
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
