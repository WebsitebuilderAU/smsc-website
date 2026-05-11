import banner from '../assets/img/smsc_header_ships.jpg'

/**
 * T1 Landing hero — matches Anelia's diagram.
 * Navy wordmark band → SMSC header banner (logo + ships on navy field) →
 * navy wordmark band. The logo is part of the banner image itself,
 * so we do NOT add a separate logo card.
 */
export default function HeroCollage() {
  return (
    <section className="relative">
      {/* Top wordmark band */}
      <div className="bg-navy-800 text-white text-center font-display border-b-2 border-brass-500">
        <div className="max-w-7xl mx-auto px-4 py-2 text-sm md:text-base font-semibold uppercase tracking-widest">
          Sydney Model Shipbuilders Club
        </div>
      </div>

      {/* Banner image — sits flush, full width, no cropping */}
      <div className="bg-[#1f5388]">
        <img
          src={banner}
          alt="Sydney Model Shipbuilders Club"
          className="block w-full h-auto"
        />
      </div>

      {/* Bottom wordmark band */}
      <div className="bg-navy-800 text-white text-center font-display border-t-2 border-brass-500">
        <div className="max-w-7xl mx-auto px-4 py-2 text-sm md:text-base font-semibold uppercase tracking-widest">
          Sydney Model Shipbuilders Club
        </div>
      </div>
    </section>
  )
}
