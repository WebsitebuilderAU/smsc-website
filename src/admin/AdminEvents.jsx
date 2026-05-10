import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const blank = { title: '', description: '', event_date: '', location: '', event_type: 'Meeting' }

export default function AdminEvents() {
  const [items, setItems] = useState([])
  const [form, setForm]   = useState(blank)
  const [editId, setEditId] = useState(null)
  const [msg, setMsg]     = useState('')

  async function load() {
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  function reset() { setForm(blank); setEditId(null) }

  async function save(e) {
    e.preventDefault(); setMsg('')
    const payload = { ...form, event_date: form.event_date || null }
    const { error } = editId
      ? await supabase.from('events').update(payload).eq('id', editId)
      : await supabase.from('events').insert(payload)
    if (error) { setMsg('Error: ' + error.message); return }
    setMsg(editId ? 'Event updated.' : 'Event added.')
    reset(); load()
  }

  async function remove(id) {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    load()
  }

  function edit(it) {
    setEditId(it.id)
    setForm({
      title: it.title || '', description: it.description || '',
      event_date: it.event_date ? it.event_date.slice(0, 16) : '',
      location: it.location || '', event_type: it.event_type || 'Meeting',
    })
  }

  return (
    <div className="grid lg:grid-cols-[1fr,1.4fr] gap-8">
      <form onSubmit={save} className="bg-white rounded-lg border border-navy-200 p-6 space-y-4 self-start">
        <h2 className="font-display text-xl font-bold text-navy-900">{editId ? 'Edit event' : 'Add an event'}</h2>
        <Field label="Title *">
          <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" />
        </Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Date & time">
            <input type="datetime-local" value={form.event_date} onChange={e => setForm({...form, event_date: e.target.value})} className="input" />
          </Field>
          <Field label="Type">
            <select value={form.event_type} onChange={e => setForm({...form, event_type: e.target.value})} className="input">
              <option>Meeting</option><option>EXPO</option><option>Workshop</option><option>Other</option>
            </select>
          </Field>
        </div>
        <Field label="Location"><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="input" /></Field>
        <Field label="Description"><textarea rows="4" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input" /></Field>
        {msg && <p className="text-sm text-navy-700 bg-navy-50 border border-navy-200 rounded px-3 py-2">{msg}</p>}
        <div className="flex gap-2">
          <button className="btn-primary">{editId ? 'Update' : 'Add event'}</button>
          {editId && <button type="button" onClick={reset} className="btn-secondary">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold text-navy-900">Events ({items.length})</h2>
        {items.length === 0 && <p className="text-navy-500 italic">No events yet.</p>}
        {items.map(it => (
          <div key={it.id} className="bg-white border border-navy-200 rounded-lg p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display font-bold text-navy-900">{it.title}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-brass-500/20 text-navy-900">{it.event_type}</span>
            </div>
            <p className="text-sm text-navy-600">
              {it.event_date ? new Date(it.event_date).toLocaleString('en-AU') : '—'}
              {it.location ? ` · ${it.location}` : ''}
            </p>
            {it.description && <p className="text-sm text-navy-700 mt-1">{it.description}</p>}
            <div className="mt-2 flex gap-2">
              <button onClick={() => edit(it)} className="text-sm text-navy-700 underline">Edit</button>
              <button onClick={() => remove(it.id)} className="text-sm text-red-700 underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({label, children}) { return <label className="block"><span className="block text-sm text-navy-800 mb-1">{label}</span>{children}</label> }
