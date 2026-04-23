/**
 * About the Club & Membership — combined page per Anelia's T2 diagram.
 * Content to be supplied by the Club (holding copy only until Anelia sends it).
 * Per Anelia: no committee list, no reference to the old site.
 */
export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">About the Club &amp; Membership</h1>
        <p className="mt-2 text-sm text-navy-500">Content for this page will be provided by the Club.</p>
      </header>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">About the Club</h2>
        <p className="mt-3 text-navy-700 leading-relaxed italic text-sm">
          [Placeholder — club overview to be supplied.]
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Membership</h2>
        <p className="mt-3 text-navy-700 leading-relaxed italic text-sm">
          [Placeholder — membership information to be supplied.]
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">How to Join</h2>
        <p className="mt-3 text-navy-700 leading-relaxed italic text-sm">
          [Placeholder — joining instructions to be supplied.]
        </p>
      </div>
    </section>
  )
}
