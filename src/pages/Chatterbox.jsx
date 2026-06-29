import { useState, useMemo } from 'react'
import chatterboxData from '../data/chatterbox.json'

/**
 * Newsletter / Chatterbox page — per Anelia's PDF page 7.
 * Shows the SMSC Chatterbox masthead, a search input, then a grid of issue tiles.
 * Each tile: masthead thumbnail + "ISSUE #XXX / MONTH YEAR".
 * Data source: src/data/chatterbox.json (no Supabase dependency on this page).
 */

// Flatten all issues from the JSON into a single sorted array (newest first)
const ALL_ISSUES = [...chatterboxData.regular].sort((a, b) => b.issue_no - a.issue_no)

export default function Chatterbox() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_ISSUES
    const q = query.toLowerCase()
    return ALL_ISSUES.filter(issue =>
      issue.title.toLowerCase().includes(q) ||
      issue.date_text.toLowerCase().includes(q) ||
      String(issue.issue_no).includes(q)
    )
  }, [query])

  return (
    <section className="max-w-5xl mx-auto px-4 py-6">

      {/* Big Chatterbox masthead — full width */}
      <div className="mb-5">
        <img
          src="/images/smsc_chatterbox_masthead.png"
          alt="SMSC Chatterbox newsletter masthead"
          className="w-full max-w-2xl mx-auto block rounded shadow-sm border border-navy-200"
          loading="eager"
        />
      </div>

      {/* Search input — dotted underline style matching PDF */}
      <div className="mb-6">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search ..............................."
          className="w-full max-w-md bg-transparent border-0 border-b-2 border-navy-400
                     focus:outline-none focus:border-navy-700 py-2 px-1
                     text-navy-800 text-lg font-semibold placeholder:text-navy-400 placeholder:font-normal"
          aria-label="Search Chatterbox issues"
        />
      </div>

      {/* Copyright notice — per PDF */}
      <p className="text-xs text-navy-500 mb-6 max-w-2xl">
        All photographs and articles published remain the copyright property of the contributor and
        SMSC unless released. Some articles are researched from internet material and no copyright
        infringement is intended.
      </p>

      {/* Issue grid — masthead thumbnail + issue label */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map(issue => (
          <a
            key={issue.id}
            href={issue.pdf_url}
            target="_blank"
            rel="noreferrer"
            className="group block border-2 border-navy-200 rounded hover:border-red-600 transition bg-white shadow-sm overflow-hidden"
            aria-label={`Open ${issue.title}`}
          >
            {/* Masthead thumbnail */}
            <div className="aspect-[3/2] bg-navy-50 overflow-hidden">
              <img
                src="/images/smsc_chatterbox_masthead.png"
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition"
                loading="lazy"
              />
            </div>
            {/* Issue number + date */}
            <div className="p-2 text-center">
              <p className="font-bold text-navy-900 text-xs leading-tight">
                ISSUE # {issue.issue_no}
              </p>
              <p className="text-navy-600 text-xs mt-0.5">{issue.date_text}</p>
            </div>
          </a>
        ))}

        {filtered.length === 0 && (
          <p className="col-span-full text-center py-10 text-navy-500">
            No issues match that search.
          </p>
        )}
      </div>

      {/* Contact footer — per PDF */}
      <div className="mt-10 text-xs text-navy-500 space-y-1">
        <p>The CHATTERBOX INDEX is available at smsc.org.au</p>
        <p>Please address all correspondence to SMSC and/or any members of the Executive Committee to the Secretary at <a href="mailto:secretary@smsc.org.au" className="underline">secretary@smsc.org.au</a></p>
        <p>All mail and contributions to CHATTERBOX to be sent to the Editors, Tom Wolf: <a href="mailto:tom@aces.net.au" className="underline">tom@aces.net.au</a> or Michael Bennett: <a href="mailto:mjbennett@ozemail.com.au" className="underline">mjbennett@ozemail.com.au</a></p>
      </div>

    </section>
  )
}
