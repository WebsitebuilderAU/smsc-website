import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

// Editable slugs on the public site. Kept small on purpose so Anelia only
// touches copy that's actually shown, not admin-only text.
const KNOWN_SLUGS = [
  { slug: 'about',           label: 'About / Club',       hint: 'Shown on the About page (main body copy).' },
  { slug: 'about-membership', label: 'Membership info',   hint: 'Right-hand column of the About page.' },
  { slug: 'contact-intro',   label: 'Contact intro',      hint: 'Short line at the top of the Contact page.' },
  { slug: 'events-intro',    label: 'Events intro',       hint: 'Line at the top of the Events page.' },
  { slug: 'expo-intro',      label: 'EXPO intro',         hint: 'Line at the top of the Festival of Model Ships page.' },
]

export default function AdminPages() {
  const [slug,   setSlug]   = useState(KNOWN_SLUGS[0].slug)
  const [title,  setTitle]  = useState('')
  const [content, setContent] = useState('')
  const [msg, setMsg]       = useState('')
  const [busy, setBusy]     = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    (async () => {
      setLoaded(false); setMsg('')
      const { data, error } = await supabase
        .from('pages')
        .select('title, content')
        .eq('slug', slug)
        .maybeSingle()
      if (error) setMsg('Load error: ' + error.message)
      setTitle(data?.title || '')
      setContent(data?.content || '')
      setLoaded(true)
    })()
  }, [slug])

  async function save(e) {
    e.preventDefault(); setBusy(true); setMsg('')
    const { error } = await supabase
      .from('pages')
      .upsert({
        slug, title, content,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'slug' })
    if (error) setMsg('Error: ' + error.message)
    else setMsg('Saved. Public site updates on next page reload.')
    setBusy(false)
  }

  const current = KNOWN_SLUGS.find(k => k.slug === slug)

  return (
    <div className="max-w-3xl">
      <h2 className="font-display text-xl font-bold text-navy-900 mb-1">Edit page copy</h2>
      <p className="text-sm text-navy-700 mb-6">
        Change the wording on any of the main site pages. Choose a page from the list, edit the
        title and content, then save. Nothing is published until you press <b>Save</b>.
      </p>

      <form onSubmit={save} className="space-y-4 bg-white rounded-lg border border-navy-200 p-6">
        <label className="block">
          <span className="block text-sm text-navy-800 mb-1">Page to edit</span>
          <select
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="input"
            data-testid="select-page-slug"
          >
            {KNOWN_SLUGS.map(k => (
              <option key={k.slug} value={k.slug}>{k.label}</option>
            ))}
          </select>
          {current?.hint && <span className="block text-xs text-navy-500 mt-1">{current.hint}</span>}
        </label>

        {!loaded ? (
          <p className="text-sm text-navy-500">Loading…</p>
        ) : (
          <>
            <label className="block">
              <span className="block text-sm text-navy-800 mb-1">Title (optional)</span>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="input"
                placeholder="e.g. About the Sydney Model Shipbuilders Club"
                data-testid="input-page-title"
              />
            </label>

            <label className="block">
              <span className="block text-sm text-navy-800 mb-1">
                Content
                <span className="text-navy-500 font-normal"> — plain text. Use blank lines to separate paragraphs.</span>
              </span>
              <textarea
                rows="18"
                value={content}
                onChange={e => setContent(e.target.value)}
                className="input font-mono text-sm leading-relaxed"
                placeholder="Type or paste the page copy here…"
                data-testid="textarea-page-content"
              />
            </label>

            {msg && (
              <p
                className={`text-sm rounded px-3 py-2 border ${
                  msg.startsWith('Error') || msg.startsWith('Load')
                    ? 'text-red-700 bg-red-50 border-red-200'
                    : 'text-green-800 bg-green-50 border-green-200'
                }`}
                data-testid="text-save-message"
              >
                {msg}
              </p>
            )}

            <div className="flex items-center gap-3">
              <button disabled={busy} className="btn-primary" data-testid="button-save-page">
                {busy ? 'Saving…' : 'Save changes'}
              </button>
              <span className="text-xs text-navy-500">
                Changes are visible on the public site on next reload.
              </span>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
