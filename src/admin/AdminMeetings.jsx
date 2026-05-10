import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { uploadToBucket } from './uploadHelpers.js'

const blank = { meeting_date: '', title: '', agenda: '', minutes_text: '', attendees: '' }

export default function AdminMeetings() {
  const [items, setItems] = useState([])
  const [form, setForm]   = useState(blank)
  const [pdf, setPdf]     = useState(null)
  const [msg, setMsg]     = useState('')
  const [busy, setBusy]   = useState(false)
  const [editId, setEditId] = useState(null)

  async function load() {
    const { data } = await supabase.from('meeting_notes').select('*').order('meeting_date', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])
  function reset() { setForm(blank); setPdf(null); setEditId(null) }

  async function save(e) {
    e.preventDefault(); setBusy(true); setMsg('')
    try {
      let minutes_pdf = undefined
      if (pdf) minutes_pdf = await uploadToBucket('meeting-minutes', pdf, form.meeting_date || 'misc')
      const payload = {
        meeting_date: form.meeting_date,
        title: form.title || null,
        agenda: form.agenda || null,
        minutes_text: form.minutes_text || null,
        attendees: form.attendees ? parseInt(form.attendees, 10) : null,
        ...(minutes_pdf ? { minutes_pdf } : {}),
      }
      const { error } = editId
        ? await supabase.from('meeting_notes').update(payload).eq('id', editId)
        : await supabase.from('meeting_notes').insert(payload)
      if (error) throw error
      setMsg(editId ? 'Meeting updated.' : 'Meeting saved.')
      reset(); load()
    } catch (err) { setMsg('Error: ' + err.message) }
    finally { setBusy(false) }
  }

  function edit(it) {
    setEditId(it.id)
    setForm({
      meeting_date: it.meeting_date || '', title: it.title || '',
      agenda: it.agenda || '', minutes_text: it.minutes_text || '',
      attendees: it.attendees || '',
    })
    setPdf(null)
  }

  async function remove(id) {
    if (!confirm('Delete this meeting record?')) return
    await supabase.from('meeting_notes').delete().eq('id', id)
    load()
  }

  return (
    <div className="grid lg:grid-cols-[1fr,1.4fr] gap-8">
      <form onSubmit={save} className="bg-white rounded-lg border border-navy-200 p-6 space-y-4 self-start">
        <h2 className="font-display text-xl font-bold text-navy-900">{editId ? 'Edit meeting' : 'Record a meeting'}</h2>
        <Field label="Meeting date *">
          <input type="date" required value={form.meeting_date} onChange={e => setForm({...form, meeting_date: e.target.value})} className="input" />
        </Field>
        <Field label="Title (optional)"><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" placeholder="Monthly meeting" /></Field>
        <Field label="Agenda"><textarea rows="3" value={form.agenda} onChange={e => setForm({...form, agenda: e.target.value})} className="input" /></Field>
        <Field label="Minutes (text)"><textarea rows="6" value={form.minutes_text} onChange={e => setForm({...form, minutes_text: e.target.value})} className="input" placeholder="Or upload a PDF below" /></Field>
        <Field label="Or upload minutes PDF">
          <input type="file" accept="application/pdf" onChange={e => setPdf(e.target.files[0] || null)} />
        </Field>
        <Field label="Attendees count">
          <input type="number" value={form.attendees} onChange={e => setForm({...form, attendees: e.target.value})} className="input" />
        </Field>
        {msg && <p className="text-sm text-navy-700 bg-navy-50 border border-navy-200 rounded px-3 py-2">{msg}</p>}
        <div className="flex gap-2">
          <button disabled={busy} className="btn-primary">{busy ? 'Saving…' : (editId ? 'Update' : 'Save meeting')}</button>
          {editId && <button type="button" onClick={reset} className="btn-secondary">Cancel</button>}
        </div>
      </form>

      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold text-navy-900">Meetings ({items.length})</h2>
        {items.length === 0 && <p className="text-navy-500 italic">No meetings recorded yet.</p>}
        {items.map(it => (
          <div key={it.id} className="bg-white border border-navy-200 rounded-lg p-4">
            <h3 className="font-display font-bold text-navy-900">
              {new Date(it.meeting_date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
              {it.title ? ` · ${it.title}` : ''}
            </h3>
            <p className="text-xs text-navy-600">
              {it.attendees ? `${it.attendees} attendees` : ''}
              {it.minutes_pdf ? <> · <a href={it.minutes_pdf} target="_blank" rel="noreferrer" className="underline">Minutes PDF</a></> : ''}
            </p>
            {it.agenda && <p className="mt-1 text-sm text-navy-700"><b>Agenda:</b> {it.agenda}</p>}
            {it.minutes_text && <p className="mt-1 text-sm text-navy-700 whitespace-pre-wrap">{it.minutes_text}</p>}
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
