import { Link } from 'react-router-dom'

/**
 * Events page — per Anelia's PDF page 4.
 * Left: 2026 EXPO poster (~50% width).
 * Centre: 3 stacked event photos.
 * Right: 3 red-bordered pill buttons stacked.
 */

const EVENT_PHOTOS = [
  { src: '/images/anelia-28jun/IMG_1327.jpeg',      alt: 'EXPO display hall — tables of models' },
  { src: '/images/anelia-28jun/IMG_0059_copy.jpeg', alt: 'Visitors viewing ship models' },
  { src: '/images/anelia-28jun/IMG_8784.jpeg',      alt: 'Close-up of model ships on display' },
]

export default function Events() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* 3-column layout — poster | photos | pill buttons */}
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1fr] gap-6 items-start">

        {/* Left — 2026 EXPO poster */}
        <div>
          <img
            src="/images/anelia-28jun/6.5MB_EXPO_2026_Festival__Poster_31st_Oct_1st_Nov___copy.jpeg"
            alt="EXPO 2026 — The Sydney Festival of Model Shipbuilding poster"
            className="w-full rounded shadow-md border border-navy-200"
            loading="eager"
          />
        </div>

        {/* Centre — 3 stacked event photos */}
        <div className="flex flex-col gap-3">
          {EVENT_PHOTOS.map((img, i) => (
            <div key={i} className="overflow-hidden rounded shadow-sm border border-navy-200">
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-44 object-cover block"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>

        {/* Right — 3 red-outlined pill buttons stacked per PDF */}
        <div className="flex flex-col gap-4 items-start pt-2">

          {/* Festival of Model Shipbuilding / Past EXPOs */}
          <Link
            to="/events/expo"
            className="smsc-pill-btn text-center w-full"
            style={{ borderRadius: '0.75rem', padding: '1rem 1.2rem' }}
          >
            <span className="block font-bold text-sm leading-snug">Festival of Model Shipbuilding</span>
            <span className="block text-sm">Past EXPOs</span>
          </Link>

          {/* 2014 — Kids Making Models — YouTube */}
          <a
            href="https://youtu.be/gVjeEbTBzCc"
            target="_blank"
            rel="noreferrer"
            className="smsc-pill-btn text-center w-full"
            style={{ borderRadius: '0.75rem', padding: '1rem 1.2rem' }}
          >
            <span className="block font-bold text-sm leading-snug">2014 - Kids Making Models</span>
          </a>

          {/* 2017 — 4 Villages Walk — placeholder */}
          <a
            href="#"
            className="smsc-pill-btn text-center w-full"
            style={{ borderRadius: '0.75rem', padding: '1rem 1.2rem' }}
          >
            <span className="block font-bold text-sm leading-snug">2017 - 4 Villages Walk</span>
          </a>

        </div>

      </div>
    </section>
  )
}
