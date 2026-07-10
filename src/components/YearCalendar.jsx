import { useMemo, useState } from 'react'

/**
 * Full-year calendar — 12 mini-months arranged 4 wide × 3 tall.
 * Per Anelia's 7 Jul markup:
 *   - Calendar shows the whole year at once so meeting dates are visible
 *   - Weeks start on MONDAY
 *   - Hovering / clicking a coloured date shows the popup meeting details
 *
 * Props:
 *   events: array of { date: 'YYYY-MM-DD', title, type, locked? }
 *   year:   number (default 2026)
 */

const WEEKDAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
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

// Colour classes per event type
function dateClasses(events) {
  if (!events || events.length === 0) return ''
  // Priority: EXPO > Meeting > HomeMeeting > other
  const types = new Set(events.map(e => e.type))
  if (types.has('EXPO'))        return 'bg-red-600 text-white font-bold'
  if (types.has('Meeting'))     return 'bg-blue-700 text-white font-bold'
  if (types.has('HomeMeeting')) return 'bg-green-600 text-white font-bold'
  return 'bg-navy-300 text-navy-900 font-semibold'
}

function MiniMonth({ year, month, events, selected, onSelect }) {
  // Build 6×7 grid for the month
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

  const byDate = useMemo(() => {
    const map = {}
    for (const e of events || []) {
      if (!e?.date) continue
      const key = e.date.slice(0, 10)
      ;(map[key] = map[key] || []).push(e)
    }
    return map
  }, [events])

  return (
    <div className="smsc-yearcal__month">
      <div className="smsc-yearcal__month-name">{MONTH_NAMES[month]}</div>
      <div className="smsc-yearcal__weekdays">
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={i} className="smsc-yearcal__wd">{w}</div>
        ))}
      </div>
      <div className="smsc-yearcal__days">
        {grid.map((d, idx) => {
          const inMonth = d.getMonth() === month
          const key = ymd(d)
          const dayEvents = byDate[key]
          const hasEvent = !!dayEvents && dayEvents.length > 0
          const isSel = selected && selected.key === key
          if (!inMonth) {
            return <div key={idx} className="smsc-yearcal__day smsc-yearcal__day--out">&nbsp;</div>
          }
          return (
            <button
              type="button"
              key={idx}
              className={`smsc-yearcal__day ${hasEvent ? dateClasses(dayEvents) : ''} ${isSel ? 'smsc-yearcal__day--sel' : ''}`}
              onMouseEnter={() => hasEvent && onSelect({ key, events: dayEvents })}
              onFocus={() => hasEvent && onSelect({ key, events: dayEvents })}
              onClick={() => hasEvent && onSelect({ key, events: dayEvents })}
              aria-label={hasEvent
                ? `${d.getDate()} ${MONTH_NAMES[month]} — ${dayEvents.map(e => e.title).join(', ')}`
                : `${d.getDate()} ${MONTH_NAMES[month]}`
              }
              tabIndex={hasEvent ? 0 : -1}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function YearCalendar({ events = [], year = 2026 }) {
  const [selected, setSelected] = useState(null)

  const selectedEvents = selected?.events || []
  const selectedDate = selected ? new Date(selected.key + 'T00:00:00') : null

  return (
    <div className="smsc-yearcal">
      {/* Year heading + colour legend (matches Anelia's mockup) */}
      <div className="smsc-yearcal__header">
        <div className="smsc-yearcal__year">{year}</div>
        <div className="smsc-yearcal__legend">
          <span><span className="smsc-yearcal__swatch" style={{ background: '#1d4ed8' }}></span>Wests Ashfield</span>
          <span><span className="smsc-yearcal__swatch" style={{ background: '#16a34a' }}></span>Member's home</span>
          <span><span className="smsc-yearcal__swatch" style={{ background: '#dc2626' }}></span>EXPO</span>
        </div>
      </div>

      {/* 4 × 3 grid of months */}
      <div className="smsc-yearcal__grid">
        {Array.from({ length: 12 }, (_, m) => (
          <MiniMonth
            key={m}
            year={year}
            month={m}
            events={events}
            selected={selected}
            onSelect={setSelected}
          />
        ))}
      </div>

      {/* Popup / info panel — appears when a coloured date is hovered or clicked */}
      <div className="smsc-yearcal__popup">
        {selected ? (
          <>
            <div className="smsc-yearcal__popup-date">
              {selectedDate.toLocaleDateString('en-AU', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
              })}
            </div>
            <ul className="smsc-yearcal__popup-list">
              {selectedEvents.map((e, i) => (
                <li key={i}>
                  <span className={`smsc-yearcal__popup-badge ${
                    e.type === 'EXPO' ? 'is-expo' :
                    e.type === 'Meeting' ? 'is-meeting' :
                    e.type === 'HomeMeeting' ? 'is-home' : 'is-other'
                  }`}>
                    {e.type === 'HomeMeeting' ? "Member's Home" :
                     e.type === 'Meeting'     ? 'Wests Ashfield' :
                     e.type === 'EXPO'        ? 'EXPO' : (e.type || 'Event')}
                  </span>
                  <span className="smsc-yearcal__popup-title">{e.title}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="smsc-yearcal__popup-empty">
            Click or hover a coloured date for meeting details.
          </div>
        )}
      </div>
    </div>
  )
}
