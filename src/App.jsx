import { useEffect, useState } from 'react'
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import { supabase, isLive } from './lib/supabase.js'

// Nav order matches Anelia's T2 diagram exactly:
// Landing → About & Membership → Meetings → Events/EXPO → Gallery → Chatterbox
const nav = [
  { to: '/',             label: 'Home' },
  { to: '/about',        label: 'About & Membership' },
  { to: '/meetings',     label: 'Meetings' },
  { to: '/events',       label: 'Events & EXPO' },
  { to: '/gallery',      label: 'Gallery' },
  { to: '/chatterbox',   label: 'Chatterbox' },
  { to: '/contact',      label: 'Contact' },
]

function ClubBanner({ position = 'top' }) {
  // The solid navy bar with the club wordmark, wrapping top & bottom of every page
  // as per Anelia's layout diagram.
  return (
    <div
      className={`bg-navy-800 text-white tracking-widest text-center font-display
        ${position === 'top' ? 'border-b-2 border-brass-500' : 'border-t-2 border-brass-500'}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 text-sm md:text-base font-semibold uppercase">
        Sydney Model Shipbuilders Club
      </div>
    </div>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'
  const [info, setInfo] = useState(null)
  useEffect(() => {
    if (!isLive) return
    supabase.from('club_info').select('*').eq('id', 1).maybeSingle().then(({ data }) => setInfo(data))
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      {/* Top navy wordmark banner — only on sub-pages.
          Landing page renders its own banded hero (HeroCollage) which
          includes the wordmark fused to the image top + bottom. */}
      {!isLanding && <ClubBanner position="top" />}

      {/* Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-navy-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center">
            <span className="font-display text-navy-900 leading-tight">
              <span className="block font-bold text-base md:text-lg">Sydney Model Shipbuilders Club</span>
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
                    isActive
                      ? 'bg-navy-800 text-white'
                      : 'text-navy-800 hover:bg-navy-100'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <nav className="md:hidden border-t border-navy-100 px-2 py-2 overflow-x-auto flex gap-1 text-sm">
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({isActive}) =>
                `whitespace-nowrap px-3 py-1 rounded ${
                  isActive ? 'bg-navy-800 text-white' : 'text-navy-800'
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

      {/* Footer */}
      <footer className="bg-navy-50 border-t border-navy-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8 text-navy-700">
          <div>
            <h4 className="text-navy-900 text-lg font-display font-bold mb-3">The Club</h4>
            <p className="text-sm text-navy-700">
              {info?.blurb || <em className="text-navy-500">[Short club description — to be supplied by the Club]</em>}
            </p>
            {info?.members_count != null && (
              <p className="text-xs text-navy-500 mt-2">{info.members_count} members</p>
            )}
          </div>
          <div>
            <h4 className="text-navy-900 text-lg font-display font-bold mb-3">Meeting Venue</h4>
            <p className="text-sm text-navy-700">
              {info?.venue_name
                ? <>
                    <strong>{info.venue_name}</strong>
                    {info.venue_address ? <><br />{info.venue_address}</> : null}
                    {info.meeting_time ? <><br /><em>{info.meeting_time}</em></> : null}
                  </>
                : <em className="text-navy-500">[Venue details — to be supplied by the Club]</em>}
            </p>
          </div>
          <div>
            <h4 className="text-navy-900 text-lg font-display font-bold mb-3">Contact</h4>
            <p className="text-sm">
              <Link to="/contact" className="underline hover:text-brass-600">Send us a message →</Link>
            </p>
          </div>
        </div>
      </footer>

      {/* Bottom navy wordmark banner (mirrors top — per Anelia's layout) */}
      <ClubBanner position="bottom" />

      <div className="bg-navy-900 text-xs text-center py-3 text-navy-400">
        © {new Date().getFullYear()} Sydney Model Shipbuilders Club
      </div>
    </div>
  )
}
