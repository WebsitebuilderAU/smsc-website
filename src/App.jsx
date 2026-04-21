import { Outlet, NavLink, Link } from 'react-router-dom'

const nav = [
  { to: '/',             label: 'Home' },
  { to: '/about',        label: 'About' },
  { to: '/gallery',      label: 'Gallery' },
  { to: '/events',       label: 'Events' },
  { to: '/chatterbox',   label: 'Chatterbox' },
  { to: '/membership',   label: 'Membership' },
  { to: '/contact',      label: 'Contact' },
]

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-navy-800 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="font-display text-xl md:text-2xl font-bold leading-tight">
              Sydney Model Shipbuilders Club
            </span>
          </Link>
          <nav className="hidden md:flex gap-1">
            {nav.map(n => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({isActive}) =>
                  `px-3 py-2 rounded text-sm font-medium transition ${
                    isActive ? 'bg-brass-500 text-navy-900' : 'hover:bg-navy-700 text-navy-100'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <nav className="md:hidden border-t border-navy-700 px-2 py-2 overflow-x-auto flex gap-1 text-sm">
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({isActive}) =>
                `whitespace-nowrap px-3 py-1 rounded ${
                  isActive ? 'bg-brass-500 text-navy-900' : 'text-navy-100'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-navy-900 text-navy-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-white text-lg font-display mb-3">Sydney Model Shipbuilders Club</h4>
            <p className="text-sm leading-relaxed">
              Meeting monthly in Vaucluse, NSW. Welcoming builders of historic and
              contemporary model ships since 1972.
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg font-display mb-3">Find us</h4>
            <p className="text-sm">
              38 Towns Rd, Vaucluse NSW 2030<br />
              Meetings: first Wednesday of each month
            </p>
          </div>
          <div>
            <h4 className="text-white text-lg font-display mb-3">Contact</h4>
            <p className="text-sm">
              <a className="hover:text-brass-500" href="mailto:info@smsc.org.au">info@smsc.org.au</a>
            </p>
          </div>
        </div>
        <div className="border-t border-navy-800 text-xs text-center py-4 text-navy-400">
          © {new Date().getFullYear()} Sydney Model Shipbuilders Club ·
          Site by <a href="https://websitebuilderaustralia.com.au" className="hover:text-brass-500">Website Builder Australia</a>
        </div>
      </footer>
    </div>
  )
}
