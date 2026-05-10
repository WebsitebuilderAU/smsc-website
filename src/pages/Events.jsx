import { useEffect, useState } from 'react'
import { supabase, isLive } from '../lib/supabase.js'
import SubpageHeaderImage from '../components/SubpageHeaderImage.jsx'

/**
 * Events & EXPO page — split into EXPO/Workshop/Other (anything not 'Meeting').
 * Lists upcoming and past entries from the events table.
 */
export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(isLive)

  useEffect(() => {
    if (!isLive) return
    let active = true
    supabase
      .from('events')
      .select('*')
      .neq('event_type', 'Meeting')
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
    <SubpageHeaderImage label="Events & EXPO — header image" />
    <section className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">Events &amp; EXPO</h1>
        <p className="mt-2 text-sm text-navy-500">Content for this page is supplied by the Club.</p>
      </header>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Upcoming</h2>
        {loading && <p className="mt-3 text-navy-500 text-sm">Loading…</p>}
        <ul className="mt-3 divide-y divide-navy-200 bg-white rounded shadow-sm border border-navy-200">
          {!loading && upcoming.length === 0 && (
            <li className="p-5 text-navy-500 text-sm italic">No upcoming events published yet.</li>
          )}
          {upcoming.map(e => (
            <li key={e.id} className="p-5">
              <h3 className="font-display text-lg text-navy-900">{e.title} <span className="text-xs ml-1 text-brass-700">{e.event_type}</span></h3>
              <p className="text-sm text-navy-600">
                {e.event_date ? new Date(e.event_date).toLocaleString('en-AU') : ''}
                {e.location ? ` · ${e.location}` : ''}
              </p>
              {e.description && <p className="mt-2 text-sm text-navy-700">{e.description}</p>}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Past events</h2>
        <ul className="mt-3 space-y-3">
          {past.length === 0 && (
            <li className="p-5 bg-white rounded shadow-sm border border-navy-200 text-navy-500 text-sm italic">
              Past event highlights will appear here once uploaded by the Club.
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
