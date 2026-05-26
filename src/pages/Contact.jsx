import { useState } from 'react'
import SubpageHeaderImage from '../components/SubpageHeaderImage.jsx'
import { supabase, isLive } from '../lib/supabase.js'
import headerImg from '../assets/img/smsc_header_ships.jpg'

export default function Contact() {
  const [status, setStatus] = useState(null)
  const [busy, setBusy]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setBusy(true); setStatus(null)
    const form    = e.target
    const name    = form.name.value.trim()
    const email   = form.email.value.trim()
    const message = form.message.value.trim()

    if (!name || !email || !message) {
      setStatus({ type: 'error', text: 'Please fill in all fields.' })
      setBusy(false)
      return
    }

    if (!isLive) {
      // No Supabase configured (dev fallback) — still acknowledge so the form is testable.
      setStatus({ type: 'ok', text: 'Thanks — your message has been received. We will reply within a few days.' })
      form.reset()
      setBusy(false)
      return
    }

    const { error } = await supabase
      .from('contact_submissions')
      .insert({ name, email, message })

    if (error) {
      setStatus({ type: 'error', text: 'Sorry — something went wrong sending your message. Please email us directly at secretary@smsc.org.au.' })
    } else {
      setStatus({ type: 'ok', text: 'Thanks — your message has been received. We will reply within a few days.' })
      form.reset()
    }
    setBusy(false)
  }

  return (
    <>
    <SubpageHeaderImage label="Contact Us" image={headerImg} />
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-display font-bold text-navy-900">Contact Us</h1>
      <p className="mt-3 text-navy-600">
        Questions about the club, membership, or coming along as a visitor? Send us a note.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 bg-white p-8 rounded-lg shadow space-y-5">
        <div>
          <label className="block text-sm font-semibold text-navy-900">Name</label>
          <input required name="name" className="mt-1 w-full px-4 py-2 rounded border border-navy-200 focus:outline-none focus:ring-2 focus:ring-brass-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-900">Email</label>
          <input required type="email" name="email" className="mt-1 w-full px-4 py-2 rounded border border-navy-200 focus:outline-none focus:ring-2 focus:ring-brass-500" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-900">Message</label>
          <textarea required name="message" rows="5" className="mt-1 w-full px-4 py-2 rounded border border-navy-200 focus:outline-none focus:ring-2 focus:ring-brass-500"></textarea>
        </div>
        <button type="submit" disabled={busy} className="bg-brass-500 hover:bg-brass-600 text-navy-900 font-semibold px-6 py-2 rounded disabled:opacity-60">
          {busy ? 'Sending…' : 'Send message'}
        </button>
        {status && (
          <p className={`text-sm ${status.type === 'ok' ? 'text-green-700' : 'text-red-700'}`}>
            {status.text}
          </p>
        )}
      </form>

      {/* Club contact details — sourced from the existing smsc.org.au site.
          Anelia to confirm during preview review. */}
      <div className="mt-12 bg-white p-8 rounded-lg shadow grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display font-bold text-navy-900 text-lg">By post</h2>
          <p className="mt-2 text-sm text-navy-700 leading-relaxed">
            Sydney Model Shipbuilders Club<br />
            c/o The Treasurer<br />
            2 Tulipwood Avenue<br />
            Oran Park NSW 2570
          </p>
        </div>
        <div>
          <h2 className="font-display font-bold text-navy-900 text-lg">By email</h2>
          <p className="mt-2 text-sm text-navy-700">
            <a href="mailto:secretary@smsc.org.au" className="underline hover:text-brass-600">
              secretary@smsc.org.au
            </a>
          </p>
          <h2 className="mt-6 font-display font-bold text-navy-900 text-lg">Committee</h2>
          <ul className="mt-2 text-sm text-navy-700 space-y-1">
            <li>President — Harry Goedings</li>
            <li>Vice President — Michael Bennett</li>
            <li>Secretary — Mike Kelly</li>
            <li>Treasurer — Ralph Hannaford</li>
          </ul>
        </div>
      </div>
    </section>
    </>
  )
}
