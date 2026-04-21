import { useEffect, useMemo, useState } from 'react'
import { supabase, isLive } from '../lib/supabase.js'

/**
 * Chatterbox archive — per Anelia's diagram:
 *   "Current issues · Past Issues · Special Issues on a specific model or
 *    model maker. Need to be able to 'word' search to locate information."
 */
const CATEGORIES = [
  { key: 'current', label: 'Current Issues' },
  { key: 'past',    label: 'Past Issues' },
  { key: 'special', label: 'Special Issues' },
]

const stubIssues = [
  { id: 's1', category: 'current', title: 'Chatterbox — awaiting latest issue', date: null,         summary: 'The most recent newsletter will appear here once uploaded by the club.' },
  { id: 's2', category: 'past',    title: 'Chatterbox — archive back catalogue', date: null,        summary: 'Past issues will be added here as the archive is digitised.' },
  { id: 's3', category: 'special', title: 'Special Issue — awaiting feature',     date: null,        summary: 'Special issues focused on a specific model or model maker will be listed here.' },
]

export default function Chatterbox() {
  const [issues, setIssues]   = useState(stubIssues)
  const [category, setCategory] = useState('current')
  const [query, setQuery]     = useState('')

  useEffect(() => {
    if (!isLive) return
    let active = true
    supabase
      .from('newsletters')
      .select('*')
      .order('date', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data?.length) setIssues(data)
      })
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
    return issues.filter(i => {
      if (category && i.category && i.category !== category) return false
      if (!query) return true
      const q = query.toLowerCase()
      return (
        (i.title || '').toLowerCase().includes(q) ||
        (i.summary || '').toLowerCase().includes(q)
      )
    })
  }, [issues, category, query])

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold text-navy-900">The Chatterbox</h1>
      <p className="mt-3 text-navy-700">
        The club's regular newsletter — build reports, meeting notes, EXPO coverage
        and technique articles. Search the whole archive by word.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button
            key={c.key}
            onClick={() => setCategory(c.key)}
            className={`px-4 py-2 rounded text-sm font-medium border ${
              category === c.key
                ? 'bg-navy-800 text-white border-navy-800'
                : 'bg-white text-navy-800 border-navy-200 hover:bg-navy-50'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Word search across all issues…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="mt-4 w-full px-4 py-2 rounded border border-navy-200 focus:outline-none focus:ring-2 focus:ring-brass-500"
      />

      <ul className="mt-8 divide-y divide-navy-200 bg-white rounded shadow-sm border border-navy-200">
        {filtered.map(i => (
          <li key={i.id} className="p-5 hover:bg-navy-50">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-lg text-navy-900">{i.title}</h3>
                {i.date && (
                  <p className="text-sm text-navy-500">
                    {new Date(i.date).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                  </p>
                )}
                {i.summary && <p className="text-sm text-navy-700 mt-2">{i.summary}</p>}
              </div>
              {i.pdf_url
                ? <a href={i.pdf_url} className="text-brass-600 font-semibold hover:underline shrink-0">Read →</a>
                : <span className="text-xs text-navy-400 shrink-0">Uploading…</span>}
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="p-8 text-center text-navy-500">No issues match that search.</li>
        )}
      </ul>
    </section>
  )
}
