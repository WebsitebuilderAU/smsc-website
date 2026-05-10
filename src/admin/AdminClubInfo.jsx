import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const blank = {
  members_count: '', blurb: '', venue_name: '', venue_address: '',
  meeting_time: '', contact_email: '',
}

export default function AdminClubInfo() {
  const [form, setForm] = useState(blank)
  const [msg, setMsg]   = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('club_info').select('*').eq('id', 1).maybeSingle()
      if (data) setForm({
        members_count: data.members_count ?? '',
        blurb: data.blurb ?? '',
        venue_name: data.venue_name ?? '',
        venue_address: data.venue_address ?? '',
        meeting_time: data.meeting_time ?? '',
        contact_email: data.contact_email ?? '',
      })
    })()
  }, [])

  async function save(e) {
    e.preventDefault(); setBusy(true); setMsg('')
    const payload = {
      id: 1,
      ...form,
      members_count: form.members_count === '' ? null : parseInt(form.members_count, 10),
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('club_info').upsert(payload)
    if (error) setMsg('Error: ' + error.message)
    else setMsg('Saved. Public site will reflect changes on next reload.')
    setBusy(false)
  }

  return (
    <form onSubmit={save} className="max-w-2xl bg-white rounded-lg border border-navy-200 p-6 space-y-4">
      <h2 className="font-display text-xl font-bold text-navy-900">Club information</h2>
      <p className="text-sm text-navy-600">Drives the home/About copy and footer venue block.</p>

      <Field label="Number of members">
        <input type="number" value={form.members_count} onChange={e => setForm({...form, members_count: e.target.value})} className="input" />
      </Field>
      <Field label="Short blurb (about the Club)">
        <textarea rows="4" value={form.blurb} onChange={e => setForm({...form, blurb: e.target.value})} className="input" />
      </Field>
      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Venue name"><input value={form.venue_name} onChange={e => setForm({...form, venue_name: e.target.value})} className="input" /></Field>
        <Field label="Meeting time"><input value={form.meeting_time} onChange={e => setForm({...form, meeting_time: e.target.value})} className="input" placeholder="2nd Saturday, 2pm" /></Field>
      </div>
      <Field label="Venue address"><input value={form.venue_address} onChange={e => setForm({...form, venue_address: e.target.value})} className="input" /></Field>
      <Field label="Public contact email"><input type="email" value={form.contact_email} onChange={e => setForm({...form, contact_email: e.target.value})} className="input" /></Field>

      {msg && <p className="text-sm text-navy-700 bg-navy-50 border border-navy-200 rounded px-3 py-2">{msg}</p>}
      <button disabled={busy} className="btn-primary">{busy ? 'Saving…' : 'Save'}</button>
    </form>
  )
}

function Field({label, children}) { return <label className="block"><span className="block text-sm text-navy-800 mb-1">{label}</span>{children}</label> }
