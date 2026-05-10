import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { galleryStub } from '../data/galleryStub.js'
import { supabase, isLive } from '../lib/supabase.js'
import ShipTile from '../components/ShipTile.jsx'
import HeroCollage from '../components/HeroCollage.jsx'
import QuickTiles from '../components/QuickTiles.jsx'

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
      <HeroCollage />
      <QuickTiles />

      {/* THE gallery grid — this IS the landing page */}
      <section className="max-w-7xl mx-auto px-4 pt-10 pb-16">
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
