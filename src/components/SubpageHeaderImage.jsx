/**
 * Sub-page header image strip — sits between the top wordmark banner
 * and the page content, per Anelia's T3 layout (each sub-page has a banded
 * image strip at the top showing context for that page).
 *
 * Empty slot until the Club supplies the artwork.
 */
export default function SubpageHeaderImage({ label }) {
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
