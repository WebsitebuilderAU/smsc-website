import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { uploadVideoToStream } from '../lib/stream.js'

const blank = { title: '', description: '', embed_url: '', cf_stream_id: '', thumbnail_url: '', category: '' }

export default function AdminVideos() {
  const [items, setItems] = useState([])
  const [form, setForm]   = useState(blank)
  const [msg, setMsg]     = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const fileRef = useRef(null)

  async function load() {
    const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type?.startsWith('video/')) {
      setMsg('Error: please choose a video file (MP4, MOV, WebM).')
      return
    }
    setMsg('')
    setUploading(true)
    setProgress(`Uploading ${file.name} (${Math.round(file.size/1024/1024)} MB)…`)
    try {
      const v = await uploadVideoToStream(file)
      setForm(f => ({
        ...f,
        embed_url: v.playback,
        cf_stream_id: v.uid,
        thumbnail_url: v.thumbnail,
        title: f.title || file.name.replace(/\.[^/.]+$/, ''),
      }))
      setProgress('Upload done. Fill in title/description then press Add video.')
    } catch (err) {
      setProgress('')
      setMsg('Upload failed: ' + (err?.message || 'Unknown error') + '. Check VITE_CF_STREAM_CUSTOMER and the Netlify stream-direct-upload function.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function save(e) {
    e.preventDefault(); setMsg('')
    if (!form.embed_url) { setMsg('Error: upload a video file, or paste an embed URL.'); return }
    const { error } = await supabase.from('videos').insert(form)
    if (error) { setMsg('Error: ' + error.message); return }
    setMsg('Video added.'); setForm(blank); setProgress(''); load()
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
        <p className="text-sm text-navy-600">
          Upload a video file (MP4, MOV, WebM) and it goes straight to Cloudflare Stream —
          no size limit, no site slowdown. Or paste a Cloudflare Stream / Vimeo / YouTube embed URL below.
        </p>

        <div className="bg-navy-50 border border-navy-200 rounded p-3 space-y-2">
          <label className="block">
            <span className="block text-sm font-medium text-navy-900 mb-1">Upload a video file</span>
            <input
              ref={fileRef}
              type="file"
              accept="video/*"
              onChange={handleFile}
              disabled={uploading}
              className="block w-full text-sm text-navy-800 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-navy-800 file:text-white file:font-semibold file:cursor-pointer hover:file:bg-navy-700 disabled:opacity-60"
              data-testid="input-video-file"
            />
            <span className="block text-xs text-navy-600 mt-1">
              Videos are streamed from Cloudflare — the site stays fast no matter how many you add.
            </span>
          </label>
          {progress && (
            <p className="text-sm text-navy-800" data-testid="text-upload-progress">
              {uploading && '⏳ '}{progress}
            </p>
          )}
        </div>

        <Field label="Title *"><input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" data-testid="input-video-title" /></Field>
        <Field label="Embed URL *"><input required value={form.embed_url} onChange={e => setForm({...form, embed_url: e.target.value})} className="input" placeholder="Auto-filled after upload, or paste a Vimeo / YouTube link" data-testid="input-video-url" /></Field>
        <Field label="Cloudflare Stream UID (auto-filled on upload)"><input value={form.cf_stream_id} onChange={e => setForm({...form, cf_stream_id: e.target.value})} className="input" /></Field>
        <Field label="Thumbnail URL (auto-filled on upload)"><input value={form.thumbnail_url} onChange={e => setForm({...form, thumbnail_url: e.target.value})} className="input" /></Field>
        <Field label="Category"><input value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input" placeholder="Build log / EXPO / Demo" /></Field>
        <Field label="Description"><textarea rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input" /></Field>
        {msg && (
          <p
            className={`text-sm rounded px-3 py-2 border ${msg.startsWith('Error') || msg.startsWith('Upload failed') ? 'text-red-700 bg-red-50 border-red-200' : 'text-green-800 bg-green-50 border-green-200'}`}
            data-testid="text-video-message"
          >
            {msg}
          </p>
        )}
        <button className="btn-primary" data-testid="button-add-video" disabled={uploading}>
          {uploading ? 'Uploading…' : 'Add video'}
        </button>
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
            <button onClick={() => remove(it.id)} className="mt-2 text-sm text-red-700 underline" data-testid={`button-delete-video-${it.id}`}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({label, children}) { return <label className="block"><span className="block text-sm text-navy-800 mb-1">{label}</span>{children}</label> }
