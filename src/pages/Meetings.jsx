import { useEffect, useState } from 'react'
import { supabase, isLive } from '../lib/supabase.js'
import YearCalendar from '../components/YearCalendar.jsx'

/**
 * Calendar / Meetings page — per Anelia's PDF page 3.
 * Three-column layout:
 *   Left  — Even-month meetings info + 2 club photos
 *   Centre — 12-month 2026 calendar grid
 *   Right  — Odd-month meetings info + 1 tall home-meeting photo
 */

function buildLockedEvents() {
  const evenMonths = [2, 4, 6, 8, 10, 12]
  const locked = []

  for (const m of evenMonths) {
    const d = new Date(2026, m - 1, 1)
    while (d.getDay() !== 0) d.setDate(d.getDate() + 1)
    const ymd = `2026-${String(m).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    locked.push({ date: ymd, title: 'Meeting — Wests Ashfield', type: 'Meeting' })
  }

  const oddMonths = [3, 5, 7, 9, 11]
  for (const m of oddMonths) {
    const d = new Date(2026, m - 1, 1)
    let satCount = 0
    while (satCount < 2) {
      if (d.getDay() === 6) satCount++
      if (satCount < 2) d.setDate(d.getDate() + 1)
    }
    const ymd = `2026-${String(m).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    locked.push({ date: ymd, title: "Meeting — Member's Home", type: 'HomeMeeting' })
  }

  locked.push({ date: '2026-10-31', title: 'SMSC EXPO 2026 — Day 1', type: 'EXPO', locked: true })
  locked.push({ date: '2026-11-01', title: 'SMSC EXPO 2026 — Day 2', type: 'EXPO', locked: true })

  return locked
}

const LOCKED_EVENTS = buildLockedEvents()

export default function Meetings() {
  const [dbEvents, setDbEvents] = useState([])

  useEffect(() => {
    if (!isLive) return
    let active = true
    supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) setDbEvents(data)
      })
    return () => { active = false }
  }, [])

  const calEvents = [
    ...LOCKED_EVENTS,
    ...dbEvents
      .filter(e => e.event_date)
      .map(e => ({
        date: e.event_date.slice(0, 10),
        title: e.title || e.event_type || 'Event',
        type: e.event_type || 'Other',
      })),
  ]

  return (
    <section className="max-w-[1500px] mx-auto px-3 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_2.1fr_1.05fr] gap-5 items-start">

        <div>
          <h2 className="font-display font-bold text-navy-900 text-lg leading-snug mb-3">
            On Even Months —<br />
            <span className="font-normal text-base">Feb Apr Jun Aug Oct Dec</span><br />
            the 1st Sunday at 6:00pm at Wests Ashfield
          </h2>
          <div className="space-y-3">
            <img
              src="./images/anelia-28jun/IMG_7369.jpeg"
              alt="Club meeting at Wests Ashfield"
              className="w-full h-auto object-contain block"
              loading="eager"
            />
            <img
              src="./images/anelia-28jun/IMG_7518.jpeg"
              alt="Meeting room at Wests Ashfield"
              className="w-full h-auto object-contain block"
              loading="lazy"
            />
          </div>
        </div>

        <div>
          <YearCalendar events={calEvents} year={2026} />
        </div>

        <div>
          <h2 className="font-display font-bold text-navy-900 text-lg leading-snug mb-3">
            On Odd Months —<br />
            <span className="font-normal text-base">Mar May July Sept Nov</span><br />
            at a members' home on the weekend.
          </h2>
          <img
            src="./images/anelia-28jun/IMG_6436.jpeg"
            alt="Members at a home meeting around the table"
            className="w-full h-auto object-contain block"
            loading="lazy"
          />
        </div>

      </div>
    </section>
  )
}
