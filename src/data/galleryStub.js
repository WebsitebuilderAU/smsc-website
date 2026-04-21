// Placeholder entries until the club's photos and records arrive from Anelia.
// No stock / random imagery — each card renders a neutral navy-and-brass tile
// with the ship name, builder and type. Real images will replace these from
// the Supabase gallery_items table once content is loaded.

// Real SMSC model ship photos from the club's own archive (smsc.org.au header).
// Ship names and maker credits pending — to be confirmed by the club and
// replaced here (or in Supabase) once supplied.
const BASE = (import.meta.env.BASE_URL || '/')

export const galleryStub = [
  {
    id: 'ship-01',
    title: 'First-rate ship of the line — gilded stern',
    builder: 'SMSC member build',
    ship_type: 'Ship of the Line',
    year: null,
    description: 'A richly carved and gilded stern section of a large first-rate man-of-war, photographed on display at a club exhibition. Ship name and model maker to be confirmed by the club.',
    image_url: `${BASE}images/ship_gilded_stern.jpg`,
    featured: true,
  },
  {
    id: 'ship-02',
    title: 'Three-masted square-rigged warship',
    builder: 'SMSC member build',
    ship_type: 'Ship of the Line',
    year: null,
    description: 'A fully-rigged three-masted square-rigger displayed at an SMSC meeting. Ship name and model maker to be confirmed by the club.',
    image_url: `${BASE}images/ship_three_masted.jpg`,
    featured: true,
  },
  {
    id: 'stub-3',
    title: 'Awaiting member upload',
    builder: '—',
    ship_type: 'Clipper',
    year: null,
    description: 'Member build — photos to be uploaded by the club.',
    image_url: null,
    featured: false,
  },
  {
    id: 'stub-4',
    title: 'Awaiting member upload',
    builder: '—',
    ship_type: 'Frigate',
    year: null,
    description: 'Member build — photos to be uploaded by the club.',
    image_url: null,
    featured: false,
  },
  {
    id: 'stub-5',
    title: 'Awaiting member upload',
    builder: '—',
    ship_type: 'Carrack',
    year: null,
    description: 'Member build — photos to be uploaded by the club.',
    image_url: null,
    featured: false,
  },
  {
    id: 'stub-6',
    title: 'Awaiting member upload',
    builder: '—',
    ship_type: 'Galleon',
    year: null,
    description: 'Member build — photos to be uploaded by the club.',
    image_url: null,
    featured: false,
  },
]
