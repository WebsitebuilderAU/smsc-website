import { useEffect, useState } from 'react'
import { supabase, isLive } from '../lib/supabase.js'
import SubpageHeaderImage from '../components/SubpageHeaderImage.jsx'

/**
 * Chatterbox archive — pulls newsletters from Supabase. Newest at top, then
 * the rest grouped by year.
 */
export default function Chatterbox() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(isLive)

  useEffect(() => {
    if (!isLive) return
    let active = true
    supabase
      .from('newsletters')
      .select('*')
      .order('published_date', { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (!error && data) setItems(data)
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  const [latest, ...past] = items
  const byYear = past.reduce((acc, n) => {
    const y = n.published_date ? new Date(n.published_date).getFullYear() : 'Undated'
    ;(acc[y] ||= []).push(n)
    return acc
  }, {})

  return (
    <>
    <SubpageHeaderImage label="Chatterbox — header image" />
    <section className="max-w-4xl mx-auto px-4 py-12">
      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">Chatterbox</h1>
        <p className="mt-2 text-sm text-navy-500">The Club's newsletter — issues uploaded by the committee.</p>
      </header>

      {loading && <p className="mt-8 text-navy-500 text-sm">Loading…</p>}

      <div className="mt-10 space-y-10">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900">Current issue</h2>
          {latest ? (
            <a href={latest.pdf_url} target="_blank" rel="noreferrer"
               className="mt-3 block bg-white border border-navy-200 rounded-lg p-5 hover:border-brass-500 transition">
              <h3 className="font-display text-lg text-navy-900">{latest.title}</h3>
              <p className="text-sm text-navy-600">
                {latest.issue_number ? `${latest.issue_number} · ` : ''}
                {latest.published_date ? new Date(latest.published_date).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }) : ''}
              </p>
              <span className="text-sm underline text-navy-700">Open PDF →</span>
            </a>
          ) : (
            <p className="mt-3 text-navy-500 text-sm italic">No issues uploaded yet.</p>
          )}
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900">Past issues</h2>
          {Object.keys(byYear).length === 0 && (
            <p className="mt-3 text-navy-500 text-sm italic">Past issues will appear here as they're uploaded.</p>
          )}
          {Object.keys(byYear).sort((a,b) => String(b).localeCompare(String(a))).map(year => (
            <div key={year} className="mt-5">
              <h3 className="font-display text-lg text-navy-700">{year}</h3>
              <ul className="mt-2 space-y-2">
                {byYear[year].map(n => (
                  <li key={n.id} className="bg-white border border-navy-200 rounded p-3">
                    <a href={n.pdf_url} target="_blank" rel="noreferrer" className="text-navy-900 underline">
                      {n.title}
                    </a>
                    <span className="text-xs text-navy-600 ml-2">
                      {n.issue_number ? n.issue_number : ''}
                      {n.published_date ? ` · ${new Date(n.published_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long' })}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  )
}
