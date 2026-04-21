import { Link } from 'react-router-dom'

/**
 * Gallery tile — matches Anelia's T1 diagram:
 *   "Live Images of models — click image, takes you to info about that model."
 * When an image_url is present it shows the photo; otherwise it renders a
 * neutral navy/brass placeholder (no stock imagery) so the layout is usable
 * before the club uploads their archive.
 */
export default function ShipTile({ item }) {
  return (
    <Link
      to={`/gallery/${item.id}`}
      className="group relative block bg-white rounded shadow-sm overflow-hidden
                 border border-navy-200 hover:shadow-md hover:-translate-y-0.5 transition"
    >
      <div className="aspect-[4/3] bg-navy-800 relative overflow-hidden">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center
                          bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900
                          text-center p-4">
            <svg viewBox="0 0 64 64" className="w-12 h-12 text-brass-500 mb-2" fill="currentColor" aria-hidden>
              <path d="M32 6l4 10h-8l4-10zM10 30h44l-4 14a6 6 0 01-6 4H20a6 6 0 01-6-4l-4-14zm22 2v18M6 52c4 2 8 2 13 0s9-2 13 0 9 2 13 0 9-2 13 0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
            <span className="text-brass-400 font-display text-xs uppercase tracking-widest">
              Photo coming soon
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display font-bold text-navy-900 leading-snug">
          {item.title}
        </h3>
        <p className="text-xs text-navy-500 mt-1">
          {item.ship_type}{item.year ? ` · ${item.year}` : ''}{item.builder && item.builder !== '—' ? ` · ${item.builder}` : ''}
        </p>
      </div>
    </Link>
  )
}
