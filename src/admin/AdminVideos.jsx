import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const blank = { title: '', description: '', embed_url: '', cf_stream_id: '', thumbnail_url: '', category: '' }

export default function AdminVideos() {
  const [items, setItems] = useState([])
  const [form, setForm]   = useState(blank)
  const [msg, setMsg]     = useState('')

  async function load() {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function save(e) {
    e.preventDefault(); setMsg('')
    const { error } = await supabase.from('videos').insert(form)
    if (error) { setMsg('Error: ' + error.message); return }
    setMsg('Video added.'); setForm(blank); load()
  }

  async function remove(id) {
    if (!confirm('Delete this video?')) return
    await supabase.from('videos').delete().eq('id', id)
    load()
  }

  return (
    <div className="grid lg:grid-cols-[1fr,1.4fr] gap-8">
      <form onSubmit={save} className="bg-white rounded-lg border border-navy-200 p-6 space-y-4 self-start">
        <h2 className="font-display text-xl font-bold text-navy-900">Add a video</h2>
        <p className="text-sm text-navy-600">Paste the Cloudflare Stream / Vimeo / YouTube embed URL. Cloudflare Stream upload UI will be added once your Stream account is wired in.</p>
        <Field label="Title *"><input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" /></Field>
        <Field label="Embed URL *"><input required value={form.embed_url} onChange={e => setForm({...form, embed_url: e.target.value})} className="input" placeholder="https://customer-xxx.cloudflarestream.com/abc/iframe" /></Field>
        <Field label="Cloudflare Stream UID (optional)"><input value={form.cf_stream_id} onChange={e => setForm({...form, cf_stream_id: e.target.value})} className="input" /></Field>
        <Field label="Thumbnail URL (optional)"><input value={form.thumbnail_url} onChange={e => setForm({...form, thumbnail_url: e.target.value})} className="input" /></Field>
        <Field label="Category"><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input" placeholder="Build log / EXPO / Demo" /></Field>
        <Field label="Description"><textarea rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input" /></Field>
        {msg && <p className="text-sm text-navy-700 bg-navy-50 border border-navy-200 rounded px-3 py-2">{msg}</p>}
        <button className="btn-primary">Add video</button>
      </form>

      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold text-navy-900">Videos ({items.length})</h2>
        {items.length === 0 && <p className="text-navy-500 italic">No videos yet.</p>}
        {items.map(it => (
          <div key={it.id} className="bg-white border border-navy-200 rounded-lg p-4">
            <h3 className="font-display font-bold text-navy-900">{it.title}</h3>
            <p className="text-xs text-navy-600">{it.category || '—'}</p>
            {it.embed_url && <a href={it.embed_url} target="_blank" rel="noreferrer" className="text-sm underline text-navy-700">Open</a>}
            {it.description && <p className="text-sm text-navy-700 mt-1">{it.description}</p>}
            <button onClick={() => remove(it.id)} className="mt-2 text-sm text-red-700 underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({label, children}) { return <label className="block"><span className="block text-sm text-navy-800 mb-1">{label}</span>{children}</label> }
