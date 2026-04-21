import { Link } from 'react-router-dom'
import { galleryStub } from '../data/galleryStub.js'

export default function Home() {
  const featured = galleryStub.filter(g => g.featured).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy-800 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900/80 to-navy-700/40" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534577375088-3d03bc5dd1cc?w=2000')" }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-display font-bold max-w-3xl leading-tight">
            The craft of model shipbuilding, alive and well in Sydney.
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl text-navy-100">
            Founded in 1972, the Sydney Model Shipbuilders Club brings together
            enthusiasts who build, restore, research and share the world's most
            remarkable vessels — in miniature.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/gallery"
              className="bg-brass-500 hover:bg-brass-600 text-navy-900 font-semibold px-6 py-3 rounded shadow"
            >
              Browse the gallery
            </Link>
            <Link
              to="/membership"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded border border-white/30"
            >
              Join the club
            </Link>
          </div>
        </div>
      </section>

      {/* Featured builds */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-display font-bold text-navy-900">Featured builds</h2>
            <p className="text-navy-600 mt-1">A glimpse of our members' work.</p>
          </div>
          <Link to="/gallery" className="text-brass-600 font-semibold hover:underline">
            View full gallery →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featured.map(item => (
            <article key={item.id} className="bg-white rounded-lg shadow overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden bg-navy-100">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-xl text-navy-900">{item.title}</h3>
                <p className="text-sm text-navy-500 mt-1">
                  {item.ship_type} · {item.year}
                </p>
                <p className="text-navy-700 text-sm mt-3 line-clamp-2">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Meetings / about strip */}
      <section className="bg-navy-100 py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-navy-900">Meetings &amp; Events</h2>
            <p className="mt-4 text-navy-700 leading-relaxed">
              We meet on the first Wednesday of every month at our clubrooms in Vaucluse.
              Members bring current builds to share, discuss techniques, and plan upcoming
              EXPOs. Visitors and prospective members are always welcome.
            </p>
            <Link to="/events" className="inline-block mt-6 text-brass-600 font-semibold hover:underline">
              See upcoming events →
            </Link>
          </div>
          <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="font-display text-2xl font-bold text-navy-900">Next meeting</h3>
            <p className="mt-2 text-navy-600">First Wednesday, 7:30 PM</p>
            <p className="mt-1 text-navy-600">38 Towns Rd, Vaucluse NSW 2030</p>
            <p className="mt-4 text-sm text-navy-500">
              (Real events feed will appear here once the admin panel goes live.)
            </p>
          </div>
        </div>
      </section>

      {/* Chatterbox CTA */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-display font-bold text-navy-900">The Chatterbox newsletter</h2>
        <p className="mt-3 text-navy-700 max-w-2xl mx-auto">
          Our quarterly newsletter has documented the club's builds, projects and EXPOs
          for over 30 years. Browse the full searchable archive.
        </p>
        <Link
          to="/chatterbox"
          className="inline-block mt-6 bg-navy-800 hover:bg-navy-700 text-white font-semibold px-6 py-3 rounded"
        >
          Open the archive
        </Link>
      </section>
    </>
  )
}
