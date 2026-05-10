/**
 * T1 Landing hero — per Anelia's diagram.
 * A collage-style image runs across the page with the navy wordmark
 * banner banding the top AND bottom of the image itself (not the page).
 * Empty image slot until the Club supplies the artwork.
 */
export default function HeroCollage() {
  return (
    <section className="relative">
      {/* Top wordmark band fused to the image top */}
      <div className="bg-navy-800 text-white text-center font-display border-b-2 border-brass-500">
        <div className="max-w-7xl mx-auto px-4 py-2 text-sm md:text-base font-semibold uppercase tracking-widest">
          Sydney Model Shipbuilders Club
        </div>
      </div>

      {/* Hero image slot — empty until the Club supplies the collage */}
      <div
        className="bg-navy-100 flex items-center justify-center border-y border-navy-200"
        style={{ minHeight: '320px', aspectRatio: '1920 / 600' }}
        aria-hidden="true"
      >
        <p className="text-navy-400 text-xs uppercase tracking-widest text-center px-4">
          Hero collage image — to be supplied
        </p>
      </div>

      {/* Bottom wordmark band fused to the image bottom */}
      <div className="bg-navy-800 text-white text-center font-display border-t-2 border-brass-500">
        <div className="max-w-7xl mx-auto px-4 py-2 text-sm md:text-base font-semibold uppercase tracking-widest">
          Sydney Model Shipbuilders Club
        </div>
      </div>
    </section>
  )
}
