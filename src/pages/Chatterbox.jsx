import { useState } from 'react'
import chatterboxData from '../data/chatterbox.json'

/**
 * Newsletter / Chatterbox page — per Anelia's 7 Jul 2026 markup.
 *
 *  Row 1 (top strip):
 *    LEFT   – "Search ......" input inline with a small "Newsletter - Chatterbox" heading
 *    RIGHT  – Red-outlined tile "Special Issues currently 33" linking to
 *             the live SMSC special-issues page
 *
 *  Row 2 (below):
 *    LEFT   – Full-size cover of the LATEST issue (currently #106 - Aug 2025)
 *    MIDDLE – Smaller thumbnail of the previous issue (currently #105)
 *
 *  Row 3 – Past-issues linked list (matches the smsc.org.au archive style)
 */

const REGULAR_ISSUES = [...chatterboxData.regular].sort((a, b) => b.issue_no - a.issue_no)
const CURRENT = REGULAR_ISSUES[0]
const PREVIOUS = REGULAR_ISSUES[1]
const ARCHIVE = REGULAR_ISSUES.slice(2)
const SPECIAL_COUNT = chatterboxData.special_issues_count
const SPECIAL_URL = chatterboxData.special_issues_url

// All regular issues sorted newest-first for the dropdown
const ALL_ISSUES_NEWEST_FIRST = REGULAR_ISSUES

export default function Chatterbox() {
  const [selectedId, setSelectedId] = useState('')

  const handleSelect = (e) => {
    const id = e.target.value
    setSelectedId(id)
    if (!id) return
    const issue = ALL_ISSUES_NEWEST_FIRST.find(i => String(i.id) === id)
    if (issue && issue.pdf_url) {
      window.open(issue.pdf_url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">

      {/* ── ROW 1 ────────────────────────────────────────────────────────────
          LEFT: Search inline with "Newsletter - Chatterbox" heading
          RIGHT: Special Issues tile linking to live special-issues page */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 mb-8 items-start">

        {/* LEFT — Newsletter title + search input */}
        <div>
          <h2 className="font-display font-bold text-navy-900 text-xl mb-2">
            Newsletter - Chatterbox
          </h2>
          <div className="flex items-center gap-3">
            <label
              htmlFor="chatterbox-select"
              className="font-display font-semibold text-navy-800 text-base leading-none whitespace-nowrap"
            >
              Search
            </label>
            <select
              id="chatterbox-select"
              value={selectedId}
              onChange={handleSelect}
              className="flex-1 max-w-md bg-white border-2 border-navy-400
                         focus:outline-none focus:border-navy-700 rounded py-1.5 px-3
                         text-navy-800 text-base"
              aria-label="Select a Chatterbox issue"
            >
              <option value="">Select an issue…</option>
              {ALL_ISSUES_NEWEST_FIRST.map(issue => (
                <option key={issue.id} value={issue.id}>
                  Issue #{issue.issue_no} — {issue.date_text}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* RIGHT — Special Issues red-outlined tile.
           Anelia's markup: "Special Issues currently N" as a link/count. */}
        <a
          href={SPECIAL_URL}
          target="_blank"
          rel="noreferrer"
          className="block border-2 border-red-600 rounded-lg px-6 py-4 bg-white
                     hover:bg-red-50 hover:shadow-md transition text-center
                     min-w-[240px]"
          aria-label={`Open Special Issues — currently ${SPECIAL_COUNT} available`}
        >
          <h3 className="font-display font-bold text-navy-900 text-lg leading-tight">
            Special Issues
          </h3>
          <p className="text-navy-700 text-sm mt-1">
            currently <span className="font-bold text-red-700">{SPECIAL_COUNT}</span>
          </p>
        </a>
      </div>

      {/* ── ROW 2 ────────────────────────────────────────────────────────────
          Current issue (large) + previous issue (small). */}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 mb-10 items-start">

        {/* LEFT — Current (latest) issue, full-size */}
        <a
          href={CURRENT.pdf_url}
          target="_blank"
          rel="noreferrer"
          className="group block border-2 border-navy-300 hover:border-red-600 rounded shadow-sm
                     bg-white overflow-hidden transition"
          aria-label={`Open current ${CURRENT.title}`}
        >
          <div className="aspect-[3/4] bg-white overflow-hidden flex items-center justify-center">
            <img
              src={CURRENT.cover_url || './images/smsc_chatterbox_masthead.png'}
              alt={`${CURRENT.title} cover`}
              className="w-full h-full object-contain group-hover:scale-[1.02] transition"
              loading="eager"
            />
          </div>
          <div className="p-4 text-center bg-white border-t border-navy-100">
            <p className="font-display font-bold text-navy-900 text-lg">
              ISSUE # {CURRENT.issue_no}
            </p>
            <p className="text-navy-700 text-sm mt-1">{CURRENT.date_text}</p>
            <p className="text-red-700 text-xs mt-2 font-semibold uppercase tracking-wide">
              Current issue — click to open PDF
            </p>
          </div>
        </a>

        {/* MIDDLE — Previous issue, smaller thumbnail */}
        {PREVIOUS && (
          <a
            href={PREVIOUS.pdf_url}
            target="_blank"
            rel="noreferrer"
            className="group block border-2 border-navy-300 hover:border-red-600 rounded shadow-sm
                       bg-white overflow-hidden transition max-w-[260px]"
            aria-label={`Open previous ${PREVIOUS.title}`}
          >
            <div className="aspect-[3/4] bg-white overflow-hidden flex items-center justify-center">
              <img
                src={PREVIOUS.cover_url || './images/smsc_chatterbox_masthead.png'}
                alt={`${PREVIOUS.title} cover`}
                className="w-full h-full object-contain group-hover:scale-[1.02] transition"
                loading="lazy"
              />
            </div>
            <div className="p-3 text-center bg-white border-t border-navy-100">
              <p className="font-display font-bold text-navy-900 text-base">
                ISSUE # {PREVIOUS.issue_no}
              </p>
              <p className="text-navy-700 text-xs mt-0.5">{PREVIOUS.date_text}</p>
              <p className="text-navy-500 text-xs mt-1 uppercase tracking-wide">Previous</p>
            </div>
          </a>
        )}
      </div>

      {/* ── ROW 3 ────────────────────────────────────────────────────────────
          Past-issues linked archive list (styled like the smsc.org.au page). */}
      <div className="border-t-2 border-navy-200 pt-6 mb-8">
        <h3 className="font-display font-bold text-navy-900 text-lg mb-3">
          Past Issues
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1.5">
          {ARCHIVE.map(issue => (
            <li key={issue.id}>
              <a
                href={issue.pdf_url}
                target="_blank"
                rel="noreferrer"
                className="text-navy-800 hover:text-red-700 hover:underline text-sm"
              >
                Issue #{issue.issue_no} — {issue.date_text}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-xs text-navy-500 mt-4 italic">
          Previous issues before #{ARCHIVE.length ? ARCHIVE[ARCHIVE.length - 1].issue_no : 92} are available on request by email.
        </p>
      </div>

      {/* Contact footer — verbatim from the club's PDF letterhead */}
      <div className="text-xs text-navy-500 space-y-1 border-t border-navy-100 pt-4">
        <p>The CHATTERBOX INDEX is available at smsc.org.au</p>
        <p>Please address all correspondence to SMSC and/or any members of the Executive Committee to the Secretary at <a href="mailto:secretary@smsc.org.au" className="underline">secretary@smsc.org.au</a></p>
        <p>All mail and contributions to CHATTERBOX to be sent to the Editors, Tom Wolf: <a href="mailto:tom@aces.net.au" className="underline">tom@aces.net.au</a> or Michael Bennett: <a href="mailto:mjbennett@ozemail.com.au" className="underline">mjbennett@ozemail.com.au</a></p>
      </div>

    </section>
  )
}
