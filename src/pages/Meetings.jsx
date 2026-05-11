import { useEffect, useState } from 'react'
import { supabase, isLive } from '../lib/supabase.js'
import SubpageHeaderImage from '../components/SubpageHeaderImage.jsx'
import headerImg from '../assets/img/smsc_header_ships.jpg'

/**
 * Meetings page — calendar + venue blocks.
 * Venue and schedule copy to be supplied by the Club.
 */
export default function Meetings() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(isLive)

  useEffect(() => {
    if (!isLive) return
    let active = true
    supabase
      .from('events')
      .select('*')
      .eq('event_type', 'Meeting')
      .order('event_date', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) setEvents(data)
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  const today = new Date().toISOString()
  const upcoming = events.filter(e => (e.event_date || '') >= today)
  const past     = events.filter(e => (e.event_date || '') <  today).reverse()

  return (
    <>
    <SubpageHeaderImage label="Meetings" image={headerImg} />
    <section className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">Meetings</h1>
        <p className="mt-2 text-sm text-navy-500">Meeting details to be supplied by the Club.</p>
      </header>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Calendar</h2>
        {loading && <p className="mt-4 text-navy-500">Loading calendar…</p>}
        <ul className="mt-4 divide-y divide-navy-200 bg-white rounded shadow-sm border border-navy-200">
          {!loading && upcoming.length === 0 && (
            <li className="p-5 text-navy-500 text-sm italic">No upcoming meetings published yet.</li>
          )}
          {upcoming.map(e => (
            <li key={e.id} className="p-5">
              <h3 className="font-display text-lg text-navy-900">{e.title}</h3>
              <p className="text-sm text-navy-600">
                {e.event_date ? new Date(e.event_date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                {e.location ? ` · ${e.location}` : ''}
              </p>
              {e.description && <p className="mt-2 text-sm text-navy-700">{e.description}</p>}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Past meetings</h2>
        <ul className="mt-4 space-y-3">
          {past.length === 0 && (
            <li className="p-5 bg-white rounded shadow-sm border border-navy-200 text-navy-500 text-sm italic">
              Past meeting photos and videos will appear here once uploaded by the Club.
            </li>
          )}
          {past.map(e => (
            <li key={e.id} className="p-5 bg-white rounded shadow-sm border border-navy-200">
              <h3 className="font-display text-lg text-navy-900">{e.title}</h3>
              <p className="text-sm text-navy-500">
                {e.event_date ? new Date(e.event_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                {e.location ? ` · ${e.location}` : ''}
              </p>
              {e.description && <p className="mt-2 text-sm text-navy-700">{e.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
    </>
  )
}
