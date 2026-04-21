export default function Events() {
  const events = [
    { id: 1, title: 'Monthly Meeting',        date: 'First Wed monthly · 7:30 PM', location: 'Vaucluse Clubrooms', type: 'Meeting' },
    { id: 2, title: 'Annual EXPO (placeholder)', date: 'October 2026',                location: 'To be confirmed',   type: 'EXPO' },
    { id: 3, title: 'Workshop — Rigging basics', date: 'TBA',                         location: 'Clubrooms',         type: 'Workshop' },
  ]

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-display font-bold text-navy-900">Events</h1>
      <p className="mt-3 text-navy-600">
        Upcoming meetings, workshops and our annual EXPO. Visitors welcome — please email
        ahead for any non-member event.
      </p>

      <ul className="mt-10 space-y-4">
        {events.map(e => (
          <li key={e.id} className="bg-white rounded-lg shadow p-6 flex items-start gap-4">
            <span className="inline-block px-3 py-1 rounded text-xs font-semibold uppercase tracking-wide bg-brass-500 text-navy-900">
              {e.type}
            </span>
            <div>
              <h3 className="font-display text-xl text-navy-900">{e.title}</h3>
              <p className="text-navy-600 text-sm mt-1">{e.date}</p>
              <p className="text-navy-500 text-sm">{e.location}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-10 text-sm text-navy-500">
        The live events calendar will appear here once the admin panel is active.
      </p>
    </section>
  )
}
