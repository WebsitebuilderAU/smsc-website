import { useMemo, useState } from 'react'

/**
 * Month-grid calendar component. Week starts MONDAY (Australian convention).
 *
 * Props:
 *   events: array of { date: 'YYYY-MM-DD', title, type, locked? }
 *   initialYear / initialMonth: defaults to current
 *
 * Locked dates (e.g. the 31 Oct + 1 Nov 2026 EXPO) are merged on top of
 * the dynamic events list so they always render, even if Supabase is empty.
 */

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

// Convert JS Date.getDay() (Sun=0..Sat=6) → Mon-start index (Mon=0..Sun=6)
function mondayIndex(d) {
  const dow = d.getDay()
  return (dow + 6) % 7
}

function ymd(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function MonthCalendar({ events = [], initialYear, initialMonth }) {
  const now = new Date()
  const [year, setYear]   = useState(initialYear  ?? now.getFullYear())
  const [month, setMonth] = useState(initialMonth ?? now.getMonth())

  // Locked club events — these always show, even before Supabase loads
  const LOCKED = [
    { date: '2026-10-31', title: 'SMSC EXPO 2026 — Day 1', type: 'EXPO', locked: true },
    { date: '2026-11-01', title: 'SMSC EXPO 2026 — Day 2', type: 'EXPO', locked: true },
  ]

  const byDate = useMemo(() => {
    const map = {}
    const all = [...LOCKED, ...events]
    for (const e of all) {
      if (!e?.date) continue
      const key = e.date.slice(0, 10)
      ;(map[key] = map[key] || []).push(e)
    }
    return map
  }, [events])

  // Build the 6×7 grid for the visible month
  const grid = useMemo(() => {
    const first = new Date(year, month, 1)
    const lead  = mondayIndex(first)
    const start = new Date(year, month, 1 - lead)
    const cells = []
    for (let i = 0; i < 42; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      cells.push(d)
    }
    return cells
  }, [year, month])

  function prev() {
    if (month === 0) { setYear(year - 1); setMonth(11) }
    else setMonth(month - 1)
  }
  function next() {
    if (month === 11) { setYear(year + 1); setMonth(0) }
    else setMonth(month + 1)
  }
  function today() {
    const t = new Date()
    setYear(t.getFullYear()); setMonth(t.getMonth())
  }

  const todayKey = ymd(new Date())

  return (
    <div className="bg-white rounded shadow-sm border border-navy-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-navy-50 border-b border-navy-200">
        <button
          onClick={prev}
          className="text-navy-800 font-semibold px-2 py-1 rounded hover:bg-navy-100"
          aria-label="Previous month"
        >
          ← Prev
        </button>
        <div className="font-display text-lg md:text-xl text-navy-900 font-bold">
          {MONTH_NAMES[month]} {year}
          <button
            onClick={today}
            className="ml-3 text-xs font-semibold text-brass-700 underline hover:text-brass-600"
          >
            Today
          </button>
        </div>
        <button
          onClick={next}
          className="text-navy-800 font-semibold px-2 py-1 rounded hover:bg-navy-100"
          aria-label="Next month"
        >
          Next →
        </button>
      </div>

      {/* Weekday header — Mon-start */}
      <div className="grid grid-cols-7 text-center text-[11px] md:text-xs uppercase tracking-widest text-navy-600 bg-navy-100">
        {WEEKDAY_LABELS.map(w => (
          <div key={w} className="py-2 border-r border-navy-200 last:border-r-0">{w}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7">
        {grid.map((d, idx) => {
          const inMonth = d.getMonth() === month
          const key = ymd(d)
          const isToday = key === todayKey
          const dayEvents = byDate[key] || []
          return (
            <div
              key={idx}
              className={`min-h-[78px] md:min-h-[96px] border-r border-b border-navy-200 last:border-r-0 p-1.5
                          ${inMonth ? 'bg-white' : 'bg-navy-50/50 text-navy-400'}
                          ${isToday ? 'ring-2 ring-brass-500 ring-inset' : ''}`}
            >
              <div className="text-xs md:text-sm font-semibold text-navy-800">
                {d.getDate()}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.slice(0, 2).map((e, i) => (
                  <div
                    key={i}
                    title={e.title}
                    className={`text-[10px] md:text-[11px] px-1.5 py-0.5 rounded truncate
                                ${e.type === 'EXPO'
                                  ? 'bg-brass-500 text-white font-semibold'
                                  : e.type === 'Meeting'
                                  ? 'bg-navy-800 text-white'
                                  : 'bg-navy-200 text-navy-900'}`}
                  >
                    {e.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-[10px] text-navy-500">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 items-center px-4 py-3 bg-navy-50 border-t border-navy-200 text-xs text-navy-700">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-brass-500 inline-block"></span> EXPO
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-navy-800 inline-block"></span> Meeting
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-navy-200 inline-block"></span> Other
        </span>
        <span className="ml-auto text-navy-500">Week starts Monday</span>
      </div>
    </div>
  )
}
