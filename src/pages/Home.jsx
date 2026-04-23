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
      {/* Banner — final hero image to be supplied by the Club */}
      <section className="relative bg-navy-800">
        <div className="h-48 md:h-64 flex items-center justify-center text-white text-center px-4">
          <div>
            <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-brass-400 font-semibold">
              Placeholder banner
            </p>
            <h1 className="mt-1 font-display text-2xl md:text-4xl font-bold drop-shadow">
              Banner image and headline to be supplied
            </h1>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pt-8 pb-4 text-center">
        <p className="text-navy-500 max-w-2xl mx-auto text-sm italic">
          [Placeholder — intro copy to be supplied by the Club.]
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
