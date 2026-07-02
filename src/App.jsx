import { Outlet, Link, useLocation } from 'react-router-dom'

// Bottom nav pill definitions — per Anelia's PDF bottom band
const NAV_PILLS = [
  { to: '/about',       line1: 'The Club',    line2: 'About / Membership' },
  { to: '/meetings',    line1: 'Calendar',    line2: 'Meetings' },
  { to: '/events',      line1: 'Events',      line2: 'Annual Festival EXPO' },
  { to: '/gallery',     line1: 'Gallery',     line2: 'Modelmakers Models' },
  { to: '/chatterbox',  line1: 'Newsletter',  line2: 'Chatterbox' },
]

// Gold wordmark — single line (per Andrew's direction)
function GoldWordmark() {
  return (
    <div className="text-center leading-none select-none" aria-label="Sydney Model Shipbuilders Club">
      <div className="smsc-wordmark">SYDNEY MODEL SHIPBUILDERS CLUB</div>
    </div>
  )
}

// The full top chrome band — www pill + gold wordmark + SMSC logos in corners
function TopBand({ subtitle }) {
  return (
    <div
      className="w-full relative"
      style={{ background: '#253f8e' }}
    >
      {/* SMSC logo — top left (hidden on mobile) */}
      <div className="hidden sm:block absolute left-3 top-1/2 -translate-y-1/2 z-10 smsc-logo-badge">
        <img
          src="./images/smsc_logo.png"
          alt="SMSC logo"
          className="h-16 md:h-20 w-auto"
          loading="eager"
        />
      </div>

      {/* SMSC logo — top right (hidden on mobile) */}
      <div className="hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 z-10 smsc-logo-badge">
        <img
          src="./images/smsc_logo.png"
          alt="SMSC logo"
          className="h-16 md:h-20 w-auto"
          loading="eager"
        />
      </div>

      {/* Centre content: www pill + wordmark + subtitle */}
      <div className="flex flex-col items-center px-3 sm:px-28 pt-4 pb-4">
        {/* www.smsc.org.au pill */}
        <Link
          to="/"
          className="smsc-www-pill"
          aria-label="Home — www.smsc.org.au"
        >
          www.smsc.org.au
        </Link>

        {/* Double-line gold wordmark */}
        <GoldWordmark />

        {/* Page subtitle — blank on home */}
        {subtitle && (
          <p className="text-white text-center font-semibold text-lg md:text-xl mt-1 mb-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )
}

// Bottom band — Anelia's brief page 1 layout:
//   1. Cream strip: 5 red-outlined text-only pills + "Email Us: info@smsc.org.au" to the right
//   2. Navy strip: gold Cinzel wordmark centred
function BottomBand() {
  const { hash } = useLocation()
  const activePath = hash.replace('#', '') || '/'

  return (
    <>
      {/* Cream strip with pills + email (matches Anelia's PDF exactly) */}
      <div className="smsc-bottom-pill-row">
        <div className="smsc-bottom-pill-row__inner">
          <div className="smsc-bottom-pill-row__pills">
            {NAV_PILLS.map(p => {
              const isActive = activePath === p.to || activePath.startsWith(p.to + '/')
              return (
                <Link
                  key={p.to}
                  to={p.to}
                  className={`smsc-nav-pill${isActive ? ' smsc-nav-pill--active' : ''}`}
                >
                  <span className="block text-center leading-tight">
                    <span className="block">{p.line1}</span>
                    <span className="block">{p.line2}</span>
                  </span>
                </Link>
              )
            })}
          </div>

          <div className="smsc-bottom-pill-row__email">
            <span className="font-semibold">Email Us: </span>
            <a
              href="mailto:info@smsc.org.au"
              className="smsc-bottom-pill-row__email-link"
            >
              info@smsc.org.au
            </a>
          </div>
        </div>
      </div>

      {/* Navy strip with gold wordmark centred */}
      <div className="smsc-bottom-wordmark" style={{ background: '#253f8e' }}>
        <div className="flex justify-center py-2 px-3">
          <GoldWordmark />
        </div>
      </div>
    </>
  )
}

// Page-level subtitle map — keyed by route path prefix
const PAGE_SUBTITLES = {
  '/about':      'About The Club and Membership',
  '/meetings':   'Calendar - SMSC has Monthly Meetings',
  '/events':     'Events',
  '/gallery':    'Modelmakers Models',
  '/chatterbox': 'Newsletter - Chatterbox',
  '/events/expo': 'Festival Of Model Shipbuilding - EXPO',
}

function useSubtitle() {
  const { hash } = useLocation()
  const path = hash.replace('#', '') || '/'
  // Longest matching prefix wins
  const match = Object.keys(PAGE_SUBTITLES)
    .filter(k => path === k || path.startsWith(k + '/'))
    .sort((a, b) => b.length - a.length)[0]
  return match ? PAGE_SUBTITLES[match] : ''
}

export default function App() {
  const subtitle = useSubtitle()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8f6f0' }}>
      {/* Top chrome band */}
      <TopBand subtitle={subtitle} />

      {/* Page content — main fills remaining viewport height. Home stretches its collage
         to fill this space (Option A); other pages ride on their own cream background. */}
      <main className="flex flex-col flex-1 min-h-0">
        <Outlet />
      </main>

      {/* Bottom chrome band */}
      <BottomBand />
    </div>
  )
}
