import { useEffect, useMemo, useState } from 'react'
import { galleryStub } from '../data/galleryStub.js'
import { supabase, isLive } from '../lib/supabase.js'
import ShipTile from '../components/ShipTile.jsx'
import SubpageHeaderImage from '../components/SubpageHeaderImage.jsx'

/**
 * T2 → T3 Gallery.
 * Anelia's spec: "Database: list of model ship names and model maker with photos
 * of each model and text about the making of the model... Need to be able to
 * 'word' search to locate information."
 */
export default function Gallery() {
  const [items, setItems]         = useState(galleryStub)
  const [query, setQuery]         = useState('')
  const [shipType, setShipType]   = useState('all')
  const [year, setYear]           = useState('all')

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
    () => ['all', ...Array.from(new Set(items.map(i => i.ship_type).filter(Boolean)))],
    [items],
  )
  const years = useMemo(
    () => ['all', ...Array.from(new Set(items.map(i => i.year).filter(Boolean))).sort((a,b) => b - a)],
    [items],
  )

  const filtered = items.filter(i => {
    if (shipType !== 'all' && i.ship_type !== shipType) return false
    if (year !== 'all' && String(i.year) !== String(year)) return false
    if (query) {
      const q = query.toLowerCase()
      return (
        (i.title || '').toLowerCase().includes(q) ||
        (i.builder || '').toLowerCase().includes(q) ||
        (i.description || '').toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <>
    <SubpageHeaderImage label="Gallery — Modelmakers / Models — header image" />
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold text-navy-900">Gallery — Model Ships</h1>
      <p className="mt-3 text-navy-700 max-w-3xl">
        Searchable database of member builds. Filter by ship type or year,
        or word-search by ship name or model maker.
      </p>

      {!isLive && (
        <div className="mt-6 rounded bg-brass-500/10 border border-brass-500/30 text-sm text-navy-800 p-4">
          Gallery placeholders shown. The full archive will appear here once
          the club's photos and build records are loaded.
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-3 gap-3">
        <input
          type="search"
          placeholder="Word search — ship name, builder, keyword…"
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

      <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(item => <ShipTile key={item.id} item={item} />)}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-navy-500 py-12">
            No builds match those filters.
          </p>
        )}
      </div>
    </section>
    </>
  )
}
