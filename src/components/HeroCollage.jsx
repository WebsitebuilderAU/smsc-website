import banner from '../assets/img/smsc_ships_only.jpg'
import logo   from '../assets/img/smsc_logo_real.png'

/**
 * T1 Landing hero — matches Anelia's diagram.
 * Navy wordmark band → composite banner (SMSC logo + ships on navy field) →
 * navy wordmark band. The logo lives ONLY here; tiles below stay logo-free.
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

      {/* Composite banner — SMSC logo (left) + ships (right) on the same navy field */}
      <div className="bg-[#1f5388]">
        <div className="flex items-center">
          {/* Logo panel — white so navy/red logo reads with full contrast */}
          <div className="flex-shrink-0 w-1/3 sm:w-1/4 md:w-1/5 bg-white py-4 md:py-6 flex items-center justify-center border-r-2 border-brass-500">
            <img
              src={logo}
              alt="Sydney Model Shipbuilders Club logo"
              className="block w-full h-auto max-w-[200px] px-3"
            />
          </div>
          {/* Ships panel */}
          <div className="flex-1">
            <img
              src={banner}
              alt="Members' model ships"
              className="block w-full h-auto"
            />
          </div>
        </div>
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
