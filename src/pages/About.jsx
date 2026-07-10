import { Link } from 'react-router-dom'

// Verbatim body text from Anelia's PDF page 2
const BODY_PARAGRAPHS = [
  `The Sydney Model Shipbuilders Club is an active group of enthusiasts passionate about model ship building.`,
  `The Club supports all forms of marine modelling from period to modern vessels. It encourages members and visitors to discover and learn the various model ship building techniques.`,
  `Visitors, especially beginners are always welcomed.`,
  `The club holds regular monthly meetings where members and visitors can share modelling experiences, tips and techniques. They have the opportunity to discuss aspects of model ship building and to present their models and projects at various stages of construction.`,
  `Click on "Calendar" below for meeting dates`,
  `Whether you're an experienced modeller or starting out on the wonderful world of model ship building, attending the club will expand your knowledge of modelling techniques and further develop your skills.`,
  `A highlight of the year is a Festival of Model Ships that is hosted by the members of SMSC and includes other clubs exhibiting models across a weekend at Wests Ashfield. Click on "Events" below.`,
  `To enjoy the many photographs of the excellent models built by our members click on "Gallery" below.`,
  `Our Club publishes a regular newsletter called Chatterbox click on "Newsletter" below. It's packed with interesting modelling tips, techniques, reports on the regular meetings and the progress made by members on their projects.`,
]

const LEFT_PHOTOS = [
  { src: './images/anelia-28jun/Club_Info_Page_Photo_Compilation.jpeg', alt: 'Club activity compilation — members, models and workshop' },
]

const RIGHT_PHOTOS = [
  { src: './images/anelia-28jun/Images_on_Brochure_for_Info_Page_.jpeg', alt: 'Model ship compilation from Club brochure' },
]

export default function About() {
  return (
    <section className="max-w-[1400px] mx-auto px-2 py-4">
      <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1.2fr_1.4fr] gap-4 items-start">

        <div>
          {LEFT_PHOTOS.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              className="w-full h-auto object-contain block"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        <div className="space-y-4 text-navy-800 leading-relaxed text-[0.95rem]">
          {BODY_PARAGRAPHS.map((para, i) => {
            if (para.includes('"Calendar"')) {
              return (
                <p key={i}>
                  Click on{' '}
                  <Link to="/meetings" className="underline font-semibold text-navy-900 hover:text-red-700">
                    "Calendar"
                  </Link>{' '}
                  below for meeting dates
                </p>
              )
            }
            if (para.includes('"Events"')) {
              return (
                <p key={i}>
                  A highlight of the year is a Festival of Model Ships that is hosted by the members of SMSC and includes other clubs exhibiting models across a weekend at Wests Ashfield.{' '}
                  Click on{' '}
                  <Link to="/events" className="underline font-semibold text-navy-900 hover:text-red-700">
                    "Events"
                  </Link>{' '}
                  below.
                </p>
              )
            }
            if (para.includes('"Gallery"')) {
              return (
                <p key={i}>
                  To enjoy the many photographs of the excellent models built by our members click on{' '}
                  <Link to="/gallery" className="underline font-semibold text-navy-900 hover:text-red-700">
                    "Gallery"
                  </Link>{' '}
                  below.
                </p>
              )
            }
            if (para.includes('"Newsletter"')) {
              return (
                <p key={i}>
                  Our Club publishes a regular newsletter called Chatterbox — click on{' '}
                  <Link to="/chatterbox" className="underline font-semibold text-navy-900 hover:text-red-700">
                    "Newsletter"
                  </Link>{' '}
                  below. It's packed with interesting modelling tips, techniques, reports on the regular meetings and the progress made by members on their projects.
                </p>
              )
            }
            return <p key={i}>{para}</p>
          })}

          <div className="mt-6 pt-4 border-t border-navy-200 text-center">
            <p className="font-bold text-navy-900">
              Please email us if you would like to be a member.
            </p>
            <p className="mt-1 font-semibold text-navy-800">
              For any further information contact
            </p>
            <p className="font-bold text-navy-900">
              Michael Bennett mob:{' '}
              <a href="tel:+61411545770" className="underline hover:text-red-700">
                +61 411 545770
              </a>
            </p>
          </div>
        </div>

        <div>
          {RIGHT_PHOTOS.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              className="w-full h-auto object-contain block"
              loading="lazy"
            />
          ))}
        </div>

      </div>
    </section>
  )
}
