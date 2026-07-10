import { Link } from 'react-router-dom'

// Home page — matches Anelia's 28 Jun InDesign brief (v14).
//  - Cream body with cutout ship collage image
//  - Clickable hotspots over the five feature tiles + big ship mast
//  - NO pill row here — that lives in App.jsx BottomBand (single row on cream)

// Clickable hotspots over the collage. Coordinates are percent of the collage image.
// Per Anelia's 7 Jul markup: blue thumbnails must link to the SAME place as the red
// buttons below them — image + text act as one button.
//   The Club → /about, Calendar → /meetings, Events → /events (NOT /events/expo),
//   Gallery → /gallery, Newsletter → /chatterbox.
const HOTSPOTS = [
  { to: '/about',      left: '4.2%',  top: '50.9%', width: '11.6%', height: '45.6%', label: 'The Club — About / Membership' },
  { to: '/meetings',   left: '17.2%', top: '57.6%', width: '11.5%', height: '36.2%', label: 'Calendar — Meetings' },
  { to: '/events',     left: '30.2%', top: '57.6%', width: '11.3%', height: '38.9%', label: 'Events — Annual Festival EXPO' },
  { to: '/gallery',    left: '42.5%', top: '38.9%', width: '16.5%', height: '57.6%', label: 'Gallery — Modelmakers Models' },
  { to: '/chatterbox', left: '60.5%', top: '57.6%', width: '11.3%', height: '38.9%', label: 'Newsletter — Chatterbox' },
  // Big top ship area — link to gallery
  { to: '/gallery',    left: '0%',    top: '0%',    width: '100%',  height: '38%',  label: 'Model ships gallery' },
]

export default function Home() {
  return (
    <div className="smsc-home">
      {/* Full-width cutout ship collage on cream background with clickable hotspots */}
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
    </div>
  )
}
