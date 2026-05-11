import { useEffect, useState } from 'react'
import { supabase, isLive } from '../lib/supabase.js'
import SubpageHeaderImage from '../components/SubpageHeaderImage.jsx'
import headerImg from '../assets/img/smsc_harbour_banner.jpg'

/**
 * About the Club & Membership — combined page per Anelia's T2 diagram.
 * Reads club_info (members count, blurb, venue) from Supabase. Holding copy
 * shown only when no values are loaded yet.
 */
export default function About() {
  const [info, setInfo] = useState(null)
  useEffect(() => {
    if (!isLive) return
    supabase.from('club_info').select('*').eq('id', 1).maybeSingle().then(({ data }) => setInfo(data))
  }, [])

  return (
    <>
    <SubpageHeaderImage label="About the Club & Membership" image={headerImg} />
    <section className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">About the Club &amp; Membership</h1>
        {!info && <p className="mt-2 text-sm text-navy-500">Content for this page is supplied by the Club.</p>}
      </header>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">About the Club</h2>
        {info?.blurb
          ? <p className="mt-3 text-navy-700 leading-relaxed whitespace-pre-wrap">{info.blurb}</p>
          : <p className="mt-3 text-navy-700 italic text-sm">[Club overview to be supplied.]</p>}
        {info?.members_count != null && (
          <p className="mt-4 text-navy-800">
            <span className="font-display text-3xl text-brass-600">{info.members_count}</span>
            <span className="ml-2 text-sm uppercase tracking-wider text-navy-600">members</span>
          </p>
        )}
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Meeting Venue</h2>
        {info?.venue_name
          ? <p className="mt-3 text-navy-700">
              <strong>{info.venue_name}</strong>
              {info.venue_address ? <><br />{info.venue_address}</> : null}
              {info.meeting_time ? <><br /><em>{info.meeting_time}</em></> : null}
            </p>
          : <p className="mt-3 text-navy-700 italic text-sm">[Venue to be supplied.]</p>}
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">How to Join</h2>
        <p className="mt-3 text-navy-700 leading-relaxed">
          {info?.contact_email
            ? <>To enquire about membership, please get in touch via the <a className="underline" href="/#/contact">contact form</a> or email <a className="underline" href={`mailto:${info.contact_email}`}>{info.contact_email}</a>.</>
            : <em className="text-sm">[Joining instructions to be supplied.]</em>}
        </p>
      </div>
    </section>
    </>
  )
}
