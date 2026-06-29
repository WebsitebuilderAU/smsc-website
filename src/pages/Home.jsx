import { Link } from 'react-router-dom'

// All ship images used in the home collage
const COLLAGE_IMAGES = [
  { src: '/images/anelia-28jun/IMG_6436.jpeg',   alt: 'Club model ship' },
  { src: '/images/anelia-28jun/IMG_7369.jpeg',   alt: 'Club meeting with models' },
  { src: '/images/anelia-28jun/IMG_7518.jpeg',   alt: 'Members working on models' },
  { src: '/images/anelia-28jun/IMG_8005.jpeg',   alt: 'Detailed model ship hull' },
  { src: '/images/anelia-28jun/IMG_8784.jpeg',   alt: 'Models on display' },
  { src: '/images/anelia-28jun/IMG_0059_copy.jpeg', alt: 'Model ship close-up' },
  { src: '/images/anelia-28jun/IMG_1327.jpeg',   alt: 'EXPO display hall' },
  { src: '/images/anelia-28jun/Images_on_Brochure_for_Info_Page_.jpeg', alt: 'Brochure models' },
  { src: '/images/anelia-28jun/Club_Info_Page_Photo_Compilation.jpeg', alt: 'Club info photos' },
  { src: '/images/ship_gilded_stern.jpg',          alt: 'Gilded stern model' },
  { src: '/images/ship_three_masted.jpg',          alt: 'Three-masted sailing ship model' },
  { src: '/images/smsc_harbour_banner.jpg',        alt: 'SMSC harbour banner' },
]

// 5 home tiles — matching Anelia's PDF T1 tiles with thumbnail + two-line label
const HOME_TILES = [
  {
    to: '/about',
    thumb: '/images/smsc_logo.png',
    line1: 'The Club',
    line2: 'About / Membership',
  },
  {
    to: '/meetings',
    thumb: '/images/anelia-28jun/IMG_7369.jpeg',
    line1: 'Calendar',
    line2: 'Meetings',
  },
  {
    to: '/events',
    thumb: '/images/anelia-28jun/6.5MB_EXPO_2026_Festival__Poster_31st_Oct_1st_Nov___copy.jpeg',
    line1: 'Events',
    line2: 'Annual Festival EXPO',
  },
  {
    to: '/gallery',
    thumb: '/images/anelia-28jun/IMG_8005.jpeg',
    line1: 'Gallery',
    line2: 'Modelmakers Models',
  },
  {
    to: '/chatterbox',
    thumb: '/images/smsc_chatterbox_masthead.png',
    line1: 'Newsletter',
    line2: 'Chatterbox',
  },
]

export default function Home() {
  return (
    <>
      {/* Hero collage — freeform CSS grid, no white gaps */}
      <section className="home-collage" aria-label="Model ship photo collage">
        {COLLAGE_IMAGES.map((img, i) => (
          <div key={i} className={`home-collage__cell home-collage__cell--${i + 1}`}>
            <img
              src={img.src}
              alt={img.alt}
              loading={i < 4 ? 'eager' : 'lazy'}
              className="w-full h-full object-cover block"
            />
          </div>
        ))}
      </section>

      {/* 5 large red-bordered pill tiles — mirror of bottom nav but bigger */}
      <section
        className="py-6 px-4"
        style={{ background: '#f8f6f0' }}
        aria-label="Site sections"
      >
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {HOME_TILES.map(tile => (
            <Link
              key={tile.to}
              to={tile.to}
              className="home-tile"
              aria-label={`${tile.line1} — ${tile.line2}`}
            >
              <img
                src={tile.thumb}
                alt=""
                className="home-tile__thumb"
                loading="lazy"
              />
              <span className="home-tile__label">
                <span className="block font-bold">{tile.line1}</span>
                <span className="block font-semibold">{tile.line2}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
