import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    (async () => {
      const tables = ['gallery_items', 'events', 'newsletters', 'videos', 'meeting_notes']
      const out = {}
      for (const t of tables) {
        const { count } = await supabase.from(t).select('*', { count: 'exact', head: true })
        out[t] = count ?? 0
      }
      setCounts(out)
    })()
  }, [])

  const cards = [
    { to: '/admin/gallery',     label: 'Gallery / Member ships', count: counts.gallery_items, hint: 'Add a ship with photos, builder, scale, era, write-up.' },
    { to: '/admin/events',      label: 'Events & EXPO',          count: counts.events,        hint: 'Upcoming meetings, workshops and EXPO dates.' },
    { to: '/admin/meetings',    label: 'Meeting Notes',          count: counts.meeting_notes, hint: 'Agenda, minutes (PDF or text), attendance.' },
    { to: '/admin/newsletters', label: 'Chatterbox newsletters', count: counts.newsletters,   hint: 'Upload monthly Chatterbox PDFs.' },
    { to: '/admin/videos',      label: 'Videos',                 count: counts.videos,        hint: 'Paste Cloudflare Stream / Vimeo / YouTube embed.' },
    { to: '/admin/club',        label: 'Club Info',              count: '—',                  hint: 'Members count, blurb, venue, meeting time.' },
  ]

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-display font-bold text-navy-900">Welcome</h2>
        <p className="text-navy-700 mt-1">Add or edit content from any panel below. Public pages refresh automatically.</p>
      </header>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(c => (
          <Link key={c.to} to={c.to} className="block bg-white rounded-lg border border-navy-200 p-5 hover:border-brass-500 hover:shadow-md transition">
            <div className="flex items-baseline justify-between">
              <h3 className="font-display font-bold text-navy-900">{c.label}</h3>
              <span className="text-2xl font-display text-brass-600">{c.count ?? '…'}</span>
            </div>
            <p className="text-sm text-navy-600 mt-2">{c.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
