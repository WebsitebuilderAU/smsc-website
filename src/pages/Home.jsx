import { Link } from 'react-router-dom'

// Home page — matches Anelia's mockup exactly.
//  - Full-width collage image (cropped to remove top blue strip)
//  - Clickable hotspots over the four bottom cards + big ship mast for gallery
//  - Five red-outlined rectangular pill cards with square thumbnails below (tight to collage)

// Rectangular pill cards — exact labels from Anelia's mockup
const PILLS = [
  {
    to: '/about',
    thumb: './images/smsc_logo.png',
    line1: 'The Club',
    line2: 'About / Membership',
    alt: 'SMSC logo',
  },
  {
    to: '/meetings',
    thumb: './images/hero_ship_2.png',
    line1: 'Calendar',
    line2: 'Meetings',
    alt: 'Model ship',
  },
  {
    to: '/events/expo',
    thumb: './images/anelia-28jun/6.5MB_EXPO_2026_Festival__Poster_31st_Oct_1st_Nov___copy.jpeg',
    line1: 'Events',
    line2: 'Annual Festival EXPO',
    alt: 'EXPO poster',
  },
  {
    to: '/gallery',
    thumb: './images/hero_ship_1.png',
    line1: 'Gallery',
    line2: 'Modelmakers Models',
    alt: 'Model ship',
  },
  {
    to: '/chatterbox',
    thumb: './images/smsc_chatterbox_masthead.png',
    line1: 'Newsletter',
    line2: 'Chatterbox',
    alt: 'Chatterbox masthead',
  },
]

// Clickable hotspots over the collage. Coordinates are percent of the collage image
// (2000x746 after cropping the top blue strip).
const HOTSPOTS = [
  { to: '/about',      left: '4.2%',  top: '50.9%', width: '11.6%', height: '45.6%', label: 'The Club — About' },
  { to: '/about',      left: '17.2%', top: '57.6%', width: '11.5%', height: '36.2%', label: 'Club members' },
  { to: '/events/expo',left: '30.2%', top: '57.6%', width: '11.3%', height: '38.9%', label: 'EXPO 2026 flyer' },
  { to: '/gallery',    left: '42.5%', top: '38.9%', width: '16.5%', height: '57.6%', label: 'Model ship gallery' },
  { to: '/chatterbox', left: '60.5%', top: '57.6%', width: '11.3%', height: '38.9%', label: 'Chatterbox newsletter' },
  // Big top ship area — link to gallery
  { to: '/gallery',    left: '0%',    top: '0%',    width: '100%',  height: '38%',  label: 'Model ships gallery' },
]

export default function Home() {
  return (
    <div className="smsc-home">
      {/* Full-width collage with clickable hotspots over cards and ship gallery */}
      <section className="smsc-home__collage-wrap" aria-label="Model ships and club highlights">
        <div className="smsc-home__collage-inner">
          <img
            src="./images/anelia_home_collage_v2.jpg"
            alt="Sydney Model Shipbuilders Club — member ships, EXPO 2026 flyer, Chatterbox newsletter, club members"
            className="smsc-home__collage-img"
          />
          {HOTSPOTS.map((h, i) => (
            <Link
              key={i}
              to={h.to}
              aria-label={h.label}
              className="smsc-home__hotspot"
              style={{ left: h.left, top: h.top, width: h.width, height: h.height }}
            />
          ))}
        </div>
      </section>

      {/* Rectangular red-outlined pill cards with square thumbnails — sit tight to collage */}
      <section className="smsc-home__pills" aria-label="Explore the club">
        <div className="smsc-home__pills-grid">
          {PILLS.map((pill) => (
            <Link key={pill.to} to={pill.to} className="smsc-home__pill">
              <span className="smsc-home__pill-thumb">
                <img src={pill.thumb} alt={pill.alt} loading="lazy" />
              </span>
              <span className="smsc-home__pill-label">
                <span className="smsc-home__pill-line-1">{pill.line1}</span>
                <span className="smsc-home__pill-line-2">{pill.line2}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
