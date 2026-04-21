export default function Membership() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-display font-bold text-navy-900">Membership</h1>
      <p className="mt-6 text-lg text-navy-700 leading-relaxed">
        New members are always welcome, regardless of experience. Many of our most
        enthusiastic builders joined having never touched a model ship before.
      </p>

      <div className="mt-10 bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-display font-bold text-navy-900">Member benefits</h2>
        <ul className="mt-4 space-y-2 text-navy-700 list-disc list-inside">
          <li>Attend monthly meetings and workshops</li>
          <li>Access the club library and reference collection</li>
          <li>Receive the Chatterbox newsletter</li>
          <li>Mentoring support from experienced builders</li>
          <li>Exhibit at the annual EXPO</li>
          <li>Discounts from supplier partners</li>
        </ul>
      </div>

      <div className="mt-8 bg-navy-800 text-white rounded-lg p-8">
        <h2 className="text-2xl font-display font-bold">How to join</h2>
        <p className="mt-3">
          Email us at <a className="underline" href="mailto:info@smsc.org.au">info@smsc.org.au</a> or
          come along to a monthly meeting as a visitor. A formal membership form and fee
          details will be provided.
        </p>
      </div>
    </section>
  )
}
