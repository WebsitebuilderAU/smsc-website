import { Link, useLocation } from 'react-router-dom'

/**
 * Sub-page header image strip — sits between the top wordmark banner
 * and the page content, per Anelia's T3 layout.
 *
 * Every sub-page now carries a "← Home" ring/button in the top-left of the
 * header strip so members can always jump back to the landing page,
 * per Anelia's 6 June revision.
 */
export default function SubpageHeaderImage({ label, image }) {
  const { pathname } = useLocation()
  const showHome = pathname !== '/'

  const HomeButton = () => (
    showHome ? (
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-white text-xs md:text-sm font-semibold
                   px-3 py-1.5 rounded-full border border-white/80 hover:border-white
                   bg-navy-900/40 hover:bg-navy-900/60 backdrop-blur-sm transition
                   focus:outline-none focus:ring-2 focus:ring-brass-500 focus:ring-offset-1"
        aria-label="Back to Home"
      >
        <span aria-hidden="true">←</span> Home
      </Link>
    ) : null
  )

  if (image) {
    return (
      <div
        className="relative bg-navy-900 border-y border-navy-200 overflow-hidden"
        style={{ minHeight: '200px' }}
      >
        <img
          src={image}
          alt={label || ''}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/20 to-transparent" />

        {/* Home button — top-left */}
        <div className="relative max-w-7xl mx-auto px-4 pt-4">
          <HomeButton />
        </div>

        {label && (
          <div className="relative max-w-7xl mx-auto px-4 pb-12 pt-6 flex items-end" style={{ minHeight: '140px' }}>
            <span className="font-display text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              {label}
            </span>
          </div>
        )}
      </div>
    )
  }
  return (
    <div
      className="bg-navy-100 border-y border-navy-200"
      style={{ minHeight: '180px' }}
    >
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-navy-800 text-xs md:text-sm font-semibold
                     px-3 py-1.5 rounded-full border border-navy-800 hover:bg-navy-800 hover:text-white transition"
          aria-label="Back to Home"
        >
          <span aria-hidden="true">←</span> Home
        </Link>
      </div>
      <div className="text-center px-4 py-10 text-navy-400 text-xs uppercase tracking-widest">
        {label || 'Header image — to be supplied'}
      </div>
    </div>
  )
}
