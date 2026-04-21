import { useMemo, useState } from 'react'
import chatterboxData from '../data/chatterbox.json'

/**
 * Chatterbox archive — live links to PDF issues hosted on smsc.org.au.
 * Data sourced from the existing club site's Chatterbox Library and
 * Chatterbox Special Issues pages.
 * Anelia's spec: Current · Past · Special tabs + word search.
 */
const CATEGORIES = [
  { key: 'current', label: 'Current Issues' },
  { key: 'past',    label: 'Past Issues' },
  { key: 'special', label: 'Special Issues' },
]

export default function Chatterbox() {
  const allIssues = useMemo(
    () => [...chatterboxData.regular, ...chatterboxData.special],
    [],
  )
  const [category, setCategory] = useState('current')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return allIssues.filter(i => {
      if (category && i.category !== category) return false
      if (!query) return true
      const q = query.toLowerCase()
      return (
        (i.title || '').toLowerCase().includes(q) ||
        (i.ship_name || '').toLowerCase().includes(q) ||
        (i.builder || '').toLowerCase().includes(q) ||
        (i.date_text || '').toLowerCase().includes(q)
      )
    })
  }, [allIssues, category, query])

  const counts = {
    current: allIssues.filter(i => i.category === 'current').length,
    past:    allIssues.filter(i => i.category === 'past').length,
    special: allIssues.filter(i => i.category === 'special').length,
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <img
        src={`${import.meta.env.BASE_URL}images/smsc_chatterbox_masthead.png`}
        alt="Chatterbox — Sydney Model Shipbuilders Club newsletter masthead"
        className="w-full max-w-3xl mx-auto rounded shadow-sm"
      />
      <p className="mt-6 text-navy-700 leading-relaxed">
        Chatterbox is emailed to all members as each issue is released. This
        page is a complete archive of every issue — monthly newsletters,
        Special Issues (member build logs) and Special EXPO Issues.
      </p>
      <p className="mt-2 text-xs text-navy-500">
        All photographs and articles remain the copyright property of the
        contributor and SMSC unless released.
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
            {c.label} <span className="opacity-60">· {counts[c.key]}</span>
          </button>
        ))}
      </div>

      <input
        type="search"
        placeholder="Word search — ship name, builder, issue number, date…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="mt-4 w-full px-4 py-2 rounded border border-navy-200 focus:outline-none focus:ring-2 focus:ring-brass-500"
      />

      <ul className="mt-8 divide-y divide-navy-200 bg-white rounded shadow-sm border border-navy-200">
        {filtered.map(i => (
          <li key={i.id} className="p-5 hover:bg-navy-50 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-base text-navy-900">{i.title}</h3>
              {i.date_text && <p className="text-sm text-navy-500">{i.date_text}</p>}
              {i.builder && <p className="text-xs text-navy-500 mt-1">Builder: {i.builder}</p>}
            </div>
            {i.pdf_url
              ? <a href={i.pdf_url} target="_blank" rel="noopener noreferrer" className="text-brass-600 font-semibold hover:underline shrink-0 text-sm">Read PDF →</a>
              : <span className="text-xs text-navy-400 shrink-0">Link pending</span>}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="p-8 text-center text-navy-500">No issues match that search.</li>
        )}
      </ul>

      <p className="mt-8 text-sm text-navy-500 text-center">
        Earlier issues are available on request — please{' '}
        <a href="/#/contact" className="underline hover:text-brass-600">contact the club</a>.
      </p>
    </section>
  )
}
