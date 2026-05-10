import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function AdminLogin() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy]         = useState(false)
  const [error, setError]       = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setBusy(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-50 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white rounded-lg shadow border border-navy-200 p-8 space-y-5">
        <h1 className="text-xl font-display font-bold text-navy-900 text-center">SMSC Club Admin</h1>
        <p className="text-sm text-navy-600 text-center">Committee sign-in to manage gallery, meetings, newsletters and events.</p>
        <label className="block">
          <span className="block text-sm text-navy-800 mb-1">Email</span>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded border border-navy-200 focus:outline-none focus:ring-2 focus:ring-brass-500" />
        </label>
        <label className="block">
          <span className="block text-sm text-navy-800 mb-1">Password</span>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded border border-navy-200 focus:outline-none focus:ring-2 focus:ring-brass-500" />
        </label>
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}
        <button disabled={busy} className="w-full py-2 rounded bg-navy-800 text-white font-semibold hover:bg-navy-700 disabled:opacity-60">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
