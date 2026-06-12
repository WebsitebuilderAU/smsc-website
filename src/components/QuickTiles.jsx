import { Link } from 'react-router-dom'
import meetingsImg   from '../assets/img/smsc_header_ships.jpg'
import galleryImg    from '../assets/img/ship_three_masted.jpg'
import chatterboxImg from '../assets/img/smsc_chatterbox_masthead.png'
import eventsImg     from '../assets/img/ship_gilded_stern.jpg'

/**
 * T1 Quick Tiles row — per Anelia's diagram (revised 6 June 2026).
 * Five navy tiles under the hero linking to the five T2 sections.
 * Whole tile is a Link, so the full square is clickable (not just the label).
 */
const tiles = [
  { to: '/about',      label1: 'About',        label2: 'The Club & Membership',  kind: 'wordmark' },
  { to: '/meetings',   label1: 'Calendar',     label2: 'Meetings',               img: meetingsImg,   kind: 'photo' },
  { to: '/events',     label1: 'Events',       label2: 'EXPO / Workshops',       img: eventsImg,     kind: 'photo' },
  { to: '/gallery',    label1: 'Gallery',      label2: 'Modelmakers / Models',   img: galleryImg,    kind: 'photo' },
  { to: '/chatterbox', label1: 'Newsletter',   label2: 'Chatterbox',             img: chatterboxImg, kind: 'logo'  },
]

export default function QuickTiles() {
  return (
    <section className="bg-navy-50 py-6 border-b border-navy-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* 5 tiles, flush — 2 cols on phone, 5 cols from md up so they sit in a single row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {tiles.map(t => (
            <Link
              key={t.to}
              to={t.to}
              aria-label={`${t.label1} — ${t.label2}`}
              className="group relative overflow-hidden rounded shadow-sm
                         border-2 border-brass-500
                         bg-navy-800 text-white
                         flex flex-col transition hover:shadow-md hover:-translate-y-0.5
                         focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-2"
            >
              {/* Cover — full square clickable because the whole Link wraps everything */}
              {t.kind === 'wordmark' ? (
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-navy-800 flex items-center justify-center">
                  <div className="absolute inset-3 border border-brass-500/40 rounded"></div>
                  <div className="text-center px-4">
                    <p className="font-display font-bold text-2xl md:text-3xl text-white leading-tight">
                      SMSC
                    </p>
                    <p className="text-[10px] md:text-xs text-brass-300 mt-2 tracking-widest uppercase">
                      Est. Sydney
                    </p>
                  </div>
                </div>
              ) : (
                <div className={`relative w-full aspect-[4/3] overflow-hidden ${t.kind === 'logo' ? 'bg-white' : 'bg-navy-700'}`}>
                  <img
                    src={t.img}
                    alt=""
                    className={`absolute inset-0 w-full h-full transition duration-500 group-hover:scale-105
                                ${t.kind === 'logo' ? 'object-contain p-4' : 'object-cover'}`}
                    loading="lazy"
                  />
                </div>
              )}
              {/* Label band */}
              <div className="px-3 py-3 text-center bg-navy-800">
                <p className="font-display font-bold text-sm md:text-base leading-tight">
                  {t.label1}
                </p>
                {t.label2 && (
                  <p className="text-[11px] md:text-xs text-brass-300 mt-1 leading-tight">
                    {t.label2}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
