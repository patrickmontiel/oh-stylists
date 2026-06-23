import React from 'react'
import { USER_PROFILE } from '../workoutData.js'
import { getToday } from '../useStorage.js'

const C = {
  card: '#1C1C1E', card2: '#2C2C2E', border: '#3A3A3C',
  text: '#FFF', sub: '#8E8E93', green: '#30D158', blue: '#0A84FF',
  orange: '#FF9F0A', red: '#FF3B30', purple: '#BF5AF2',
}

function ProgressRing({ pct, size = 80, stroke = 7, color, label, sublabel }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (Math.min(pct, 100) / 100) * circ
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.card2} strokeWidth={stroke} />
          <circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={pct >= 100 ? C.green : color}
            strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ color: pct >= 100 ? C.green : C.text, fontSize: 16, fontWeight: 700 }}>{Math.min(pct, 999)}%</span>
        </div>
      </div>
      <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{label}</span>
      <span style={{ color: C.sub, fontSize: 12 }}>{sublabel}</span>
    </div>
  )
}

function MacroBar({ label, current, goal, color, unit }) {
  const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{label}</span>
        <span style={{ color: C.sub, fontSize: 14 }}>
          <span style={{ color: pct >= 100 ? C.green : C.text, fontWeight: 700 }}>{current}</span>
          /{goal} {unit}
        </span>
      </div>
      <div style={{ height: 10, background: C.card2, borderRadius: 6 }}>
        <div style={{
          height: '100%', borderRadius: 6, transition: 'width 0.4s',
          width: `${pct}%`,
          background: pct >= 100 ? C.green : pct >= 80 ? color : pct >= 50 ? color + 'BB' : color + '66',
        }} />
      </div>
    </div>
  )
}

function HabitRow({ label, emoji, checked, onToggle, subtext }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: 14, width: '100%',
        background: checked ? C.green + '18' : 'transparent',
        border: `1px solid ${checked ? C.green + '50' : C.border}`,
        borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
        transition: 'all 0.15s', marginBottom: 10, textAlign: 'left',
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 10,
        background: checked ? C.green : C.card2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, flexShrink: 0, transition: 'all 0.15s',
      }}>
        {checked ? '✓' : emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ color: C.text, fontSize: 15, fontWeight: 600 }}>{label}</div>
        {subtext && <div style={{ color: C.sub, fontSize: 12, marginTop: 2 }}>{subtext}</div>}
      </div>
      {checked && <span style={{ color: C.green, fontSize: 13, fontWeight: 600 }}>Hecho</span>}
    </button>
  )
}

export default function NutritionTab({ data, updateNutrition, updateHabits }) {
  const today = getToday()
  const todayNutrition = data.nutrition[today] || {}
  const todayHabits = data.habits[today] || {}

  const protein = todayNutrition.protein || 0
  const calories = todayNutrition.calories || 0
  const proteinPct = Math.round((protein / USER_PROFILE.proteinGoal) * 100)
  const caloriePct = Math.round((calories / USER_PROFILE.calorieGoal) * 100)

  const allHabitsDone = todayHabits.creatine && todayHabits.sleep && todayHabits.protein

  return (
    <div style={{ padding: '0 16px 16px' }}>
      {/* Rings summary */}
      <div style={{ background: C.card, borderRadius: 16, padding: 20, marginBottom: 14 }}>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 18 }}>Hoy</h3>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <ProgressRing
            pct={proteinPct} color={C.blue} size={88} stroke={8}
            label="Proteína" sublabel={`${protein}/${USER_PROFILE.proteinGoal}g`}
          />
          <ProgressRing
            pct={caloriePct} color={C.orange} size={88} stroke={8}
            label="Calorías" sublabel={`${calories}/${USER_PROFILE.calorieGoal}`}
          />
          <ProgressRing
            pct={allHabitsDone ? 100 : Math.round(([todayHabits.creatine, todayHabits.sleep, todayHabits.protein].filter(Boolean).length / 3) * 100)}
            color={C.purple} size={88} stroke={8}
            label="Hábitos" sublabel="3 objetivos"
          />
        </div>
      </div>

      {/* Nutrition inputs */}
      <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 14 }}>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Registrar Nutrición</h3>

        <MacroBar label="Proteína" current={protein} goal={USER_PROFILE.proteinGoal} color={C.blue} unit="g" />
        <MacroBar label="Calorías" current={calories} goal={USER_PROFILE.calorieGoal} color={C.orange} unit="kcal" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6 }}>
          {[
            { key: 'protein', label: 'Proteína del día', unit: 'g', color: C.blue, value: protein, goal: USER_PROFILE.proteinGoal },
            { key: 'calories', label: 'Calorías del día', unit: 'kcal', color: C.orange, value: calories, goal: USER_PROFILE.calorieGoal },
          ].map(field => (
            <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: field.color, flexShrink: 0
              }} />
              <span style={{ color: C.sub, fontSize: 13, flex: 1 }}>{field.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => updateNutrition(today, { [field.key]: Math.max(0, (todayNutrition[field.key] || 0) - (field.key === 'calories' ? 50 : 5)) })}
                  style={{ width: 34, height: 34, borderRadius: 10, background: C.card2, border: 'none', color: C.text, fontSize: 18, cursor: 'pointer' }}
                >−</button>
                <input
                  type="number"
                  inputMode="numeric"
                  value={field.value || ''}
                  placeholder={field.goal}
                  onChange={e => updateNutrition(today, { [field.key]: parseInt(e.target.value) || 0 })}
                  style={{
                    width: 80, textAlign: 'center', background: C.card2, border: `1px solid ${C.border}`,
                    borderRadius: 10, color: C.text, fontSize: 17, fontWeight: 700, padding: '8px 4px',
                  }}
                />
                <button
                  onClick={() => updateNutrition(today, { [field.key]: (todayNutrition[field.key] || 0) + (field.key === 'calories' ? 50 : 5) })}
                  style={{ width: 34, height: 34, borderRadius: 10, background: C.card2, border: 'none', color: C.text, fontSize: 18, cursor: 'pointer' }}
                >+</button>
                <span style={{ color: C.sub, fontSize: 12, width: 28 }}>{field.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Habits */}
      <div style={{ background: C.card, borderRadius: 16, padding: 16 }}>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Hábitos Diarios</h3>
        <HabitRow
          emoji="⚡"
          label="Creatina 5g"
          subtext="Tomada con agua o batido"
          checked={!!todayHabits.creatine}
          onToggle={() => updateHabits(today, { creatine: !todayHabits.creatine })}
        />
        <HabitRow
          emoji="🌙"
          label="Sueño 7-9h"
          subtext="Recuperación y síntesis proteica"
          checked={!!todayHabits.sleep}
          onToggle={() => updateHabits(today, { sleep: !todayHabits.sleep })}
        />
        <HabitRow
          emoji="🥩"
          label={`Proteína ${USER_PROFILE.proteinGoal}g`}
          subtext={`${protein}g registrados hoy`}
          checked={!!todayHabits.protein || protein >= USER_PROFILE.proteinGoal}
          onToggle={() => updateHabits(today, { protein: !(todayHabits.protein || protein >= USER_PROFILE.proteinGoal) })}
        />

        {allHabitsDone && (
          <div style={{
            marginTop: 6, background: C.green + '18', borderRadius: 12, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 20 }}>🔥</span>
            <span style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>Todos los hábitos completados</span>
          </div>
        )}
      </div>
    </div>
  )
}
