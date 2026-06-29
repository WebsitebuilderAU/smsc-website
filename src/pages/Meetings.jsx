import { useEffect, useState } from 'react'
import { supabase, isLive } from '../lib/supabase.js'
import MonthCalendar from '../components/MonthCalendar.jsx'

/**
 * Calendar / Meetings page — per Anelia's PDF page 3.
 * Three-column layout:
 *   Left  — Even-month meetings info + 2 club photos
 *   Centre — 12-month 2026 calendar grid (Mon-start, colour-coded)
 *   Right  — Odd-month meetings info + 2 home photos
 */

// Hard-coded 2026 meeting dates for colour-coding (Supabase augments these)
function buildLockedEvents() {
  // Even months — 1st Sunday at Wests Ashfield (blue/Meeting)
  const evenMonths = [2, 4, 6, 8, 10, 12]
  const locked = []

  for (const m of evenMonths) {
    // Find the 1st Sunday in that month
    const d = new Date(2026, m - 1, 1)
    while (d.getDay() !== 0) d.setDate(d.getDate() + 1)
    const ymd = `2026-${String(m).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    locked.push({ date: ymd, title: 'Meeting — Wests Ashfield', type: 'Meeting' })
  }

  // Odd months — member home weekends (green/HomeMeeting)
  // Using 2nd Saturday as representative "on the weekend"
  const oddMonths = [3, 5, 7, 9, 11]
  for (const m of oddMonths) {
    const d = new Date(2026, m - 1, 1)
    let satCount = 0
    while (satCount < 2) {
      if (d.getDay() === 6) satCount++
      if (satCount < 2) d.setDate(d.getDate() + 1)
    }
    const ymd = `2026-${String(m).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
    locked.push({ date: ymd, title: "Meeting — Member's Home", type: 'HomeMeeting' })
  }

  // EXPO — 31 Oct + 1 Nov 2026
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
        date:  e.event_date.slice(0, 10),
        title: e.title || e.event_type || 'Event',
        type:  e.event_type || 'Other',
      })),
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* 3-column layout — per PDF page 3 */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6 items-start">

        {/* Left column — even months */}
        <div>
          <h2 className="font-display font-bold text-navy-900 text-lg leading-snug mb-3">
            On Even Months —<br />
            <span className="font-normal text-base">Feb Apr Jun Aug Oct Dec</span><br />
            the 1st Sunday at 6:00pm at Wests Ashfield
          </h2>
          <div className="space-y-3">
            <div className="overflow-hidden rounded shadow-sm border border-navy-200">
              <img
                src="/images/anelia-28jun/IMG_7369.jpeg"
                alt="Club meeting at Wests Ashfield"
                className="w-full h-40 object-cover block"
                loading="eager"
              />
            </div>
            <div className="overflow-hidden rounded shadow-sm border border-navy-200">
              <img
                src="/images/anelia-28jun/Club_Info_Page_Photo_Compilation.jpeg"
                alt="Club meeting — members sharing models"
                className="w-full h-40 object-cover block"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Centre column — 12-month calendar */}
        <div>
          <MonthCalendar events={calEvents} initialYear={2026} initialMonth={0} />
          <p className="mt-2 text-xs text-center text-navy-500">
            Click a coloured date for meeting details.
          </p>
          {/* Colour legend matching PDF */}
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-navy-700">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#2563eb' }}></span>
              Wests Ashfield
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#16a34a' }}></span>
              Member's home
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#dc2626' }}></span>
              EXPO
            </span>
          </div>
        </div>

        {/* Right column — odd months */}
        <div>
          <h2 className="font-display font-bold text-navy-900 text-lg leading-snug mb-3">
            On Odd Months —<br />
            <span className="font-normal text-base">Mar May July Sept Nov</span><br />
            at a members' home on the weekend.
          </h2>
          <div className="space-y-3">
            <div className="overflow-hidden rounded shadow-sm border border-navy-200">
              <img
                src="/images/anelia-28jun/IMG_7518.jpeg"
                alt="Meeting at a member's home"
                className="w-full h-40 object-cover block"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded shadow-sm border border-navy-200">
              <img
                src="/images/anelia-28jun/IMG_8005.jpeg"
                alt="Members discussing models at home meeting"
                className="w-full h-40 object-cover block"
                loading="lazy"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
