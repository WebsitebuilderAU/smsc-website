// Placeholder gallery — uses the two real reference ship images we have on
// hand so the layout reads like Anelia's mock-up rather than an empty grid.
// Tiles are clearly marked "Sample tile" so members know to replace them.

import shipA from '../assets/img/ship_three_masted.jpg'
import shipB from '../assets/img/ship_gilded_stern.jpg'

export const galleryStub = [
  { id: 'sample-1', title: 'Three-masted clipper (sample)', builder: 'Sample tile', ship_type: 'Sailing ship', year: 2024, description: 'Replace with a real Club build.', image_url: shipA, featured: true },
  { id: 'sample-2', title: 'Gilded stern detail (sample)',  builder: 'Sample tile', ship_type: 'Detail study', year: 2024, description: 'Replace with a real Club build.', image_url: shipB, featured: true },
  { id: 'sample-3', title: 'Three-masted (sample)',         builder: 'Sample tile', ship_type: 'Sailing ship', year: 2023, description: 'Replace with a real Club build.', image_url: shipA, featured: false },
  { id: 'sample-4', title: 'Gilded stern (sample)',         builder: 'Sample tile', ship_type: 'Detail study', year: 2023, description: 'Replace with a real Club build.', image_url: shipB, featured: false },
  { id: 'sample-5', title: 'Three-masted (sample)',         builder: 'Sample tile', ship_type: 'Sailing ship', year: 2022, description: 'Replace with a real Club build.', image_url: shipA, featured: false },
  { id: 'sample-6', title: 'Gilded stern (sample)',         builder: 'Sample tile', ship_type: 'Detail study', year: 2022, description: 'Replace with a real Club build.', image_url: shipB, featured: false },
]
