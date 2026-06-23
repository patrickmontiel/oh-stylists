import React, { useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { USER_PROFILE } from '../workoutData.js'
import { getToday } from '../useStorage.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

const C = {
  card: '#FFFFFF', card2: '#F2F2F7', border: '#D1D1D6',
  text: '#000000', sub: '#8E8E93', green: '#34C759', blue: '#007AFF',
  orange: '#FF9500', red: '#FF3B30',
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T12:00:00')
  return `${d.getDate()}/${d.getMonth() + 1}`
}

function StatCard({ label, value, unit, subtext, color }) {
  return (
    <div style={{ flex: 1, background: C.card2, borderRadius: 14, padding: '14px 12px', textAlign: 'center' }}>
      <div style={{ color: color || C.text, fontSize: 24, fontWeight: 700, lineHeight: 1 }}>
        {value !== undefined && value !== null ? value : '—'}
        <span style={{ fontSize: 13, color: C.sub, fontWeight: 400 }}>{unit}</span>
      </div>
      <div style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>{label}</div>
      {subtext && <div style={{ color: color || C.green, fontSize: 11, marginTop: 2 }}>{subtext}</div>}
    </div>
  )
}

export default function BodyTab({ data, addBodyMetric }) {
  const today = getToday()
  const [form, setForm] = useState({ weight: '', bodyFat: '', waist: '' })
  const [saved, setSaved] = useState(false)

  const metrics = data.bodyMetrics || []
  const latest = metrics[metrics.length - 1]
  const earliest = metrics[0]

  const fatProgress = latest?.bodyFat
    ? Math.max(0, Math.min(100, ((USER_PROFILE.startBodyFat - latest.bodyFat) / (USER_PROFILE.startBodyFat - USER_PROFILE.targetBodyFat)) * 100))
    : 0

  function handleSave() {
    const metric = {
      date: today,
      weight: form.weight ? parseFloat(form.weight) : latest?.weight,
      bodyFat: form.bodyFat ? parseFloat(form.bodyFat) : latest?.bodyFat,
      waist: form.waist ? parseFloat(form.waist) : latest?.waist,
    }
    addBodyMetric(metric)
    setForm({ weight: '', bodyFat: '', waist: '' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function makeChart(key, color, label) {
    const points = metrics.filter(m => m[key] !== undefined)
    return {
      labels: points.map(m => formatDate(m.date)),
      datasets: [{
        data: points.map(m => m[key]),
        borderColor: color,
        backgroundColor: color + '22',
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: color,
        tension: 0.3,
        fill: true,
      }]
    }
  }

  const chartOpts = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: {
      backgroundColor: '#FFFFFF', titleColor: '#000', bodyColor: '#8E8E93',
      borderColor: '#D1D1D6', borderWidth: 1,
    }},
    scales: {
      x: { grid: { color: '#D1D1D644' }, ticks: { color: C.sub, font: { size: 11 } } },
      y: { grid: { color: '#D1D1D644' }, ticks: { color: C.sub, font: { size: 11 } } }
    }
  }

  const weightDelta = latest?.weight && earliest?.weight ? (latest.weight - earliest.weight).toFixed(1) : null
  const fatDelta = latest?.bodyFat && earliest?.bodyFat ? (latest.bodyFat - earliest.bodyFat).toFixed(1) : null

  return (
    <div style={{ padding: '0 16px 16px' }}>
      {/* Current stats */}
      <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 14 }}>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Métricas Actuales</h3>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <StatCard
            label="Peso"
            value={latest?.weight}
            unit="kg"
            subtext={weightDelta !== null ? `${weightDelta > 0 ? '+' : ''}${weightDelta}kg` : null}
            color={weightDelta < 0 ? C.green : weightDelta > 0 ? C.orange : C.text}
          />
          <StatCard
            label="% Grasa"
            value={latest?.bodyFat}
            unit="%"
            subtext={latest?.bodyFat ? `meta: ${USER_PROFILE.targetBodyFat}%` : null}
            color={latest?.bodyFat <= USER_PROFILE.targetBodyFat ? C.green : latest?.bodyFat <= 16 ? C.blue : C.orange}
          />
          <StatCard
            label="Cintura"
            value={latest?.waist}
            unit="cm"
            subtext={fatDelta !== null ? `${fatDelta}%` : null}
            color={fatDelta < 0 ? C.green : C.sub}
          />
        </div>

        {/* Fat progress bar */}
        {latest?.bodyFat && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: C.sub, fontSize: 13 }}>Progreso grasa corporal</span>
              <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{fatProgress.toFixed(0)}%</span>
            </div>
            <div style={{ height: 8, background: C.card2, borderRadius: 4 }}>
              <div style={{
                height: '100%', borderRadius: 4, transition: 'width 0.5s',
                width: `${fatProgress}%`,
                background: `linear-gradient(90deg, ${C.blue}, ${C.green})`,
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ color: C.sub, fontSize: 11 }}>21% (inicio)</span>
              <span style={{ color: C.green, fontSize: 11 }}>13% (meta)</span>
            </div>
          </div>
        )}
      </div>

      {/* Add measurement */}
      <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 14 }}>
        <h3 style={{ color: C.text, fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Registrar Medición</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'weight', label: 'Peso corporal', unit: 'kg', placeholder: latest?.weight || '81' },
            { key: 'bodyFat', label: '% Grasa corporal', unit: '%', placeholder: latest?.bodyFat || '21' },
            { key: 'waist', label: 'Cintura', unit: 'cm', placeholder: latest?.waist || '85' },
          ].map(field => (
            <div key={field.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: C.sub, fontSize: 13, flex: 1 }}>{field.label}</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder={String(field.placeholder)}
                value={form[field.key]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                style={{
                  width: 90, textAlign: 'center', background: C.card2, border: `1px solid ${C.border}`,
                  borderRadius: 10, color: C.text, fontSize: 16, fontWeight: 600, padding: '10px 8px',
                }}
              />
              <span style={{ color: C.sub, fontSize: 13, width: 24 }}>{field.unit}</span>
            </div>
          ))}
        </div>
        <button
          onClick={handleSave}
          style={{
            width: '100%', marginTop: 14, padding: '14px', borderRadius: 12,
            background: saved ? C.green : C.blue, border: 'none',
            color: saved ? '#000' : '#FFF', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          {saved ? '✓ Guardado' : 'Guardar Medición'}
        </button>
      </div>

      {/* Charts */}
      {metrics.length >= 2 && (
        <>
          {[
            { key: 'weight', label: 'Peso Corporal (kg)', color: C.blue },
            { key: 'bodyFat', label: '% Grasa Corporal', color: C.orange },
            { key: 'waist', label: 'Cintura (cm)', color: C.green },
          ].map(({ key, label, color }) => (
            metrics.filter(m => m[key] !== undefined).length >= 2 && (
              <div key={key} style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 14 }}>
                <h3 style={{ color: C.text, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{label}</h3>
                <Line data={makeChart(key, color, label)} options={chartOpts} />
              </div>
            )
          ))}
        </>
      )}

      {metrics.length < 2 && (
        <div style={{ background: C.card, borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <p style={{ color: C.sub, fontSize: 14, lineHeight: 1.6 }}>
            Registra al menos 2 mediciones para ver las gráficas de evolución
          </p>
        </div>
      )}
    </div>
  )
}
