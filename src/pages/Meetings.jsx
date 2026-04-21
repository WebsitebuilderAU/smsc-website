import { useEffect, useState } from 'react'
import { supabase, isLive } from '../lib/supabase.js'

/**
 * T2 Meetings — per Anelia's diagram:
 *  - Calendar (active?)
 *  - At Wests Ashfield
 *  - At Members' Homes (Endeavour Group)
 *  - T3: Meetings - Past (photos and videos); Calendar (dates with info)
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
      .order('date', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) setEvents(data)
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events.filter(e => e.date >= today)
  const past = events.filter(e => e.date < today).reverse()

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">Meetings</h1>
        <p className="mt-3 text-navy-700 max-w-3xl">
          Members and visitors meet regularly to share modelling experiences,
          tips and techniques. Meetings alternate between Wests Ashfield and
          members' homes (the Endeavour Group). Zoom is occasionally used.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded shadow-sm border border-navy-200">
          <h2 className="font-display text-xl font-bold text-navy-900">At Wests Ashfield</h2>
          <p className="mt-2 text-sm text-navy-700">
            115 Liverpool Rd, Ashfield NSW.<br />
            Primary meeting venue, used for the AGM and annual EXPO.
          </p>
        </div>
        <div className="p-6 bg-white rounded shadow-sm border border-navy-200">
          <h2 className="font-display text-xl font-bold text-navy-900">At Members' Homes</h2>
          <p className="mt-2 text-sm text-navy-700">
            Endeavour Group — informal Show &amp; Tell sessions held at members' homes
            on weekends in "odd" months. Dates and addresses are notified in
            Chatterbox and on the Calendar below.
          </p>
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Calendar</h2>
        <p className="text-sm text-navy-500 mt-1">Upcoming meetings and events.</p>
        {loading && <p className="mt-4 text-navy-500">Loading calendar…</p>}
        <ul className="mt-4 divide-y divide-navy-200 bg-white rounded shadow-sm border border-navy-200">
          {!loading && upcoming.length === 0 && (
            <li className="p-5 text-navy-500">No upcoming meetings published yet.</li>
          )}
          {upcoming.map(e => (
            <li key={e.id} className="p-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg text-navy-900">{e.title}</h3>
                <p className="text-sm text-navy-600">
                  {new Date(e.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  {e.location ? ` · ${e.location}` : ''}
                </p>
                {e.description && <p className="mt-2 text-sm text-navy-700">{e.description}</p>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Past meetings</h2>
        <p className="text-sm text-navy-500 mt-1">Photos and videos from previous meetings.</p>
        <ul className="mt-4 space-y-3">
          {past.length === 0 && (
            <li className="p-5 bg-white rounded shadow-sm border border-navy-200 text-navy-500 text-sm">
              Past meeting photos and videos will appear here once uploaded by the club.
            </li>
          )}
          {past.map(e => (
            <li key={e.id} className="p-5 bg-white rounded shadow-sm border border-navy-200">
              <h3 className="font-display text-lg text-navy-900">{e.title}</h3>
              <p className="text-sm text-navy-500">
                {new Date(e.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
                {e.location ? ` · ${e.location}` : ''}
              </p>
              {e.description && <p className="mt-2 text-sm text-navy-700">{e.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
