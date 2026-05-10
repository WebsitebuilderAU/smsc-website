import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase, isLive } from '../lib/supabase.js'
import AdminLogin from './AdminLogin.jsx'

const adminNav = [
  { to: '/admin',             label: 'Dashboard', end: true },
  { to: '/admin/gallery',     label: 'Gallery / Members' },
  { to: '/admin/events',      label: 'Events & EXPO' },
  { to: '/admin/meetings',    label: 'Meeting Notes' },
  { to: '/admin/newsletters', label: 'Chatterbox' },
  { to: '/admin/videos',      label: 'Videos' },
  { to: '/admin/club',        label: 'Club Info' },
]

export default function AdminLayout() {
  const [session, setSession] = useState(null)
  const [ready, setReady]     = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLive) { setReady(true); return }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (!isLive) {
    return (
      <div className="max-w-2xl mx-auto p-12 text-center text-navy-700">
        <h1 className="text-2xl font-display font-bold text-navy-900">Admin unavailable</h1>
        <p className="mt-3">Supabase environment variables are not configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> and rebuild.</p>
      </div>
    )
  }
  if (!ready) return <div className="p-12 text-center text-navy-500">Loading…</div>
  if (!session) return <AdminLogin />

  return (
    <div className="min-h-screen flex flex-col bg-navy-50">
      <header className="bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display tracking-wide">SMSC — Club Admin</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-navy-200">{session.user.email}</span>
            <button onClick={signOut} className="px-3 py-1 rounded bg-brass-500 text-navy-900 font-semibold hover:bg-brass-400">Sign out</button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-2 pb-2 flex flex-wrap gap-1 text-sm">
          {adminNav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({isActive}) =>
                `px-3 py-1.5 rounded ${isActive ? 'bg-white text-navy-900 font-semibold' : 'text-white/80 hover:bg-navy-800'}`
              }
            >{n.label}</NavLink>
          ))}
        </nav>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-navy-500 py-4">
        Authenticated club admin · changes are live on the public site.
      </footer>
    </div>
  )
}
