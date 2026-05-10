import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { uploadMany, slugify } from './uploadHelpers.js'

const blank = {
  title: '', builder: '', member_name: '', member_email: '',
  ship_type: '', era: '', scale: '', year: '',
  description: '', featured: false,
}

export default function AdminGallery() {
  const [items, setItems]   = useState([])
  const [form, setForm]     = useState(blank)
  const [files, setFiles]   = useState([])
  const [busy, setBusy]     = useState(false)
  const [msg, setMsg]       = useState('')
  const [editId, setEditId] = useState(null)

  async function load() {
    const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  function reset() { setForm(blank); setFiles([]); setEditId(null) }

  async function save(e) {
    e.preventDefault()
    setBusy(true); setMsg('')
    try {
      let photoUrls = []
      if (files.length) photoUrls = await uploadMany('ship-photos', files, slugify(form.title))
      const payload = {
        ...form,
        slug: slugify(form.title),
        year: form.year ? parseInt(form.year, 10) : null,
        photos: photoUrls.length ? photoUrls : undefined,
        image_url: photoUrls[0] || form.image_url || null,
        updated_at: new Date().toISOString(),
      }
      if (editId) {
        // Don't overwrite existing photos array if user didn't add new ones
        if (!photoUrls.length) delete payload.photos
        const { error } = await supabase.from('gallery_items').update(payload).eq('id', editId)
        if (error) throw error
        setMsg('Ship updated.')
      } else {
        if (!photoUrls.length) payload.photos = []
        const { error } = await supabase.from('gallery_items').insert(payload)
        if (error) throw error
        setMsg('Ship added.')
      }
      reset(); load()
    } catch (err) {
      setMsg('Error: ' + err.message)
    } finally { setBusy(false) }
  }

  function edit(it) {
    setEditId(it.id)
    setForm({
      title: it.title || '', builder: it.builder || '',
      member_name: it.member_name || '', member_email: it.member_email || '',
      ship_type: it.ship_type || '', era: it.era || '', scale: it.scale || '',
      year: it.year || '', description: it.description || '', featured: !!it.featured,
    })
    setFiles([])
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function remove(id) {
    if (!confirm('Delete this ship record? Photos will remain in storage.')) return
    await supabase.from('gallery_items').delete().eq('id', id)
    load()
  }

  return (
    <div className="grid lg:grid-cols-[1fr,1.4fr] gap-8">
      <form onSubmit={save} className="bg-white rounded-lg border border-navy-200 p-6 space-y-4 self-start">
        <h2 className="font-display text-xl font-bold text-navy-900">{editId ? 'Edit ship' : 'Add a ship'}</h2>
        <p className="text-sm text-navy-600">Each member can have their own ship page with photos and a write-up.</p>

        <Field label="Ship name *">
          <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Model maker (member)">
            <input value={form.member_name} onChange={e => setForm({...form, member_name: e.target.value})} className="input" />
          </Field>
          <Field label="Member email (optional)">
            <input type="email" value={form.member_email} onChange={e => setForm({...form, member_email: e.target.value})} className="input" />
          </Field>
        </div>
        <Field label="Builder (manufacturer / kit)">
          <input value={form.builder} onChange={e => setForm({...form, builder: e.target.value})} className="input" />
        </Field>
        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Ship type"><input value={form.ship_type} onChange={e => setForm({...form, ship_type: e.target.value})} className="input" /></Field>
          <Field label="Era"><input value={form.era} onChange={e => setForm({...form, era: e.target.value})} className="input" placeholder="Age of Sail" /></Field>
          <Field label="Scale"><input value={form.scale} onChange={e => setForm({...form, scale: e.target.value})} className="input" placeholder="1:96" /></Field>
        </div>
        <Field label="Year completed">
          <input type="number" value={form.year} onChange={e => setForm({...form, year: e.target.value})} className="input" />
        </Field>
        <Field label="About the build">
          <textarea rows="5" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input" />
        </Field>
        <Field label="Photos (multiple)">
          <input type="file" accept="image/*" multiple onChange={e => setFiles([...e.target.files])} />
          <p className="text-xs text-navy-500 mt-1">First photo becomes the gallery thumbnail.</p>
        </Field>
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} />
          Feature on home page
        </label>
        {msg && <p className="text-sm text-navy-700 bg-navy-50 border border-navy-200 rounded px-3 py-2">{msg}</p>}
        <div className="flex gap-2">
          <button disabled={busy} className="btn-primary">{busy ? 'Saving…' : (editId ? 'Update' : 'Add ship')}</button>
          {editId && <button type="button" onClick={reset} className="btn-secondary">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold text-navy-900">Existing ships ({items.length})</h2>
        {items.length === 0 && <p className="text-navy-500 italic">No ships yet — add the first one on the left.</p>}
        {items.map(it => (
          <div key={it.id} className="bg-white border border-navy-200 rounded-lg p-4 flex gap-4">
            <div className="w-24 h-24 bg-navy-100 rounded overflow-hidden shrink-0">
              {it.image_url
                ? <img src={it.image_url} alt={it.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full grid place-items-center text-navy-400 text-xs">no photo</div>}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold text-navy-900">{it.title}</h3>
              <p className="text-xs text-navy-600">
                {[it.member_name, it.ship_type, it.era, it.scale, it.year].filter(Boolean).join(' · ') || '—'}
              </p>
              {it.description && <p className="text-sm text-navy-700 mt-1 line-clamp-2">{it.description}</p>}
              <div className="mt-2 flex gap-2">
                <button onClick={() => edit(it)} className="text-sm text-navy-700 underline">Edit</button>
                <button onClick={() => remove(it.id)} className="text-sm text-red-700 underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm text-navy-800 mb-1">{label}</span>
      {children}
    </label>
  )
}
