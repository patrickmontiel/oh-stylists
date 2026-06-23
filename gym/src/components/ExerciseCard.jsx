import React, { useState } from 'react'
import { shouldProgressWeight, getPreviousWeight } from '../useStorage.js'

const C = {
  card: '#FFFFFF', card2: '#F2F2F7', border: '#D1D1D6',
  text: '#000000', sub: '#8E8E93',
  green: '#34C759', blue: '#007AFF', orange: '#FF9500', red: '#FF3B30',
}

function ProgressArrow({ direction }) {
  if (!direction) return null
  if (direction === 'up')   return <span style={{ color: C.green, fontSize: 18, fontWeight: 700 }}>↑</span>
  if (direction === 'down') return <span style={{ color: C.red, fontSize: 18, fontWeight: 700 }}>↓</span>
  return <span style={{ color: C.sub, fontSize: 16 }}>→</span>
}

export default function ExerciseCard({ exercise, exData, sessionKey, workoutSessions, onUpdateExercise, onSetChange }) {
  const [expanded, setExpanded] = useState(false)

  const checked = exData?.checked || false
  const weight = exData?.weight ?? exercise.defaultWeight
  const sets = exData?.sets || []
  const shouldProgress = shouldProgressWeight(workoutSessions, exercise.id, exercise)
  const prevWeight = getPreviousWeight(workoutSessions, exercise.id, sessionKey)
  const direction = prevWeight === null ? null : weight > prevWeight ? 'up' : weight < prevWeight ? 'down' : 'same'

  const repsLabel = exercise.toFailure
    ? 'Al fallo'
    : exercise.seconds
    ? `${exercise.repsMin}s`
    : exercise.repsMin === exercise.repsMax
    ? `${exercise.repsMax} reps`
    : `${exercise.repsMin}-${exercise.repsMax} reps`

  const weightLabel = exercise.bodyweight && exercise.defaultWeight === 0 ? 'Peso corporal' : `${weight} ${exercise.unit || 'kg'}`

  function handleWeightChange(val) {
    const parsed = parseFloat(val)
    if (!isNaN(parsed)) onUpdateExercise(exercise.id, { weight: parsed })
  }

  function handleRepsChange(idx, val) {
    onSetChange(exercise.id, idx, 'reps', val)
  }

  function handleCheck() {
    onUpdateExercise(exercise.id, { checked: !checked })
    if (!checked && !expanded) setExpanded(true)
  }

  const cardOpacity = checked ? 1 : 0.75

  return (
    <div style={{
      background: C.card,
      borderRadius: 16,
      marginBottom: 10,
      overflow: 'hidden',
      border: checked ? `1px solid ${C.green}30` : `1px solid ${C.border}`,
      opacity: cardOpacity,
      transition: 'all 0.2s',
    }}>
      {/* Superset badge */}
      {exercise.superset && (
        <div style={{ background: C.blue + '22', padding: '4px 16px' }}>
          <span style={{ color: C.blue, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>SUPERSET {exercise.superset}</span>
        </div>
      )}
      {exercise.optional && (
        <div style={{ background: C.orange + '22', padding: '4px 16px' }}>
          <span style={{ color: C.orange, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>OPCIONAL</span>
        </div>
      )}

      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px', gap: 12 }}>
        {/* Checkbox */}
        <button
          onClick={handleCheck}
          style={{
            width: 28, height: 28, borderRadius: 8, border: `2px solid ${checked ? C.green : C.border}`,
            background: checked ? C.green : 'transparent', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          {checked && <span style={{ color: '#000', fontSize: 16, fontWeight: 900, lineHeight: 1 }}>✓</span>}
        </button>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: C.text, fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>{exercise.name}</span>
            <ProgressArrow direction={direction} />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 3, flexWrap: 'wrap' }}>
            <span style={{ color: C.sub, fontSize: 12 }}>{exercise.sets} series · {repsLabel}</span>
            {prevWeight !== null && (
              <span style={{ color: C.sub, fontSize: 12 }}>· ant. {prevWeight}{exercise.unit || 'kg'}</span>
            )}
          </div>
          {shouldProgress && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: C.orange + '22', borderRadius: 6, padding: '3px 8px', marginTop: 5,
            }}>
              <span style={{ fontSize: 12 }}>🔼</span>
              <span style={{ color: C.orange, fontSize: 12, fontWeight: 700 }}>¡Sube peso!</span>
            </div>
          )}
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            background: C.card2, border: 'none', borderRadius: 8,
            color: C.sub, padding: '6px 10px', cursor: 'pointer', fontSize: 14,
            transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ⌄
        </button>
      </div>

      {/* Expanded: weight + sets */}
      {expanded && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.border}` }}>
          {/* Weight input */}
          {!(exercise.bodyweight && exercise.defaultWeight === 0) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0 14px' }}>
              <span style={{ color: C.sub, fontSize: 13, flex: 1 }}>Peso usado</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => handleWeightChange(Math.max(0, weight - (exercise.unit === 'lb asist.' ? 5 : 2.5)))}
                  style={{ width: 36, height: 36, borderRadius: 10, background: C.card2, border: 'none', color: C.text, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >−</button>
                <input
                  type="number"
                  value={weight}
                  onChange={e => handleWeightChange(e.target.value)}
                  style={{
                    width: 70, textAlign: 'center', background: C.card2, border: `1px solid ${C.border}`,
                    borderRadius: 10, color: C.text, fontSize: 17, fontWeight: 700, padding: '8px 4px',
                  }}
                />
                <button
                  onClick={() => handleWeightChange(weight + (exercise.unit === 'lb asist.' ? 5 : 2.5))}
                  style={{ width: 36, height: 36, borderRadius: 10, background: C.card2, border: 'none', color: C.text, fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >+</button>
                <span style={{ color: C.sub, fontSize: 13, minWidth: 32 }}>{exercise.unit || 'kg'}</span>
              </div>
            </div>
          )}

          {/* Sets */}
          {!exercise.toFailure && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: `44px repeat(${exercise.sets}, 1fr)`, gap: 6 }}>
                <span style={{ color: C.sub, fontSize: 12, textAlign: 'center', alignSelf: 'end', paddingBottom: 4 }}>Serie</span>
                {Array.from({ length: exercise.sets }, (_, i) => (
                  <span key={i} style={{ color: C.sub, fontSize: 12, textAlign: 'center', paddingBottom: 4 }}>S{i + 1}</span>
                ))}
                <span style={{ color: C.sub, fontSize: 12, paddingTop: 4 }}>
                  {exercise.seconds ? 'Seg' : 'Reps'}
                </span>
                {Array.from({ length: exercise.sets }, (_, i) => (
                  <input
                    key={i}
                    type="number"
                    inputMode="numeric"
                    placeholder={exercise.repsMax || '—'}
                    value={sets[i]?.reps ?? ''}
                    onChange={e => handleRepsChange(i, e.target.value)}
                    style={{
                      textAlign: 'center', background: C.card2, border: `1px solid ${C.border}`,
                      borderRadius: 10, color: C.text, fontSize: 17, fontWeight: 600,
                      padding: '10px 4px', width: '100%',
                    }}
                  />
                ))}
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                {Array.from({ length: exercise.sets }, (_, i) => {
                  const reps = parseInt(sets[i]?.reps)
                  const ok = !isNaN(reps) && reps >= exercise.repsMax
                  const low = !isNaN(reps) && reps > 0 && reps < exercise.repsMin
                  return (
                    <div key={i} style={{
                      flex: 1, height: 3, borderRadius: 4,
                      background: ok ? C.green : low ? C.red : isNaN(reps) ? C.border : C.orange,
                    }} />
                  )
                })}
              </div>
            </div>
          )}
          {exercise.toFailure && (
            <p style={{ color: C.sub, fontSize: 13, textAlign: 'center', paddingTop: 8 }}>
              Entrena al fallo · anota reps si quieres
            </p>
          )}
        </div>
      )}
    </div>
  )
}
