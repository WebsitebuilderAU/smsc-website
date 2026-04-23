import { useState } from 'react'

export default function Contact() {
  const [status, setStatus] = useState(null)

  function handleSubmit(e) {
    e.preventDefault()
    // Contact form will POST to Supabase contact_submissions (or email) once wired.
    setStatus('Thanks — your message has been received. We will reply within a few days.')
    e.target.reset()
  }

  return (
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
        <button type="submit" className="bg-brass-500 hover:bg-brass-600 text-navy-900 font-semibold px-6 py-2 rounded">
          Send message
        </button>
        {status && <p className="text-green-700 text-sm">{status}</p>}
      </form>

      <p className="mt-10 text-xs text-navy-500 italic">
        [Placeholder — club contact details and postal address to be supplied.]
      </p>
    </section>
  )
}
