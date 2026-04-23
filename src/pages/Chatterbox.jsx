/**
 * Chatterbox archive — structure only. Issues to be supplied by the Club.
 */
export default function Chatterbox() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">Chatterbox</h1>
        <p className="mt-2 text-sm text-navy-500">Content for this page will be provided by the Club.</p>
      </header>

      <div className="mt-10 space-y-6">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900">Current issue</h2>
          <p className="mt-3 text-navy-700 leading-relaxed italic text-sm">
            [Placeholder — current Chatterbox issue to be supplied.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900">Past issues</h2>
          <p className="mt-3 text-navy-700 leading-relaxed italic text-sm">
            [Placeholder — archive of past issues to be supplied.]
          </p>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-navy-900">Special issues</h2>
          <p className="mt-3 text-navy-700 leading-relaxed italic text-sm">
            [Placeholder — special issues to be supplied.]
          </p>
        </div>
      </div>
    </section>
  )
}
