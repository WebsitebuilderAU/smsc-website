import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { galleryStub } from '../data/galleryStub.js'
import { supabase, isLive } from '../lib/supabase.js'

/**
 * T3 ship detail — per Anelia's diagram:
 *  - photos + text about the making of the model
 *  - link to an article in Chatterbox if it applies
 *  - videos of interviews with model makers hosted on the site
 */
export default function ShipDetail() {
  const { id } = useParams()
  const stub = galleryStub.find(i => i.id === id)
  const [item, setItem] = useState(stub || null)
  const [loading, setLoading] = useState(isLive)

  useEffect(() => {
    if (!isLive) return
    let active = true
    supabase
      .from('gallery_items')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (!active) return
        if (data) setItem(data)
        setLoading(false)
      })
    return () => { active = false }
  }, [id])

  if (loading) return <p className="p-10 text-center text-navy-500">Loading…</p>
  if (!item) return (
    <section className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-3xl text-navy-900">Model not found</h1>
      <p className="mt-3 text-navy-600">This ship is not yet in the gallery.</p>
      <Link to="/gallery" className="inline-block mt-6 text-brass-600 font-semibold hover:underline">
        ← Back to gallery
      </Link>
    </section>
  )

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <Link to="/gallery" className="text-sm text-brass-600 hover:underline">← Back to gallery</Link>

      <div className="mt-4 grid md:grid-cols-2 gap-8">
        <div className="aspect-[4/3] bg-navy-800 rounded overflow-hidden">
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brass-400 font-display text-sm uppercase tracking-widest">
              Photo coming soon
            </div>
          )}
        </div>
        <div>
          <h1 className="font-display text-3xl text-navy-900 font-bold">{item.title}</h1>
          <dl className="mt-4 grid grid-cols-3 gap-y-2 text-sm">
            <dt className="text-navy-500">Model maker</dt>
            <dd className="col-span-2 text-navy-900">{item.builder || '—'}</dd>
            <dt className="text-navy-500">Ship type</dt>
            <dd className="col-span-2 text-navy-900">{item.ship_type || '—'}</dd>
            <dt className="text-navy-500">Year</dt>
            <dd className="col-span-2 text-navy-900">{item.year || '—'}</dd>
          </dl>
        </div>
      </div>

      <div className="mt-10 prose max-w-none">
        <h2 className="font-display text-xl text-navy-900 font-bold">About the build</h2>
        <p className="text-navy-700 leading-relaxed">
          {item.description || 'Build notes will appear here once the maker provides them.'}
        </p>
      </div>

      {item.chatterbox_link && (
        <div className="mt-8 p-5 border-l-4 border-brass-500 bg-brass-500/10">
          <p className="text-sm uppercase tracking-widest text-brass-700 font-semibold">
            Related Chatterbox article
          </p>
          <a href={item.chatterbox_link} className="mt-1 block font-display text-navy-900 hover:underline">
            Read the article in Chatterbox →
          </a>
        </div>
      )}

      {item.interview_video_url && (
        <div className="mt-10">
          <h2 className="font-display text-xl text-navy-900 font-bold">Interview with the model maker</h2>
          <div className="mt-3 aspect-video bg-black rounded overflow-hidden">
            <iframe
              src={item.interview_video_url}
              title={`${item.title} maker interview`}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  )
}
