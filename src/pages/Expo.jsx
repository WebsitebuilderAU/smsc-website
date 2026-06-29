import { Link } from 'react-router-dom'

/**
 * Festival Of Model Shipbuilding — EXPO index page.
 * Per Anelia's PDF page 5: left column stacks year pill buttons,
 * 2025 + 2024 have poster thumbnails beside them, right column
 * continues years 2018 down to 2013.
 */

// Years with optional poster image paths
const EXPO_YEARS = [
  { year: 2026, upcoming: true,  poster: '/images/anelia-28jun/6.5MB_EXPO_2026_Festival__Poster_31st_Oct_1st_Nov___copy.jpeg' },
  { year: 2025, poster: null },
  { year: 2024, poster: null },
  { year: 2023, poster: null },
  { year: 2022, poster: null },
  { year: 2019, poster: null },
  { year: 2018, poster: null },
  { year: 2017, poster: null },
  { year: 2016, poster: null },
  { year: 2015, poster: null },
  { year: 2014, poster: null },
  { year: 2013, poster: null },
]

function YearPill({ year, upcoming }) {
  return (
    <Link
      to={`/events/expo/${year}`}
      className={`smsc-pill-btn block text-center w-36 py-2${upcoming ? ' smsc-pill-btn--upcoming' : ''}`}
      style={upcoming ? { background: '#0b1f31', color: '#e6b800', borderColor: '#e6b800' } : {}}
    >
      <span className="font-bold text-base">{year}</span>
      {upcoming && <span className="block text-xs font-normal opacity-80">Upcoming</span>}
    </Link>
  )
}

export default function Expo() {
  // Split into two columns per PDF layout
  const leftYears  = EXPO_YEARS.slice(0, 6)   // 2026 2025 2024 2023 2022 2019
  const rightYears = EXPO_YEARS.slice(6)       // 2018 2017 2016 2015 2014 2013

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">

      {/* EXPO Video pill — top left per PDF */}
      <div className="mb-8">
        <a
          href="https://youtu.be/gVjeEbTBzCc"
          target="_blank"
          rel="noreferrer"
          className="smsc-pill-btn"
        >
          EXPO Video
        </a>
      </div>

      {/* Two-column year grid — matches PDF page 5 layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-4">

        {/* Left column */}
        <div className="space-y-4">
          {leftYears.map(({ year, upcoming, poster }) => (
            <div key={year} className="flex items-start gap-4">
              <YearPill year={year} upcoming={upcoming} />
              {/* Poster thumbnail — only shown when poster is available */}
              {poster && (
                <Link to={`/events/expo/${year}`} className="shrink-0">
                  <img
                    src={poster}
                    alt={`EXPO ${year} poster`}
                    className="h-28 w-auto object-cover rounded border border-navy-200 shadow-sm hover:shadow-md transition"
                    loading="lazy"
                  />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-4 sm:mt-0 mt-2">
          {rightYears.map(({ year }) => (
            <YearPill key={year} year={year} />
          ))}
        </div>

      </div>

      {/* Venue note — from PDF */}
      <div className="mt-10 p-4 border border-navy-200 rounded bg-white text-sm text-navy-700 leading-relaxed">
        <p className="font-bold text-navy-900 mb-1">Hosted by Sydney Model Shipbuilders Club</p>
        <p>Wests Ashfield Leagues Club</p>
        <p>115 Liverpool Road, Ashfield NSW 2131</p>
      </div>

    </section>
  )
}
