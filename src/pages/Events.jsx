import { expoVideoUrl, venue } from '../data/clubData.js'

/**
 * Events & EXPO page — content from smsc.org.au + Chatterbox EXPO issues.
 * Anelia's diagram: "2026 - 12th EXPO. 11 past EXPOs. Videos and Images to be
 * hosted on the site."
 */

// Direct links to the Chatterbox Special EXPO Issues (PDFs) for each past EXPO.
const pastExpos = [
  {
    year: 2023, title: 'EXPO 2023',
    pdf: 'https://www.smsc.org.au/imagesDB/wysiwyg/EXPO2023Issue.pdf',
  },
  {
    year: 2022, title: 'EXPO 2022',
    pdf: 'https://www.smsc.org.au/imagesDB/wysiwyg/ChatterboxEXPO2022Issue.pdf',
  },
  {
    year: 2019, title: 'EXPO 2019',
    pdf: 'https://www.smsc.org.au/imagesDB/wysiwyg/EXPO2019Issue.pdf',
  },
  {
    year: 2018, title: 'EXPO 2018',
    pdf: 'https://www.smsc.org.au/imagesDB/wysiwyg/EXPO2018Issuev.2REDUCED.pdf',
  },
  {
    year: 2017, title: 'EXPO 2017 — Part 1',
    pdf: 'https://www.smsc.org.au/imagesDB/wysiwyg/SpecialEXPO17Issue-Oct17Pt.1.pdf',
  },
  {
    year: 2017, title: 'EXPO 2017 — Part 2',
    pdf: 'https://www.smsc.org.au/imagesDB/wysiwyg/SpecialEXPO17Issue-Oct17Pt.2.pdf',
  },
  {
    year: 2016, title: 'EXPO 2016',
    pdf: 'https://www.smsc.org.au/imagesDB/wysiwyg/EXPO2016Issue.pdf',
  },
]

export default function Events() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <img
        src={`${import.meta.env.BASE_URL}images/smsc_header_ships.jpg`}
        alt="Model ships exhibited at a past SMSC EXPO"
        className="w-full h-48 md:h-64 object-cover rounded shadow-sm"
      />

      <header>
        <h1 className="text-4xl font-display font-bold text-navy-900">Events &amp; EXPO</h1>
        <p className="mt-3 text-navy-700 max-w-3xl">
          The club's annual <strong>Festival of Model Ship Building (EXPO)</strong> is
          our flagship event — an open exhibition of maritime and related models
          held at {venue.name}, {venue.address}. It is open to all members,
          visitors and other modelling clubs to exhibit maritime and related
          models.
        </p>
      </header>

      {/* Current event */}
      <div className="p-6 bg-navy-800 text-white rounded shadow">
        <p className="text-xs uppercase tracking-widest text-brass-400 font-semibold">
          Upcoming
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold">
          12th Annual EXPO — 2026
        </h2>
        <p className="mt-2 text-sm text-navy-100">
          Dates and programme will be published in Chatterbox and on the
          Meetings calendar. Start preparing your models.
        </p>
      </div>

      {/* AGM + Endeavour notes */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-5 bg-white rounded shadow-sm border border-navy-200">
          <h3 className="font-display text-lg font-bold text-navy-900">Annual General Meeting</h3>
          <p className="mt-2 text-sm text-navy-700">
            The AGM is held at {venue.name}. All positions on the Executive
            become vacant and are filled by volunteering for the following
            roles: President, Vice President, Secretary, Treasurer and
            Committee Members. The AGM is followed by a Trash &amp; Treasure sale
            of items surplus to members' needs, and — time permitting — a
            short Show &amp; Tell.
          </p>
        </div>
        <div className="p-5 bg-white rounded shadow-sm border border-navy-200">
          <h3 className="font-display text-lg font-bold text-navy-900">External Events</h3>
          <p className="mt-2 text-sm text-navy-700">
            The club also supports external events such as the Shipbuilders
            Heritage Walk (Brisbane Water Districts), Canberra Model
            Shipwrights Society EXPO and Hubertus Model Boat Club Open Day.
            Details published in Chatterbox.
          </p>
        </div>
      </div>

      {/* Recent EXPO video */}
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">
          Video from our most recent EXPO
        </h2>
        <div className="mt-4 aspect-video rounded overflow-hidden shadow-sm border border-navy-200">
          <iframe
            src="https://www.youtube.com/embed/gVjeEbTBzCc"
            title="SMSC most recent EXPO"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="mt-2 text-xs text-navy-500">
          <a href={expoVideoUrl} className="underline hover:text-brass-600">Watch on YouTube</a>
        </p>
      </div>

      {/* Past EXPOs */}
      <div>
        <h2 className="font-display text-2xl font-bold text-navy-900">Past EXPOs</h2>
        <p className="text-sm text-navy-500 mt-1">
          Special Chatterbox EXPO issues — full photo coverage of each year.
        </p>
        <ul className="mt-4 grid md:grid-cols-2 gap-3">
          {pastExpos.map((e, i) => (
            <li key={i} className="p-4 bg-white rounded shadow-sm border border-navy-200 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg text-navy-900">{e.title}</h3>
                <p className="text-xs text-navy-500">Chatterbox Special EXPO Issue</p>
              </div>
              <a
                href={e.pdf}
                target="_blank" rel="noopener noreferrer"
                className="text-brass-600 font-semibold hover:underline text-sm whitespace-nowrap"
              >
                Open PDF →
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
