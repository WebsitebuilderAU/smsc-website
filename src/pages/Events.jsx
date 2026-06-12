import { useEffect, useState, useRef } from 'react'
import { supabase, isLive } from '../lib/supabase.js'
import SubpageHeaderImage from '../components/SubpageHeaderImage.jsx'
import headerImg from '../assets/img/ship_gilded_stern.jpg'

/**
 * Events & EXPO page — Anelia's 6 June revisions:
 *  - "Past Expos" jump button at the top
 *  - 3 video slots embedded (EXPO promo 2.5m, Kids 8.5m, 4 Villages Walk 3m)
 *  - EXPO archive with navy-outline YEAR buttons, poster-in-button layout
 */

// EXPO years — most-recent first. `poster` is the static archive image
// (falls back to a navy panel if not yet uploaded). When a year's
// archive content is supplied by the club it will populate from Supabase.
const EXPO_YEARS = [
  { year: 2026, label: 'EXPO 2026', tagline: 'Sat 31 Oct & Sun 1 Nov 2026 — Save the date' },
  { year: 2024, label: 'EXPO 2024', tagline: 'Past EXPO' },
  { year: 2023, label: 'EXPO 2023', tagline: 'Past EXPO' },
  { year: 2022, label: 'EXPO 2022', tagline: 'Past EXPO' },
  { year: 2019, label: 'EXPO 2019', tagline: 'Past EXPO' },
  { year: 2018, label: 'EXPO 2018', tagline: 'Past EXPO' },
]

// Three videos Anelia is supplying — placeholders until files received.
// When the files arrive they're uploaded to /public/video/<slug>.mp4 and
// the `src` here is updated.
const FEATURE_VIDEOS = [
  {
    slug: 'expo-promo',
    title: 'EXPO Promo',
    duration: '2:30',
    src: '/video/expo-promo.mp4',
    poster: '/img/ship_gilded_stern.jpg',
  },
  {
    slug: 'kids-modelmaking',
    title: 'Kids Modelmaking at SMSC',
    duration: '8:30',
    src: '/video/kids-modelmaking.mp4',
    poster: '/img/ship_three_masted.jpg',
  },
  {
    slug: '4-villages-walk',
    title: '4 Villages Walk',
    duration: '3:00',
    src: '/video/4-villages-walk.mp4',
    poster: '/img/smsc_header_ships.jpg',
  },
]

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(isLive)
  const archiveRef = useRef(null)

  useEffect(() => {
    if (!isLive) { setLoading(false); return }
    let active = true
    supabase
      .from('events')
      .select('*')
      .neq('event_type', 'Meeting')
      .order('event_date', { ascending: true })
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) setEvents(data)
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  const today = new Date().toISOString()
  const upcoming = events.filter(e => (e.event_date || '') >= today)

  function jumpToArchive() {
    archiveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
    <SubpageHeaderImage label="Events & EXPO" image={headerImg} />
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-14">

      {/* Header + jump bar */}
      <header>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-4xl font-display font-bold text-navy-900">Events &amp; EXPO</h1>
            <p className="mt-2 text-sm text-navy-500">
              The SMSC EXPO, workshops, club outings and member videos.
            </p>
          </div>
          <button
            onClick={jumpToArchive}
            className="inline-flex items-center gap-1.5 text-navy-900 text-sm font-semibold
                       px-4 py-2 rounded-full border-2 border-navy-800
                       hover:bg-navy-800 hover:text-white transition
                       focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-2"
          >
            Past EXPOs ↓
          </button>
        </div>
      </header>

      {/* Upcoming events */}
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Upcoming</h2>
        {loading && <p className="mt-3 text-navy-500 text-sm">Loading…</p>}
        <ul className="mt-3 divide-y divide-navy-200 bg-white rounded shadow-sm border border-navy-200">
          {!loading && upcoming.length === 0 && (
            <li className="p-5 text-navy-500 text-sm italic">
              SMSC EXPO 2026 — Saturday 31 October & Sunday 1 November. Full programme to follow.
            </li>
          )}
          {upcoming.map(e => (
            <li key={e.id} className="p-5">
              <h3 className="font-display text-lg text-navy-900">
                {e.title} <span className="text-xs ml-1 text-brass-700">{e.event_type}</span>
              </h3>
              <p className="text-sm text-navy-600">
                {e.event_date ? new Date(e.event_date).toLocaleString('en-AU') : ''}
                {e.location ? ` · ${e.location}` : ''}
              </p>
              {e.description && <p className="mt-2 text-sm text-navy-700">{e.description}</p>}
            </li>
          ))}
        </ul>
      </div>

      {/* Feature videos */}
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Watch</h2>
        <p className="mt-1 text-sm text-navy-500">Club videos — open one to play.</p>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURE_VIDEOS.map(v => (
            <figure key={v.slug} className="bg-white rounded shadow-sm border border-navy-200 overflow-hidden">
              <div className="relative aspect-video bg-navy-900">
                <video
                  controls
                  preload="metadata"
                  poster={v.poster}
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src={v.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <figcaption className="p-3">
                <p className="font-display font-semibold text-navy-900">{v.title}</p>
                <p className="text-xs text-navy-500">{v.duration}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* Past EXPOs — navy outline year buttons, poster-in-button layout */}
      <div ref={archiveRef} className="scroll-mt-24">
        <h2 className="font-display text-2xl font-bold text-navy-900">Past EXPOs</h2>
        <p className="mt-1 text-sm text-navy-500">Tap a year to view photos, programme and highlights.</p>
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {EXPO_YEARS.map(y => (
            <a
              key={y.year}
              href={`/events/expo/${y.year}`}
              className="group block rounded-lg border-2 border-navy-800 bg-white overflow-hidden
                         hover:bg-navy-50 hover:shadow-md transition
                         focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-2"
            >
              {/* Poster panel — falls back to navy panel with year if no poster yet */}
              <div className="relative aspect-[3/4] bg-navy-100 flex items-center justify-center overflow-hidden">
                <img
                  src={`/img/expo/${y.year}.jpg`}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <span className="relative font-display font-bold text-3xl text-navy-900/30">
                  {y.year}
                </span>
              </div>
              {/* Label band — navy outline button feel */}
              <div className="px-2 py-2 text-center bg-white border-t-2 border-navy-800">
                <p className="font-display font-bold text-navy-900 leading-tight text-sm md:text-base">
                  {y.label}
                </p>
                <p className="text-[10px] md:text-xs text-navy-600 mt-0.5 leading-tight">
                  {y.tagline}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>

    </section>
    </>
  )
}
