import { useEffect, useState } from 'react'
import { supabase, isLive } from '../lib/supabase.js'

/**
 * T2 Events / EXPO — per Anelia's diagram:
 *   "2026 — 12th EXPO. 11 past EXPOs. Videos and Images to be hosted on the site."
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
      .ilike('title', '%expo%')
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) setEvents(data)
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  return (
    <section className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <img
        src={`${import.meta.env.BASE_URL}images/smsc_header_ships.jpg`}
        alt="Model ships exhibited at a past SMSC EXPO"
        className="w-full h-48 md:h-64 object-cover rounded shadow-sm"
      />
      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">Events &amp; EXPO</h1>
        <p className="mt-3 text-navy-700 max-w-3xl">
          The club's annual EXPO is our flagship event — an open exhibition of
          maritime and related models held at Wests Ashfield. The 12th EXPO
          will be held in 2026. This page hosts videos and images from the
          current and all past EXPOs.
        </p>
      </header>

      <div className="p-6 bg-navy-800 text-white rounded shadow">
        <p className="text-xs uppercase tracking-widest text-brass-400 font-semibold">This year</p>
        <h2 className="mt-1 font-display text-2xl font-bold">EXPO 2026 — 12th Annual</h2>
        <p className="mt-2 text-sm text-navy-100">
          Open to all members, visitors and other modelling clubs to exhibit
          maritime and related models. Full date and programme published in
          Chatterbox and on the Meetings calendar.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Past EXPOs</h2>
        <p className="text-sm text-navy-500 mt-1">Videos and images from 11 previous EXPOs.</p>
        {loading && <p className="mt-4 text-navy-500">Loading…</p>}
        <ul className="mt-4 grid md:grid-cols-2 gap-4">
          {!loading && events.length === 0 && (
            <li className="col-span-full p-5 bg-white rounded shadow-sm border border-navy-200 text-navy-500 text-sm">
              EXPO archive videos and photos will appear here once uploaded by the club.
            </li>
          )}
          {events.map(e => (
            <li key={e.id} className="p-5 bg-white rounded shadow-sm border border-navy-200">
              <h3 className="font-display text-lg text-navy-900">{e.title}</h3>
              <p className="text-sm text-navy-500">
                {new Date(e.date).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
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
