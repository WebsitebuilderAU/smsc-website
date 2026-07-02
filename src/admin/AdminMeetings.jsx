import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { uploadToBucket, uploadMany } from './uploadHelpers.js'
import { uploadVideoToStream } from '../lib/stream.js'

const blank = {
  meeting_date: '', title: '', agenda: '', minutes_text: '', attendees: '',
  photos: [], video_url: '',
}

export default function AdminMeetings() {
  const [items, setItems] = useState([])
  const [form, setForm]   = useState(blank)
  const [pdf, setPdf]     = useState(null)
  const [photoFiles, setPhotoFiles] = useState([])
  const [videoFile, setVideoFile] = useState(null)
  const [msg, setMsg]     = useState('')
  const [busy, setBusy]   = useState(false)
  const [progress, setProgress] = useState('')
  const [editId, setEditId] = useState(null)

  async function load() {
    const { data } = await supabase.from('meeting_notes').select('*').order('meeting_date', { ascending: false })
    setItems((data || []).map(m => ({ ...m, photos: Array.isArray(m.photos) ? m.photos : [] })))
  }
  useEffect(() => { load() }, [])
  function reset() {
    setForm(blank); setPdf(null); setPhotoFiles([]); setVideoFile(null); setEditId(null); setProgress('')
  }

  async function save(e) {
    e.preventDefault(); setBusy(true); setMsg(''); setProgress('')
    try {
      // 1. Optional PDF
      let minutes_pdf
      if (pdf) {
        setProgress('Uploading PDF…')
        minutes_pdf = await uploadToBucket('meeting-minutes', pdf, form.meeting_date || 'misc')
      }

      // 2. Optional photos (many)
      let newPhotoUrls = []
      if (photoFiles.length) {
        setProgress(`Uploading ${photoFiles.length} photo${photoFiles.length > 1 ? 's' : ''}…`)
        newPhotoUrls = await uploadMany('meeting-photos', photoFiles, form.meeting_date || 'misc')
      }
      const combinedPhotos = [...(form.photos || []), ...newPhotoUrls]

      // 3. Optional video (Cloudflare Stream)
      let video_url
      if (videoFile) {
        setProgress(`Uploading video (${Math.round(videoFile.size/1024/1024)} MB) to Cloudflare Stream…`)
        const v = await uploadVideoToStream(videoFile)
        video_url = v.playback
      }

      // 4. Payload
      const payload = {
        meeting_date: form.meeting_date,
        title: form.title || null,
        agenda: form.agenda || null,
        minutes_text: form.minutes_text || null,
        attendees: form.attendees ? parseInt(form.attendees, 10) : null,
        photos: combinedPhotos,
        ...(minutes_pdf ? { minutes_pdf } : {}),
        ...(video_url ? { video_url } : (form.video_url ? { video_url: form.video_url } : {})),
      }
      const { error } = editId
        ? await supabase.from('meeting_notes').update(payload).eq('id', editId)
        : await supabase.from('meeting_notes').insert(payload)
      if (error) throw error
      setMsg(editId ? 'Meeting updated.' : 'Meeting saved.')
      reset(); load()
    } catch (err) { setMsg('Error: ' + err.message) }
    finally { setBusy(false); setProgress('') }
  }

  function edit(it) {
    setEditId(it.id)
    setForm({
      meeting_date: it.meeting_date || '',
      title: it.title || '',
      agenda: it.agenda || '',
      minutes_text: it.minutes_text || '',
      attendees: it.attendees || '',
      photos: Array.isArray(it.photos) ? it.photos : [],
      video_url: it.video_url || '',
    })
    setPdf(null); setPhotoFiles([]); setVideoFile(null)
  }

  async function remove(id) {
    if (!confirm('Delete this meeting record?')) return
    await supabase.from('meeting_notes').delete().eq('id', id)
    load()
  }

  function removePhoto(idx) {
    setForm(f => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }))
  }

  return (
    <div className="grid lg:grid-cols-[1fr,1.4fr] gap-8">
      <form onSubmit={save} className="bg-white rounded-lg border border-navy-200 p-6 space-y-4 self-start">
        <h2 className="font-display text-xl font-bold text-navy-900">{editId ? 'Edit meeting' : 'Record a meeting'}</h2>

        <Field label="Meeting date *">
          <input type="date" required value={form.meeting_date} onChange={e => setForm({...form, meeting_date: e.target.value})} className="input" data-testid="input-meeting-date" />
        </Field>
        <Field label="Title (optional)"><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" placeholder="Monthly meeting" /></Field>
        <Field label="Agenda"><textarea rows="3" value={form.agenda} onChange={e => setForm({...form, agenda: e.target.value})} className="input" /></Field>
        <Field label="Minutes (text)"><textarea rows="6" value={form.minutes_text} onChange={e => setForm({...form, minutes_text: e.target.value})} className="input" placeholder="Type minutes here, or upload a PDF below" /></Field>

        <Field label="Or upload minutes PDF">
          <input type="file" accept="application/pdf" onChange={e => setPdf(e.target.files[0] || null)} data-testid="input-meeting-pdf" />
        </Field>

        <Field label="Attendees count">
          <input type="number" value={form.attendees} onChange={e => setForm({...form, attendees: e.target.value})} className="input" />
        </Field>

        {/* Meeting photos */}
        <div className="bg-navy-50 border border-navy-200 rounded p-3">
          <label className="block">
            <span className="block text-sm font-medium text-navy-900 mb-1">Meeting photos (any number)</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={e => setPhotoFiles(Array.from(e.target.files || []))}
              className="block w-full text-sm text-navy-800 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-navy-800 file:text-white file:font-semibold file:cursor-pointer hover:file:bg-navy-700"
              data-testid="input-meeting-photos"
            />
            <span className="block text-xs text-navy-600 mt-1">
              JPG or PNG. Uploaded to Cloudflare R2 — the site pulls from there so no matter how many you add, the page stays fast.
            </span>
          </label>
          {photoFiles.length > 0 && (
            <p className="text-xs text-navy-800 mt-2">{photoFiles.length} new photo{photoFiles.length > 1 ? 's' : ''} ready to upload on Save.</p>
          )}
          {form.photos?.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              {form.photos.map((url, i) => (
                <div key={i} className="relative">
                  <img src={url} alt="" className="w-full aspect-square object-cover rounded border border-navy-200" />
                  <button type="button" onClick={() => removePhoto(i)} className="absolute top-0 right-0 bg-red-700 text-white text-xs px-1 rounded-bl" data-testid={`button-remove-photo-${i}`}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meeting video */}
        <div className="bg-navy-50 border border-navy-200 rounded p-3">
          <label className="block">
            <span className="block text-sm font-medium text-navy-900 mb-1">Meeting video (optional)</span>
            <input
              type="file"
              accept="video/*"
              onChange={e => setVideoFile(e.target.files[0] || null)}
              className="block w-full text-sm text-navy-800 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-navy-800 file:text-white file:font-semibold file:cursor-pointer hover:file:bg-navy-700"
              data-testid="input-meeting-video"
            />
            <span className="block text-xs text-navy-600 mt-1">
              Uploaded to Cloudflare Stream — no size limit, no site slowdown.
            </span>
          </label>
          {videoFile && <p className="text-xs text-navy-800 mt-1">Ready: {videoFile.name} ({Math.round(videoFile.size/1024/1024)} MB)</p>}
          {form.video_url && !videoFile && (
            <p className="text-xs text-navy-800 mt-1">
              Current video: <a href={form.video_url} target="_blank" rel="noreferrer" className="underline">open</a>
              <button type="button" onClick={() => setForm(f => ({...f, video_url: ''}))} className="ml-2 text-red-700 underline">remove</button>
            </p>
          )}
        </div>

        {progress && <p className="text-sm text-navy-800" data-testid="text-meeting-progress">⏳ {progress}</p>}
        {msg && (
          <p
            className={`text-sm rounded px-3 py-2 border ${msg.startsWith('Error') ? 'text-red-700 bg-red-50 border-red-200' : 'text-green-800 bg-green-50 border-green-200'}`}
            data-testid="text-meeting-message"
          >
            {msg}
          </p>
        )}
        <div className="flex gap-2">
          <button disabled={busy} className="btn-primary" data-testid="button-save-meeting">
            {busy ? 'Saving…' : (editId ? 'Update meeting' : 'Save meeting')}
          </button>
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
              {it.video_url ? <> · <a href={it.video_url} target="_blank" rel="noreferrer" className="underline">Video</a></> : ''}
              {it.photos?.length ? ` · ${it.photos.length} photos` : ''}
            </p>
            {it.agenda && <p className="mt-1 text-sm text-navy-700"><b>Agenda:</b> {it.agenda}</p>}
            {it.minutes_text && <p className="mt-1 text-sm text-navy-700 whitespace-pre-wrap">{it.minutes_text}</p>}
            {it.photos?.length > 0 && (
              <div className="mt-2 grid grid-cols-6 gap-1">
                {it.photos.slice(0, 6).map((url, i) => (
                  <img key={i} src={url} alt="" className="w-full aspect-square object-cover rounded" loading="lazy" />
                ))}
              </div>
            )}
            <div className="mt-2 flex gap-2">
              <button onClick={() => edit(it)} className="text-sm text-navy-700 underline" data-testid={`button-edit-meeting-${it.id}`}>Edit</button>
              <button onClick={() => remove(it.id)} className="text-sm text-red-700 underline" data-testid={`button-delete-meeting-${it.id}`}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Field({label, children}) { return <label className="block"><span className="block text-sm text-navy-800 mb-1">{label}</span>{children}</label> }
