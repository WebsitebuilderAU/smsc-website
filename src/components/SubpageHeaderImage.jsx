/**
 * Sub-page header image strip — sits between the top wordmark banner
 * and the page content, per Anelia's T3 layout.
 *
 * Accepts an `image` URL. Falls back to a neutral placeholder if none supplied.
 */
export default function SubpageHeaderImage({ label, image }) {
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
        {label && (
          <div className="relative max-w-7xl mx-auto px-4 py-12 flex items-end h-full" style={{ minHeight: '200px' }}>
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
      className="bg-navy-100 border-y border-navy-200 flex items-center justify-center"
      style={{ minHeight: '180px' }}
      aria-hidden="true"
    >
      <div className="text-center px-4 py-12 text-navy-400 text-xs uppercase tracking-widest">
        {label || 'Header image — to be supplied'}
      </div>
    </div>
  )
}
