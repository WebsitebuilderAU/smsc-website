import logoImg  from '../assets/img/smsc_logo_real.png'
import shipA    from '../assets/img/ship_three_masted.jpg'
import shipB    from '../assets/img/ship_gilded_stern.jpg'
import workshop from '../assets/img/smsc_header_ships.jpg'

/**
 * T1 Landing hero — per Anelia's diagram.
 * A photo collage running across the page with the navy wordmark
 * banner banding the top AND bottom of the image itself.
 *
 * Built as a CSS collage rather than a single baked image so it stays
 * crisp at every viewport and individual photos can be swapped easily.
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

      {/* Hero collage */}
      <div className="relative bg-navy-800 overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-3 md:grid-cols-12">
          {/* Left: workshop / two ships */}
          <div className="col-span-1 md:col-span-5 relative">
            <img src={workshop} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          {/* Middle: three-masted */}
          <div className="col-span-1 md:col-span-4 relative border-x-2 border-navy-800">
            <img src={shipA} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          {/* Right: gilded stern */}
          <div className="col-span-1 md:col-span-3 relative">
            <img src={shipB} alt="" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>

        {/* Logo + tagline overlay */}
        <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-14 flex flex-col md:flex-row items-center md:items-stretch gap-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg border-2 border-brass-500 p-4 md:p-5 shadow-lg flex items-center">
            <img src={logoImg} alt="Sydney Model Shipbuilders Club" className="h-24 md:h-32 w-auto" />
          </div>
          <div className="flex-1 flex items-center">
            <div className="bg-navy-900/85 backdrop-blur-sm rounded-lg px-6 py-5 text-white max-w-xl">
              <p className="font-display text-lg md:text-2xl leading-tight">
                A place where people can meet and share their passion for model ships.
              </p>
              <p className="mt-2 text-sm md:text-base text-brass-200">
                Learn new techniques and see the results of dedicated time and patience.
              </p>
            </div>
          </div>
        </div>
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
