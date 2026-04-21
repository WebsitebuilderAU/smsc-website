import { Link } from 'react-router-dom'
import {
  committee, committeeMembers, membershipFees,
  bankDetails, venue,
} from '../data/clubData.js'

/**
 * About the Club & Membership — combined page per Anelia's diagram.
 * All content copied verbatim from the existing smsc.org.au site.
 */
export default function About() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">About the Club &amp; Membership</h1>
      </header>

      {/* ------------- About ------------- */}
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">About the SMSC</h2>
        <p className="mt-3 text-navy-700 leading-relaxed">
          The Sydney Model Shipbuilders Club helps and encourages members and
          visitors to discover and learn the various model ship building
          techniques used, and see the results of the dedicated time and
          patience of applying those techniques. Visitors are always welcome.
        </p>
        <p className="mt-3 text-navy-700 leading-relaxed">
          While our main focus is on wooden model ships we welcome all
          varieties of model ship construction.
        </p>
        <p className="mt-3 text-navy-700 leading-relaxed">
          Meetings begin at the time advertised, and members and visitors have
          the opportunity to discuss aspects of model ship building and to
          present their models and projects at various stages of completion.
          On some weekends in the "odd" months we meet at members' homes for a
          Show &amp; Tell — we call this the "Endeavour" Group. Dates and
          addresses are notified in Chatterbox and on the Meetings page.
        </p>
        <p className="mt-3 text-navy-700 leading-relaxed">
          We look forward to seeing you at our next meeting.
        </p>
        <p className="mt-3 text-sm text-navy-500">
          Please see the <Link to="/meetings" className="underline hover:text-brass-600">Meetings page</Link> for
          the next meeting date and other planned functions. Note that we
          occasionally change venue or use Zoom, so please check the Meetings
          page as it always has the most up-to-date information.
        </p>
      </div>

      {/* ------------- Committee ------------- */}
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Committee</h2>
        <p className="mt-2 text-sm text-navy-500">
          The Executive Committee is elected annually at the AGM.
        </p>
        <div className="mt-4 grid sm:grid-cols-2 gap-x-8 gap-y-2 bg-white p-6 rounded shadow-sm border border-navy-200">
          {committee.map((c, i) => (
            <div key={i} className="flex justify-between border-b border-navy-100 py-2 text-sm">
              <span className="text-navy-500">{c.role}</span>
              <span className="text-navy-900 font-medium">{c.name}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-navy-700">
          <span className="font-semibold">Committee Members:</span>{' '}
          {committeeMembers.join(', ')}.
        </p>
      </div>

      {/* ------------- Membership ------------- */}
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Membership</h2>
        <p className="mt-3 text-navy-700 leading-relaxed">
          Membership is open to anyone with an interest in model shipbuilding —
          whether you're a first-time builder or a seasoned craftsman.
          Members receive the Chatterbox newsletter, access to the meetings
          calendar, and participation in the annual EXPO.
        </p>

        <h3 className="mt-6 font-display text-lg font-bold text-navy-900">Fees</h3>
        <ul className="mt-2 divide-y divide-navy-100 bg-white rounded shadow-sm border border-navy-200">
          {membershipFees.map((f, i) => (
            <li key={i} className="px-4 py-3 flex justify-between text-sm">
              <span className="text-navy-700">{f.type}</span>
              <span className="text-navy-900 font-semibold">{f.fee}</span>
            </li>
          ))}
        </ul>

        <h3 className="mt-6 font-display text-lg font-bold text-navy-900">How to Join</h3>
        <p className="mt-2 text-navy-700">
          Membership applications are by direct deposit or cheque/money order.
          By applying you agree to abide by the rules and bylaws of the club.
        </p>

        <div className="mt-4 p-5 bg-navy-50 border border-navy-200 rounded text-sm space-y-1">
          <p className="font-display font-bold text-navy-900">Direct Deposit</p>
          <p>Account Name: <span className="font-semibold">{bankDetails.accountName}</span></p>
          <p>BSB: <span className="font-semibold">{bankDetails.bsb}</span></p>
          <p>Account No: <span className="font-semibold">{bankDetails.accountNo}</span></p>
          <p className="text-navy-500 mt-2">
            Use your name as the reference, then email the Treasurer to let us know.
          </p>
        </div>

        <div className="mt-4 p-5 bg-navy-50 border border-navy-200 rounded text-sm">
          <p className="font-display font-bold text-navy-900">Cheque or Money Order</p>
          <p className="mt-1 text-navy-700">
            Mail to: {bankDetails.postalAddress}
          </p>
        </div>

        <p className="mt-6 text-sm">
          <Link to="/contact" className="underline hover:text-brass-600">
            Send us a message →
          </Link> if you have any questions about joining.
        </p>
      </div>

      {/* ------------- Venue ------------- */}
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Meeting Venue</h2>
        <p className="mt-3 text-navy-700">
          <span className="font-semibold">{venue.name}</span><br />
          {venue.address}
        </p>
      </div>
    </section>
  )
}
