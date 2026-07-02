import { useParams, Link } from 'react-router-dom'

/**
 * Individual EXPO year page — placeholder layout.
 * Shows the year, a coming-soon message, and links back to the EXPO index.
 * Content will be populated by the club when posters/photos are supplied.
 */

// Known EXPO poster images — keyed by year
const POSTERS = {
  2026: './images/anelia-28jun/6.5MB_EXPO_2026_Festival__Poster_31st_Oct_1st_Nov___copy.jpeg',
}

export default function ExpoYear() {
  const { year } = useParams()
  const poster = POSTERS[year]

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold text-navy-900 mb-2">
        EXPO {year}
      </h1>

      {poster ? (
        <div className="mb-8">
          <img
            src={poster}
            alt={`EXPO ${year} poster`}
            className="max-w-sm w-full rounded shadow-md border border-navy-200"
            loading="eager"
          />
        </div>
      ) : (
        <div className="mb-8 p-6 bg-navy-50 border border-navy-200 rounded text-center text-navy-600">
          <p className="font-semibold text-lg">More details coming soon.</p>
          <p className="mt-1 text-sm">Photos and programme for EXPO {year} will appear here.</p>
        </div>
      )}

      {year === '2026' && (
        <div className="mb-8 p-5 border-2 border-red-600 rounded-lg bg-white text-navy-800 space-y-1 text-sm">
          <p className="font-bold text-base text-navy-900">EXPO 2026 — Save the Dates</p>
          <p>Saturday 31 October 2026 — 10:00am – 8:00pm</p>
          <p>Sunday 1 November 2026 — 10:00am – 4:00pm</p>
          <p className="mt-2">Wests Ashfield Leagues Club, 115 Liverpool Road, Ashfield NSW 2131</p>
          <p className="mt-2 font-semibold text-green-700">FREE ENTRY — Fun for the whole family</p>
          <p>Enquiries: Michael Bennett mob: 0411 545 770</p>
        </div>
      )}

      <Link to="/events/expo" className="smsc-pill-btn inline-flex">
        ← Back to all EXPOs
      </Link>
    </section>
  )
}
