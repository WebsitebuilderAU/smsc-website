import { Link } from 'react-router-dom'
import logoImg       from '../assets/img/smsc_logo_real.png'
import meetingsImg   from '../assets/img/smsc_header_ships.jpg'
import galleryImg    from '../assets/img/ship_three_masted.jpg'
import chatterboxImg from '../assets/img/smsc_chatterbox_masthead.png'

/**
 * T1 Quick Tiles row — per Anelia's diagram.
 * Four navy tiles under the hero linking to the four T2 sections.
 * Each tile shows real imagery matching the section.
 */
const tiles = [
  { to: '/about',      label1: 'The Club',     img: logoImg,        kind: 'logo'  },
  { to: '/meetings',   label1: 'Calendar',     label2: 'Meetings / Events',     img: meetingsImg,   kind: 'photo' },
  { to: '/gallery',    label1: 'Gallery',      label2: 'Modelmakers / Models',  img: galleryImg,    kind: 'photo' },
  { to: '/chatterbox', label1: 'Newsletter',   label2: 'Chatterbox',            img: chatterboxImg, kind: 'logo'  },
]

export default function QuickTiles() {
  return (
    <section className="bg-navy-50 py-6 border-b border-navy-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {tiles.map(t => (
            <Link
              key={t.to}
              to={t.to}
              className="group relative overflow-hidden rounded shadow-sm
                         border-2 border-brass-500
                         bg-navy-800 text-white
                         flex flex-col transition hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Cover */}
              <div className={`relative w-full aspect-[4/3] overflow-hidden ${t.kind === 'logo' ? 'bg-white' : 'bg-navy-700'}`}>
                <img
                  src={t.img}
                  alt=""
                  className={`absolute inset-0 w-full h-full transition duration-500 group-hover:scale-105
                              ${t.kind === 'logo' ? 'object-contain p-4' : 'object-cover'}`}
                  loading="lazy"
                />
              </div>
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
