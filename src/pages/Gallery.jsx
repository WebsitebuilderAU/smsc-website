import { useEffect, useMemo, useState } from 'react'
import { galleryStub } from '../data/galleryStub.js'
import { supabase, isLive } from '../lib/supabase.js'

export default function Gallery() {
  const [items, setItems]         = useState(galleryStub)
  const [query, setQuery]         = useState('')
  const [shipType, setShipType]   = useState('all')
  const [year, setYear]           = useState('all')

  // When Supabase creds are present, pull from the real table.
  useEffect(() => {
    if (!isLive) return
    let active = true
    supabase
      .from('gallery_items')
      .select('*')
      .order('year', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data?.length) setItems(data)
      })
    return () => { active = false }
  }, [])

  const shipTypes = useMemo(
    () => ['all', ...Array.from(new Set(items.map(i => i.ship_type)))],
    [items],
  )
  const years = useMemo(
    () => ['all', ...Array.from(new Set(items.map(i => i.year))).sort((a,b) => b - a)],
    [items],
  )

  const filtered = items.filter(i => {
    if (shipType !== 'all' && i.ship_type !== shipType) return false
    if (year !== 'all' && String(i.year) !== String(year)) return false
    if (query) {
      const q = query.toLowerCase()
      return (
        i.title.toLowerCase().includes(q) ||
        i.builder?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold text-navy-900">Gallery</h1>
      <p className="mt-3 text-navy-600 max-w-2xl">
        Browse members' completed and in-progress model ships.
        Filter by ship type, year, or search by name or builder.
      </p>

      {!isLive && (
        <div className="mt-6 rounded bg-brass-500/10 border border-brass-500/30 text-sm text-navy-800 p-4">
          Showing sample content. The full gallery will appear here once the club's
          records are loaded.
        </div>
      )}

      {/* Filters */}
      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        <input
          type="search"
          placeholder="Search by name, builder…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="px-4 py-2 rounded border border-navy-200 focus:outline-none focus:ring-2 focus:ring-brass-500"
        />
        <select
          value={shipType}
          onChange={e => setShipType(e.target.value)}
          className="px-4 py-2 rounded border border-navy-200 bg-white"
        >
          {shipTypes.map(t => <option key={t} value={t}>{t === 'all' ? 'All ship types' : t}</option>)}
        </select>
        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          className="px-4 py-2 rounded border border-navy-200 bg-white"
        >
          {years.map(y => <option key={y} value={y}>{y === 'all' ? 'All years' : y}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(item => (
          <article key={item.id} className="bg-white rounded-lg shadow overflow-hidden group">
            <div className="aspect-[4/3] overflow-hidden bg-navy-100">
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-display font-bold text-xl text-navy-900">{item.title}</h3>
              <p className="text-sm text-navy-500 mt-1">
                {item.ship_type} · {item.year} · {item.builder}
              </p>
              <p className="text-navy-700 text-sm mt-3 line-clamp-3">{item.description}</p>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-navy-500 py-12">
            No builds match those filters.
          </p>
        )}
      </div>
    </section>
  )
}
