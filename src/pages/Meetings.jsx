import { useEffect, useState } from 'react'
import { supabase, isLive } from '../lib/supabase.js'
import SubpageHeaderImage from '../components/SubpageHeaderImage.jsx'
import MonthCalendar from '../components/MonthCalendar.jsx'
import headerImg from '../assets/img/smsc_header_ships.jpg'

/**
 * Meetings page — month-grid calendar (Monday-start) + venue blocks.
 * EXPO 31 Oct + 1 Nov 2026 is hard-locked in MonthCalendar regardless of DB state.
 * Anelia 6 June revision.
 */
export default function Meetings() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(isLive)

  useEffect(() => {
    if (!isLive) { setLoading(false); return }
    let active = true
    supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) setEvents(data)
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  // Convert supabase rows into the MonthCalendar shape
  const calEvents = events
    .filter(e => e.event_date)
    .map(e => ({
      date:  e.event_date.slice(0, 10),
      title: e.title || e.event_type || 'Event',
      type:  e.event_type || 'Other',
    }))

  // Upcoming meeting list (under the calendar) — meetings only
  const today = new Date().toISOString()
  const upcomingMeetings = events
    .filter(e => e.event_type === 'Meeting' && (e.event_date || '') >= today)
    .slice(0, 6)

  return (
    <>
    <SubpageHeaderImage label="Meetings & Calendar" image={headerImg} />
    <section className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">Meetings & Calendar</h1>
        <p className="mt-2 text-sm text-navy-500">
          Meetings, workshops and the annual EXPO at a glance. Week starts Monday.
        </p>
      </header>

      <MonthCalendar events={calEvents} />

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Next meetings</h2>
        {loading && <p className="mt-3 text-navy-500 text-sm">Loading…</p>}
        <ul className="mt-3 divide-y divide-navy-200 bg-white rounded shadow-sm border border-navy-200">
          {!loading && upcomingMeetings.length === 0 && (
            <li className="p-5 text-navy-500 text-sm italic">
              Next meeting dates will be confirmed by the Club secretary.
            </li>
          )}
          {upcomingMeetings.map(e => (
            <li key={e.id} className="p-5">
              <h3 className="font-display text-lg text-navy-900">{e.title}</h3>
              <p className="text-sm text-navy-600">
                {e.event_date
                  ? new Date(e.event_date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                  : ''}
                {e.location ? ` · ${e.location}` : ''}
              </p>
              {e.description && <p className="mt-2 text-sm text-navy-700">{e.description}</p>}
            </li>
          ))}
        </ul>
      </div>

      <aside className="bg-brass-500/10 border-l-4 border-brass-500 rounded p-5">
        <h3 className="font-display font-bold text-navy-900">SMSC EXPO 2026</h3>
        <p className="text-sm text-navy-700 mt-1">
          Saturday 31 October & Sunday 1 November 2026. Save the dates — full programme to follow.
        </p>
      </aside>
    </section>
    </>
  )
}
