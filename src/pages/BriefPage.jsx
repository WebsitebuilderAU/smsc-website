import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * BriefPage renders one of Anelia's InDesign PDF pages as a pixel-exact
 * background image with clickable hotspots overlaid.
 *
 * The image aspect ratio is 16:9 (1600x900). Hotspots are declared as
 * percentages so they scale with the viewport.
 *
 * Nav pill row (all pages, brief coordinates):
 *   y range: 85.0% - 89.7%
 *   pills at x: 6.3%-18.7% | 22.8%-32.9% | 37.0%-47.1% | 51.3%-61.4% | 65.5%-75.6%
 *   Email is right side at x: 82.5%-96%, same y range
 */

// Nav-pill hotspots — identical on every page
const NAV_HOTSPOTS = [
  { path: '/about',       left: 6.3,  top: 85.0, width: 12.4, height: 4.7 },
  { path: '/meetings',    left: 22.8, top: 85.0, width: 10.1, height: 4.7 },
  { path: '/events',      left: 37.0, top: 85.0, width: 10.1, height: 4.7 },
  { path: '/gallery',     left: 51.3, top: 85.0, width: 10.1, height: 4.7 },
  { path: '/chatterbox',  left: 65.5, top: 85.0, width: 10.1, height: 4.7 },
  { path: 'mailto:info@smsc.org.au', left: 82.5, top: 85.0, width: 13.5, height: 4.7, external: true },
];

// Header URL pill on every page
const HEADER_HOTSPOT = { path: '/', left: 41.9, top: 1.2, width: 14.6, height: 3.7 };

// Extra page-specific hotspots (for tiles/thumbnails inside body of certain pages)
const PAGE_EXTRA_HOTSPOTS = {
  4: [
    // Events page - Past EXPOs and year tiles
    { path: '/events/expo',     left: 55.2, top: 21.3, width: 25.6, height: 8.8 },  // "Past EXPOs"
    { path: '/events/expo/2014',left: 55.2, top: 41.5, width: 25.6, height: 15.9 }, // "2014 - Kids"
    { path: '/events/expo/2017',left: 55.2, top: 60.7, width: 25.6, height: 15.9 }, // "2017 - Villages"
  ],
  5: [
    // EXPO index — year pills
    { path: '/events/expo/video',left: 4.5, top: 22.3, width: 13.0, height: 5.6 },
    { path: '/events/expo/2025', left: 4.5, top: 37.5, width: 13.0, height: 5.6 },
    { path: '/events/expo/2023', left: 4.5, top: 55.0, width: 13.0, height: 5.6 },
    { path: '/events/expo/2022', left: 4.5, top: 63.3, width: 13.0, height: 5.6 },
    { path: '/events/expo/2019', left: 4.5, top: 73.4, width: 13.0, height: 5.6 },
    { path: '/events/expo/2018', left: 51.4, top: 28.5, width: 13.0, height: 5.6 },
    { path: '/events/expo/2017', left: 51.4, top: 37.0, width: 13.0, height: 5.6 },
    { path: '/events/expo/2016', left: 51.4, top: 45.6, width: 13.0, height: 5.6 },
    { path: '/events/expo/2015', left: 51.4, top: 54.0, width: 13.0, height: 5.6 },
    { path: '/events/expo/2014', left: 51.4, top: 62.7, width: 13.0, height: 5.6 },
    { path: '/events/expo/2013', left: 51.4, top: 71.4, width: 13.0, height: 5.6 },
  ],
};

export default function BriefPage({ pageNum }) {
  const navigate = useNavigate();
  const extra = PAGE_EXTRA_HOTSPOTS[pageNum] || [];
  const allHotspots = [HEADER_HOTSPOT, ...NAV_HOTSPOTS, ...extra];

  const goTo = (spot) => {
    if (spot.external) {
      window.location.href = spot.path;
    } else {
      navigate(spot.path);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1600px',
        aspectRatio: '16 / 9',
        margin: '0 auto',
        backgroundColor: '#253f8e',
      }}
    >
      <img
        src={`/brief_pages/page-${pageNum}.jpg`}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
      {allHotspots.map((spot, i) => (
        <button
          key={i}
          onClick={() => goTo(spot)}
          aria-label={spot.path}
          title={spot.path}
          style={{
            position: 'absolute',
            left: `${spot.left}%`,
            top: `${spot.top}%`,
            width: `${spot.width}%`,
            height: `${spot.height}%`,
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            zIndex: 5,
          }}
        />
      ))}
    </div>
  );
}
