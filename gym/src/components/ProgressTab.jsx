import React, { useState } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { WORKOUT_DAYS } from '../workoutData.js'
import { getWeightHistory, countWeekSessions, getWeekStart } from '../useStorage.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Filler)

const C = {
  card: '#1C1C1E', card2: '#2C2C2E', border: '#3A3A3C',
  text: '#FFF', sub: '#8E8E93', green: '#30D158', blue: '#0A84FF',
  orange: '#FF9F0A',
}

const ALL_EXERCISES = Object.values(WORKOUT_DAYS).flatMap(d => d.exercises || [])

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return `${d.getDate()}/${d.getMonth() + 1}`
}

function getLast8Weeks(workoutSessions) {
  const weeks = []
  const today = new Date()
  for (let i = 7; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i * 7)
    const ws = getWeekStart(d.toISOString().slice(0, 10))
    const count = countWeekSessions(workoutSessions, ws)
    const label = `S${8 - i}`
    weeks.push({ label, count, weekStart: ws })
  }
  return weeks
}

export default function ProgressTab({ data }) {
  const [selectedExId, setSelectedExId] = useState(ALL_EXERCISES[0]?.id || '')
  const history = getWeightHistory(data.workoutSessions, selectedExId)
  const weekData = getLast8Weeks(data.workoutSessions)

  const lineChartData = {
    labels: history.map(h => formatDate(h.date)),
    datasets: [{
      data: history.map(h => h.weight),
      borderColor: C.blue,
      backgroundColor: C.blue + '22',
      borderWidth: 2.5,
      pointBackgroundColor: C.blue,
      pointRadius: 5,
      tension: 0.3,
      fill: true,
    }]
  }

  const barChartData = {
    labels: weekData.map(w => w.label),
    datasets: [{
      data: weekData.map(w => w.count),
      backgroundColor: weekData.map(w => w.count >= 5 ? C.green + 'CC' : w.count >= 3 ? C.blue + 'CC' : C.orange + 'CC'),
      borderRadius: 8,
      borderSkipped: false,
    }]
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: '#2C2C2E', titleColor: '#FFF', bodyColor: '#8E8E93',
      borderColor: '#3A3A3C', borderWidth: 1,
    }},
    scales: {
      x: { grid: { color: '#3A3A3C44' }, ticks: { color: C.sub, font: { size: 11 } } },
      y: { grid: { color: '#3A3A3C44' }, ticks: { color: C.sub, font: { size: 11 } } }
    }
  }

  const barOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: { ...chartOptions.scales.y, max: 6, ticks: { ...chartOptions.scales.y.ticks, stepSize: 1 } }
    }
  }

  const selectedEx = ALL_EXERCISES.find(e => e.id === selectedExId)
  const latestWeight = history.length > 0 ? history[history.length - 1].weight : null
  const firstWeight = history.length > 1 ? history[0].weight : null
  const gained = latestWeight !== null && firstWeight !== null ? latestWeight - firstWeight : null

  return (
    <div style={{ padding: '0 16px 16px' }}>
      {/* Weekly adherence */}
      <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Adherencia Semanal</h3>
        {weekData.every(w => w.count === 0) ? (
          <p style={{ color: C.sub, fontSize: 14, textAlign: 'center', padding: '16px 0' }}>
            Empieza a entrenar para ver tu historial
          </p>
        ) : (
          <Bar data={barChartData} options={barOptions} />
        )}
        <p style={{ color: C.sub, fontSize: 12, textAlign: 'center', marginTop: 8 }}>días entrenados por semana · meta: 6</p>
      </div>

      {/* Exercise progress */}
      <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 16 }}>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Evolución de Peso</h3>

        {/* Exercise picker */}
        <div style={{ marginBottom: 14 }}>
          <select
            value={selectedExId}
            onChange={e => setSelectedExId(e.target.value)}
            style={{
              width: '100%', background: C.card2, border: `1px solid ${C.border}`,
              borderRadius: 10, color: C.text, fontSize: 14, padding: '10px 12px',
              appearance: 'none', WebkitAppearance: 'none',
            }}
          >
            {Object.entries(WORKOUT_DAYS).map(([dayNum, day]) =>
              day.exercises?.map(ex => (
                <option key={ex.id} value={ex.id}>{day.label} · {ex.name}</option>
              ))
            )}
          </select>
        </div>

        {/* Stats row */}
        {history.length > 0 && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1, background: C.card2, borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>{latestWeight}<span style={{ fontSize: 13 }}>{selectedEx?.unit || 'kg'}</span></div>
              <div style={{ color: C.sub, fontSize: 12 }}>Último</div>
            </div>
            {gained !== null && (
              <div style={{ flex: 1, background: C.card2, borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ color: gained >= 0 ? C.green : C.orange, fontSize: 20, fontWeight: 700 }}>
                  {gained >= 0 ? '+' : ''}{gained}<span style={{ fontSize: 13 }}>{selectedEx?.unit || 'kg'}</span>
                </div>
                <div style={{ color: C.sub, fontSize: 12 }}>Ganancia</div>
              </div>
            )}
            <div style={{ flex: 1, background: C.card2, borderRadius: 12, padding: '10px 12px', textAlign: 'center' }}>
              <div style={{ color: C.text, fontSize: 20, fontWeight: 700 }}>{history.length}</div>
              <div style={{ color: C.sub, fontSize: 12 }}>Sesiones</div>
            </div>
          </div>
        )}

        {history.length < 2 ? (
          <p style={{ color: C.sub, fontSize: 14, textAlign: 'center', padding: '24px 0' }}>
            {history.length === 0 ? 'Sin datos aún · entrena y anota tu peso' : 'Necesitas al menos 2 sesiones para ver la gráfica'}
          </p>
        ) : (
          <Line data={lineChartData} options={chartOptions} />
        )}
      </div>
    </div>
  )
}
