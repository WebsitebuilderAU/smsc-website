import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export default function AdminContactSubmissions() {
  const [rows, setRows]   = useState([])
  const [busy, setBusy]   = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setBusy(true); setError('')
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setRows(data || [])
    setBusy(false)
  }

  useEffect(() => { load() }, [])

  async function remove(id) {
    if (!confirm('Delete this message? This cannot be undone.')) return
    const { error } = await supabase.from('contact_submissions').delete().eq('id', id)
    if (error) alert('Could not delete: ' + error.message)
    else load()
  }

  function fmtDate(d) {
    if (!d) return ''
    const dt = new Date(d)
    return dt.toLocaleString('en-AU', { dateStyle: 'medium', timeStyle: 'short' })
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-2xl font-display font-bold text-navy-900">Contact form messages</h2>
        <p className="text-navy-700 mt-1">
          Every message sent through the website Contact form appears here. Click the email
          address to reply directly from your mail program.
        </p>
      </header>

      {busy && <p className="text-navy-500">Loading…</p>}
      {error && <p className="text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">{error}</p>}

      {!busy && rows.length === 0 && (
        <p className="bg-white rounded-lg border border-navy-200 p-6 text-navy-600">
          No messages yet.
        </p>
      )}

      <ul className="space-y-4">
        {rows.map(r => (
          <li key={r.id} className="bg-white rounded-lg border border-navy-200 p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <p className="font-semibold text-navy-900">{r.name}</p>
                <a href={`mailto:${r.email}`} className="text-sm text-brass-600 underline">
                  {r.email}
                </a>
              </div>
              <p className="text-xs text-navy-500">{fmtDate(r.created_at)}</p>
            </div>
            <p className="mt-3 text-navy-800 whitespace-pre-wrap text-sm">{r.message}</p>
            <div className="mt-4 flex gap-3 text-sm">
              <a
                href={`mailto:${r.email}?subject=Re: Your message to Sydney Model Shipbuilders Club`}
                className="px-3 py-1 rounded bg-brass-500 text-navy-900 font-semibold hover:bg-brass-400"
              >
                Reply by email
              </a>
              <button
                onClick={() => remove(r.id)}
                className="px-3 py-1 rounded border border-navy-300 text-navy-700 hover:bg-navy-100"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
