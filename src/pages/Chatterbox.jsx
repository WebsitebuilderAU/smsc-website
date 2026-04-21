export default function Chatterbox() {
  const issues = [
    { id: 1, title: 'Chatterbox — Autumn 2026', date: '2026-03-01' },
    { id: 2, title: 'Chatterbox — Summer 2025', date: '2025-12-01' },
    { id: 3, title: 'Chatterbox — Spring 2025', date: '2025-09-01' },
  ]

  return (
    <section className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-display font-bold text-navy-900">The Chatterbox Archive</h1>
      <p className="mt-3 text-navy-600">
        The club's quarterly newsletter — build reports, meeting notes, EXPO coverage and
        technique articles. Click any issue to read it online.
      </p>

      <ul className="mt-10 divide-y divide-navy-200 bg-white rounded-lg shadow">
        {issues.map(i => (
          <li key={i.id} className="p-5 flex items-center justify-between hover:bg-navy-50">
            <div>
              <h3 className="font-display text-lg text-navy-900">{i.title}</h3>
              <p className="text-sm text-navy-500">
                Published {new Date(i.date).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button className="text-brass-600 font-semibold hover:underline">
              Read →
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-sm text-navy-500">
        Full archive will be searchable once historic issues are uploaded.
      </p>
    </section>
  )
}
