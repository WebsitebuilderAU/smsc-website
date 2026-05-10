import { Link } from 'react-router-dom'

/**
 * T1 Quick Tiles row — per Anelia's diagram.
 * Four navy icon tiles under the hero linking to the four T2 sections:
 *   1. The Club              → /about
 *   2. Calendar / Meetings   → /meetings  (also Events on Anelia's combined tile)
 *   3. Gallery / Modelmakers → /gallery
 *   4. Newsletter Chatterbox → /chatterbox
 * Icons themselves are placeholders until the Club supplies artwork.
 */
const tiles = [
  { to: '/about',      label1: 'The Club' },
  { to: '/meetings',   label1: 'Calendar', label2: 'Meetings / Events' },
  { to: '/gallery',    label1: 'Gallery',  label2: 'Modelmakers / Models' },
  { to: '/chatterbox', label1: 'Newsletter', label2: 'Chatterbox' },
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
              className="group bg-navy-800 hover:bg-navy-700 text-white rounded shadow-sm
                         flex flex-col items-center justify-center text-center
                         px-3 py-5 md:py-6 border-2 border-brass-500
                         transition"
            >
              <div
                className="w-12 h-12 md:w-14 md:h-14 mb-2 rounded
                           bg-navy-700 border border-brass-400/60
                           flex items-center justify-center text-brass-300 text-[10px] uppercase tracking-widest"
                aria-hidden="true"
              >
                icon
              </div>
              <p className="font-display font-bold text-sm md:text-base leading-tight">
                {t.label1}
              </p>
              {t.label2 && (
                <p className="text-[11px] md:text-xs text-brass-300 mt-1 leading-tight">
                  {t.label2}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
