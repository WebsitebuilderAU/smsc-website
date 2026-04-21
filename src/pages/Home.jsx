import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { galleryStub } from '../data/galleryStub.js'
import { supabase, isLive } from '../lib/supabase.js'
import ShipTile from '../components/ShipTile.jsx'

/**
 * T1 landing page — per Anelia's diagram.
 * The landing page IS the ship gallery. Click a tile → ship detail page.
 * No hero image above the grid; the club wordmark banner (top of layout)
 * is rendered by App.jsx.
 */
export default function Home() {
  const [items, setItems] = useState(galleryStub)

  useEffect(() => {
    if (!isLive) return
    let active = true
    supabase
      .from('gallery_items')
      .select('*')
      .order('year', { ascending: false })
      .limit(12)
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data?.length) setItems(data)
      })
    return () => { active = false }
  }, [])

  return (
    <>
      {/* Club banner — the club's own composite of member-built ships */}
      <section className="relative bg-navy-800">
        <img
          src={`${import.meta.env.BASE_URL}images/smsc_header_ships.jpg`}
          alt="SMSC member-built model ships on display"
          className="w-full h-48 md:h-64 object-cover object-center opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/30 to-navy-900/70 flex flex-col items-center justify-end pb-6 text-white text-center px-4">
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-brass-400 font-semibold">
            Established 1972 · Sydney
          </p>
          <h1 className="mt-1 font-display text-2xl md:text-4xl font-bold drop-shadow">
            Live images of our members' model ships
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pt-8 pb-4 text-center">
        <p className="text-navy-700 max-w-2xl mx-auto text-sm md:text-base">
          Click any model to read about the ship, see the builder's notes,
          watch interviews and open the related Chatterbox article.
        </p>
      </section>

      {/* THE gallery grid — this IS the landing page */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => <ShipTile key={item.id} item={item} />)}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/gallery"
            className="inline-block bg-navy-800 hover:bg-navy-700 text-white font-semibold px-6 py-3 rounded"
          >
            Open the full searchable gallery →
          </Link>
        </div>
      </section>
    </>
  )
}
