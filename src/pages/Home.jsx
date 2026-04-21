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
      {/* Intro strip — matches the "Live images of models" caption in the layout */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-6 text-center">
        <p className="text-xs uppercase tracking-widest text-brass-600 font-semibold">
          Sydney Model Shipbuilders Club
        </p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl text-navy-900 font-bold">
          Live images of our members' model ships
        </h1>
        <p className="mt-3 text-navy-700 max-w-2xl mx-auto text-sm md:text-base">
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
