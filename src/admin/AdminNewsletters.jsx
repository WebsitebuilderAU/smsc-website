import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { uploadToBucket } from './uploadHelpers.js'

const blank = { title: '', issue_number: '', published_date: '' }

export default function AdminNewsletters() {
  const [items, setItems] = useState([])
  const [form, setForm]   = useState(blank)
  const [pdf, setPdf]     = useState(null)
  const [msg, setMsg]     = useState('')
  const [busy, setBusy]   = useState(false)

  async function load() {
    const { data } = await supabase.from('newsletters').select('*').order('published_date', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  async function save(e) {
    e.preventDefault(); setBusy(true); setMsg('')
    try {
      if (!pdf) throw new Error('Please choose a PDF file.')
      const pdf_url = await uploadToBucket('newsletters', pdf, 'chatterbox')
      const { error } = await supabase.from('newsletters').insert({
        title: form.title,
        issue_number: form.issue_number || null,
        published_date: form.published_date || null,
        pdf_url,
      })
      if (error) throw error
      setMsg('Newsletter uploaded.')
      setForm(blank); setPdf(null); load()
    } catch (err) { setMsg('Error: ' + err.message) }
    finally { setBusy(false) }
  }

  async function remove(id) {
    if (!confirm('Delete this newsletter? PDF stays in storage.')) return
    await supabase.from('newsletters').delete().eq('id', id)
    load()
  }

  return (
    <div className="grid lg:grid-cols-[1fr,1.4fr] gap-8">
      <form onSubmit={save} className="bg-white rounded-lg border border-navy-200 p-6 space-y-4 self-start">
        <h2 className="font-display text-xl font-bold text-navy-900">Upload Chatterbox</h2>
        <Field label="Title *"><input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" placeholder="Chatterbox — May 2026" /></Field>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Issue number"><input value={form.issue_number} onChange={e => setForm({...form, issue_number: e.target.value})} className="input" placeholder="Vol 24 #5" /></Field>
          <Field label="Published date"><input type="date" value={form.published_date} onChange={e => setForm({...form, published_date: e.target.value})} className="input" /></Field>
        </div>
        <Field label="PDF file *"><input type="file" accept="application/pdf" required onChange={e => setPdf(e.target.files[0] || null)} /></Field>
        {msg && <p className="text-sm text-navy-700 bg-navy-50 border border-navy-200 rounded px-3 py-2">{msg}</p>}
        <button disabled={busy} className="btn-primary">{busy ? 'Uploading…' : 'Upload newsletter'}</button>
      </form>

      <div className="space-y-3">
        <h2 className="font-display text-xl font-bold text-navy-900">Archive ({items.length})</h2>
        {items.length === 0 && <p className="text-navy-500 italic">No newsletters yet.</p>}
        {items.map(it => (
          <div key={it.id} className="bg-white border border-navy-200 rounded-lg p-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-navy-900">{it.title}</h3>
              <p className="text-xs text-navy-600">
                {it.issue_number ? `${it.issue_number} · ` : ''}
                {it.published_date ? new Date(it.published_date).toLocaleDateString('en-AU') : ''}
              </p>
              {it.pdf_url && <a href={it.pdf_url} target="_blank" rel="noreferrer" className="text-sm underline text-navy-700">Open PDF</a>}
            </div>
            <button onClick={() => remove(it.id)} className="text-sm text-red-700 underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({label, children}) { return <label className="block"><span className="block text-sm text-navy-800 mb-1">{label}</span>{children}</label> }
