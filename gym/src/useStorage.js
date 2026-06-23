import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'gym_tracker_v1'

const DEFAULT = {
  workoutSessions: {},
  bodyMetrics: [],
  nutrition: {},
  habits: {},
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT
    return { ...DEFAULT, ...JSON.parse(raw) }
  } catch {
    return DEFAULT
  }
}

export function useGymStorage() {
  const [data, setData] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {}
  }, [data])

  const updateExercise = useCallback((sessionKey, exerciseId, patch) => {
    setData(prev => {
      const session = prev.workoutSessions[sessionKey] || {}
      const exercises = session.exercises || {}
      return {
        ...prev,
        workoutSessions: {
          ...prev.workoutSessions,
          [sessionKey]: {
            ...session,
            exercises: {
              ...exercises,
              [exerciseId]: { ...exercises[exerciseId], ...patch }
            }
          }
        }
      }
    })
  }, [])

  const setExerciseSet = useCallback((sessionKey, exerciseId, setIdx, field, value) => {
    setData(prev => {
      const session = prev.workoutSessions[sessionKey] || {}
      const exercises = session.exercises || {}
      const exData = exercises[exerciseId] || {}
      const sets = [...(exData.sets || [])]
      sets[setIdx] = { ...sets[setIdx], [field]: value }
      return {
        ...prev,
        workoutSessions: {
          ...prev.workoutSessions,
          [sessionKey]: {
            ...session,
            exercises: {
              ...exercises,
              [exerciseId]: { ...exData, sets }
            }
          }
        }
      }
    })
  }, [])

  const addBodyMetric = useCallback((metric) => {
    setData(prev => {
      const filtered = prev.bodyMetrics.filter(m => m.date !== metric.date)
      return {
        ...prev,
        bodyMetrics: [...filtered, metric].sort((a, b) => a.date.localeCompare(b.date))
      }
    })
  }, [])

  const updateNutrition = useCallback((date, patch) => {
    setData(prev => ({
      ...prev,
      nutrition: { ...prev.nutrition, [date]: { ...prev.nutrition[date], ...patch } }
    }))
  }, [])

  const updateHabits = useCallback((date, patch) => {
    setData(prev => ({
      ...prev,
      habits: { ...prev.habits, [date]: { ...prev.habits[date], ...patch } }
    }))
  }, [])

  return { data, updateExercise, setExerciseSet, addBodyMetric, updateNutrition, updateHabits }
}

export function getToday() {
  return new Date().toISOString().slice(0, 10)
}

export function sessionKey(date, dayNum) {
  return `${date}_${dayNum}`
}

export function getWeekStart(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().slice(0, 10)
}

export function getWeekDates(weekStart) {
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart + 'T12:00:00')
    d.setDate(d.getDate() + i)
    dates.push(d.toISOString().slice(0, 10))
  }
  return dates
}

export function countWeekSessions(workoutSessions, weekStart) {
  const weekDates = getWeekDates(weekStart)
  const trained = new Set()
  Object.values(workoutSessions).forEach(s => {
    if (s.date && weekDates.includes(s.date)) {
      const hasCompleted = Object.values(s.exercises || {}).some(e => e.checked)
      if (hasCompleted) trained.add(s.date)
    }
  })
  return trained.size
}

export function calcStreak(workoutSessions) {
  const trained = new Set(
    Object.values(workoutSessions)
      .filter(s => Object.values(s.exercises || {}).some(e => e.checked))
      .map(s => s.date)
      .filter(Boolean)
  )
  let streak = 0
  const today = new Date()
  for (let i = 1; i <= 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (trained.has(key)) streak++
    else break
  }
  return streak
}

export function shouldProgressWeight(workoutSessions, exerciseId, exercise) {
  if (exercise.toFailure || exercise.bodyweight || exercise.seconds) return false
  const sessions = Object.values(workoutSessions)
    .filter(s => s.exercises?.[exerciseId])
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  if (sessions.length === 0) return false
  const last = sessions[sessions.length - 1]
  const exData = last.exercises[exerciseId]
  if (!exData?.sets?.length) return false
  const validSets = exData.sets.filter(s => s.reps !== undefined && s.reps !== '')
  if (validSets.length < exercise.sets) return false
  return validSets.every(s => parseInt(s.reps) >= exercise.repsMax)
}

export function getPreviousWeight(workoutSessions, exerciseId, currentSessionKey) {
  const sessions = Object.values(workoutSessions)
    .filter(s => s.exercises?.[exerciseId] && `${s.date}_${s.dayNum}` !== currentSessionKey)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  if (sessions.length === 0) return null
  return sessions[sessions.length - 1].exercises[exerciseId]?.weight ?? null
}

export function getWeightHistory(workoutSessions, exerciseId) {
  return Object.values(workoutSessions)
    .filter(s => s.exercises?.[exerciseId]?.weight !== undefined)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    .map(s => ({ date: s.date, weight: s.exercises[exerciseId].weight }))
}

export function countProgressReady(workoutSessions, allExercises) {
  return allExercises.filter(ex => shouldProgressWeight(workoutSessions, ex.id, ex)).length
}
