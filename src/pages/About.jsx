import { Link } from 'react-router-dom'

/**
 * T2 About the Club & Membership — single combined page per Anelia's diagram.
 */
export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">About the Club &amp; Membership</h1>
      </header>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">About</h2>
        <p className="mt-3 text-navy-700 leading-relaxed">
          We are an active group of enthusiasts passionate about model
          shipbuilding. Members and visitors meet regularly to share modelling
          experiences, tips and techniques. The club helps and encourages
          members and visitors to discover and learn the various model ship
          building techniques used, and to see the results of the dedicated
          time and patience of applying those techniques.
        </p>
        <p className="mt-3 text-navy-700 leading-relaxed">
          All new members are very welcome. Visitors are encouraged to attend,
          bring current projects for discussion, and present their models at
          any stage of completion.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Meetings</h2>
        <ul className="mt-3 space-y-2 text-navy-700 list-disc pl-6">
          <li>Regular meetings at Wests Ashfield (primary venue)</li>
          <li>Endeavour Group Show &amp; Tell sessions at members' homes on weekends in "odd" months</li>
          <li>Occasional Zoom meetings</li>
          <li>Annual EXPO and Annual General Meeting</li>
        </ul>
        <p className="mt-3 text-sm text-navy-500">
          See the <Link to="/meetings" className="underline hover:text-brass-600">Meetings calendar</Link> for
          the next meeting date and venue.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Membership</h2>
        <p className="mt-3 text-navy-700 leading-relaxed">
          Membership is open to anyone with an interest in model shipbuilding —
          whether you're a first-time builder or a seasoned craftsman.
          Members receive the Chatterbox newsletter, access to the meeting
          calendar, and participation in the annual EXPO.
        </p>
        <p className="mt-3 text-navy-700">
          To enquire about joining, please <Link to="/contact" className="underline hover:text-brass-600">send us a message</Link>.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Committee</h2>
        <p className="mt-3 text-navy-700">
          The Executive Committee is elected annually at the AGM. Committee
          member details will appear here once supplied by the club.
        </p>
      </div>
    </section>
  )
}
