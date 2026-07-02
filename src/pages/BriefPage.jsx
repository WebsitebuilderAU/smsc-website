import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * BriefPage renders Anelia's InDesign layout.
 *
 * DESKTOP / landscape viewport:
 *   - Her 16:9 landscape brief image fills the viewport pixel-exact,
 *     with clickable hotspots for the nav pills, header, and page-specific tiles.
 *
 * PORTRAIT PHONE:
 *   - Rebuilt as a proper portrait layout using her assets and styling:
 *       [ Navy header band with SMSC wordmark + www pill ]
 *       [ Full-width landscape brief image (page content) ]
 *       [ Navy nav pill row — red-outlined, matches Anelia's brief ]
 *       [ Navy footer with wordmark ]
 *   - Users see everything upright in portrait without rotating the phone.
 */

// Nav labels/paths — pill row shown at bottom on all pages
const NAV_ITEMS = [
  { label: 'About',      path: '/about' },
  { label: 'Meetings',   path: '/meetings' },
  { label: 'Events',     path: '/events' },
  { label: 'Gallery',    path: '/gallery' },
  { label: 'Chatterbox', path: '/chatterbox' },
];

// Desktop hotspot map (percentages of the 16:9 design image)
const NAV_HOTSPOTS = [
  { path: '/about',       left: 6.3,  top: 85.0, width: 12.4, height: 4.7 },
  { path: '/meetings',    left: 22.8, top: 85.0, width: 10.1, height: 4.7 },
  { path: '/events',      left: 37.0, top: 85.0, width: 10.1, height: 4.7 },
  { path: '/gallery',     left: 51.3, top: 85.0, width: 10.1, height: 4.7 },
  { path: '/chatterbox',  left: 65.5, top: 85.0, width: 10.1, height: 4.7 },
  { path: 'mailto:info@smsc.org.au', left: 82.5, top: 85.0, width: 13.5, height: 4.7, external: true },
];

const HEADER_HOTSPOT = { path: '/', left: 41.9, top: 1.2, width: 14.6, height: 3.7 };

const PAGE_EXTRA_HOTSPOTS = {
  4: [
    { path: '/events/expo',      left: 55.2, top: 21.3, width: 25.6, height: 8.8 },
    { path: '/events/expo/2014', left: 55.2, top: 41.5, width: 25.6, height: 15.9 },
    { path: '/events/expo/2017', left: 55.2, top: 60.7, width: 25.6, height: 15.9 },
  ],
  5: [
    { path: '/events/expo/video',left: 4.5,  top: 22.3, width: 13.0, height: 5.6 },
    { path: '/events/expo/2025', left: 4.5,  top: 37.5, width: 13.0, height: 5.6 },
    { path: '/events/expo/2023', left: 4.5,  top: 55.0, width: 13.0, height: 5.6 },
    { path: '/events/expo/2022', left: 4.5,  top: 63.3, width: 13.0, height: 5.6 },
    { path: '/events/expo/2019', left: 4.5,  top: 73.4, width: 13.0, height: 5.6 },
    { path: '/events/expo/2018', left: 51.4, top: 28.5, width: 13.0, height: 5.6 },
    { path: '/events/expo/2017', left: 51.4, top: 37.0, width: 13.0, height: 5.6 },
    { path: '/events/expo/2016', left: 51.4, top: 45.6, width: 13.0, height: 5.6 },
    { path: '/events/expo/2015', left: 51.4, top: 54.0, width: 13.0, height: 5.6 },
    { path: '/events/expo/2014', left: 51.4, top: 62.7, width: 13.0, height: 5.6 },
    { path: '/events/expo/2013', left: 51.4, top: 71.4, width: 13.0, height: 5.6 },
  ],
};

const DESIGN_AR = 16 / 9;

function readViewport() {
  if (typeof window === 'undefined') return { w: 1600, h: 900, landscape: true };
  const vv = window.visualViewport;
  const w = vv ? vv.width : window.innerWidth;
  const h = vv ? vv.height : window.innerHeight;
  // Prefer matchMedia — it's the most reliable orientation signal on iOS/Android
  const mqLandscape = window.matchMedia && window.matchMedia('(orientation: landscape)').matches;
  return { w, h, landscape: mqLandscape };
}

function useViewport() {
  const [vp, setVp] = useState(readViewport);
  useEffect(() => {
    let raf = 0;
    const onChange = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setVp(readViewport()));
    };
    window.addEventListener('resize', onChange);
    window.addEventListener('orientationchange', onChange);
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onChange);
      window.visualViewport.addEventListener('scroll', onChange);
    }
    const mq = window.matchMedia && window.matchMedia('(orientation: landscape)');
    if (mq) {
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
    // Also poll a few times right after mount — iOS Safari sometimes reports stale sizes
    const t1 = setTimeout(onChange, 250);
    const t2 = setTimeout(onChange, 800);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', onChange);
      window.removeEventListener('orientationchange', onChange);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onChange);
        window.visualViewport.removeEventListener('scroll', onChange);
      }
      if (mq) {
        if (mq.removeEventListener) mq.removeEventListener('change', onChange);
        else if (mq.removeListener) mq.removeListener(onChange);
      }
    };
  }, []);
  return vp;
}

/* ============================================================
 * DESKTOP LAYOUT — pixel-exact copy of Anelia's PDF page
 * ============================================================ */
function DesktopView({ pageNum, extra, onNavigate, vw, vh, containerWidthPx, containerHeightPx }) {
  const allHotspots = [HEADER_HOTSPOT, ...NAV_HOTSPOTS, ...extra];
  let stageW, stageH;
  if (vw / vh > DESIGN_AR) {
    stageH = vh;
    stageW = vh * DESIGN_AR;
  } else {
    stageW = vw;
    stageH = vw / DESIGN_AR;
  }
  const usePx = containerWidthPx && containerHeightPx;
  return (
    <div
      style={{
        position: usePx ? 'absolute' : 'fixed',
        inset: usePx ? undefined : 0,
        top: usePx ? 0 : undefined,
        left: usePx ? 0 : undefined,
        width: usePx ? `${containerWidthPx}px` : '100vw',
        height: usePx ? `${containerHeightPx}px` : '100vh',
        backgroundColor: '#253f8e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${stageW}px`,
          height: `${stageH}px`,
          backgroundColor: '#253f8e',
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}brief_pages/page-${pageNum}.jpg`}
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
          }}
        />
        {allHotspots.map((spot, i) => (
          <button
            key={i}
            onClick={() => onNavigate(spot)}
            onTouchEnd={(e) => { e.preventDefault(); onNavigate(spot); }}
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
              touchAction: 'manipulation',
              WebkitTapHighlightColor: 'rgba(230,184,0,0.35)',
              pointerEvents: 'auto',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * PORTRAIT MOBILE LAYOUT — rebuilt for phones, upright, no rotation
 * ============================================================ */
function MobileView({ pageNum, onNavigate, onForceLandscape }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeAndGo = (spot) => {
    setMenuOpen(false);
    onNavigate(spot);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#253f8e',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        position: 'relative',
      }}
    >
      {/* Floating hamburger — image itself has the wordmark, so no duplicate header */}
      <button
        aria-label="Open menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(true)}
        style={{
          position: 'fixed',
          top: '0.7rem',
          right: '0.7rem',
          background: 'rgba(37,63,142,0.85)',
          border: '2px solid #c0392b',
          borderRadius: '8px',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          width: '2.4rem',
          height: '2.4rem',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
        }}
      >
        <span style={{ display: 'block', width: '1.2rem', height: '2px', background: 'white' }} />
        <span style={{ display: 'block', width: '1.2rem', height: '2px', background: 'white' }} />
        <span style={{ display: 'block', width: '1.2rem', height: '2px', background: 'white' }} />
      </button>

      {/* Page image — fit to width, sits below hamburger, image contains its own wordmark */}
      <div
        style={{
          background: '#253f8e',
          padding: '2.8rem 0 0',
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}brief_pages/page-${pageNum}.jpg`}
          alt=""
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
      </div>

      {/* Prominent tilt hint fills the empty space below the image */}
      <div
        style={{
          flex: '1 1 auto',
          background: '#253f8e',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem 1.5rem 0',
          color: '#e6b800',
          fontFamily: "'Cinzel', 'Trajan Pro', serif",
          textAlign: 'center',
          gap: '0.7rem',
        }}
      >
        <div style={{ fontSize: '2.2rem', lineHeight: 1 }}>↻</div>
        <div style={{ fontSize: '0.95rem', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.3 }}>
          Rotate to landscape<br/>for the full view
        </div>

        <button
          onClick={onForceLandscape}
          style={{
            marginTop: '1.1rem',
            background: 'transparent',
            color: '#e6b800',
            border: '2px solid #e6b800',
            borderRadius: '9999px',
            padding: '0.7rem 1.4rem',
            fontFamily: "'Cinzel', 'Trajan Pro', serif",
            fontSize: '0.85rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        >
          Or tap for landscape view
        </button>

        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.75)', fontFamily: "'Inter', system-ui, sans-serif", marginTop: '1rem', letterSpacing: 0, textTransform: 'none' }}>
          Tap the menu button (top right) to browse pages
        </div>
      </div>



      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 40 }}
        />
      )}

      <aside
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(78vw, 320px)',
          background: '#253f8e',
          boxShadow: '-4px 0 18px rgba(0,0,0,0.35)',
          zIndex: 50,
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem 1rem 1.5rem',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            borderBottom: '1px solid rgba(255,255,255,0.15)',
            paddingBottom: '0.65rem',
          }}
        >
          <span
            style={{
              fontFamily: "'Cinzel', 'Trajan Pro', serif",
              color: '#e6b800',
              fontSize: '0.9rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Menu
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              fontSize: '1.6rem',
              cursor: 'pointer',
              padding: '0 0.3rem',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <button onClick={() => closeAndGo({ path: '/' })} style={drawerPillStyle}>Home</button>
        {NAV_ITEMS.map((item) => (
          <button key={item.path} onClick={() => closeAndGo({ path: item.path })} style={drawerPillStyle}>
            {item.label}
          </button>
        ))}
        <a
          href="mailto:info@smsc.org.au"
          onClick={() => setMenuOpen(false)}
          style={{ ...drawerPillStyle, textDecoration: 'none', display: 'block' }}
        >
          Email — info@smsc.org.au
        </a>
      </aside>
    </div>
  );
}

const drawerPillStyle = {
  display: 'block',
  width: '100%',
  border: '2px solid #c0392b',
  borderRadius: '9999px',
  color: 'white',
  background: 'transparent',
  padding: '0.65rem 1rem',
  fontFamily: "'Inter', system-ui, sans-serif",
  fontSize: '0.9rem',
  fontWeight: 500,
  letterSpacing: '0.02em',
  cursor: 'pointer',
  textAlign: 'center',
  marginBottom: '0.55rem',
};

/* ============================================================
 * FORCED LANDSCAPE VIEW
 * ============================================================ */
function ForcedLandscapeView({ pageNum, extra, onNavigate, vw, vh, onExit }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeAndGo = (spot) => {
    setMenuOpen(false);
    onNavigate(spot);
  };
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${vh}px`,
        height: `${vw}px`,
        transform: `rotate(90deg) translateY(-${vw}px)`,
        transformOrigin: 'top left',
        background: '#253f8e',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      <DesktopView
        pageNum={pageNum}
        extra={extra}
        onNavigate={onNavigate}
        vw={vh}
        vh={vw}
        containerWidthPx={vh}
        containerHeightPx={vw}
      />

      <button
        aria-label="Open menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(true)}
        onTouchEnd={(e) => { e.preventDefault(); setMenuOpen(true); }}
        style={{
          position: 'absolute',
          top: '0.7rem',
          right: '0.7rem',
          background: 'rgba(37,63,142,0.92)',
          border: '2px solid #c0392b',
          borderRadius: '8px',
          padding: 0,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          width: '2.6rem',
          height: '2.6rem',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 30,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'rgba(230,184,0,0.4)',
        }}
      >
        <span style={{ display: 'block', width: '1.3rem', height: '2px', background: 'white' }} />
        <span style={{ display: 'block', width: '1.3rem', height: '2px', background: 'white' }} />
        <span style={{ display: 'block', width: '1.3rem', height: '2px', background: 'white' }} />
      </button>

      <button
        onClick={onExit}
        onTouchEnd={(e) => { e.preventDefault(); onExit(); }}
        aria-label="Back to portrait view"
        style={{
          position: 'absolute',
          top: '0.7rem',
          left: '0.7rem',
          background: 'rgba(37,63,142,0.92)',
          color: '#e6b800',
          border: '2px solid #e6b800',
          borderRadius: '9999px',
          padding: '0.5rem 1rem',
          fontFamily: "'Cinzel', 'Trajan Pro', serif",
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          zIndex: 30,
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'rgba(230,184,0,0.4)',
        }}
      >
        ✕ Portrait
      </button>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 40 }}
        />
      )}

      <aside
        aria-hidden={!menuOpen}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(60%, 300px)',
          background: '#253f8e',
          boxShadow: '-4px 0 18px rgba(0,0,0,0.4)',
          zIndex: 50,
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.25s ease',
          display: 'flex',
          flexDirection: 'column',
          padding: '0.9rem 1rem 1.2rem',
          overflowY: 'auto',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.15)',
          paddingBottom: '0.55rem',
        }}>
          <span style={{
            fontFamily: "'Cinzel', 'Trajan Pro', serif", color: '#e6b800',
            fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>Menu</span>
          <button
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            onTouchEnd={(e) => { e.preventDefault(); setMenuOpen(false); }}
            style={{
              background: 'transparent', border: 'none', color: 'white',
              fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.3rem', lineHeight: 1,
              touchAction: 'manipulation',
            }}
          >×</button>
        </div>

        <button
          onClick={() => closeAndGo({ path: '/' })}
          onTouchEnd={(e) => { e.preventDefault(); closeAndGo({ path: '/' }); }}
          style={{ ...drawerPillStyle, touchAction: 'manipulation' }}
        >Home</button>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            onClick={() => closeAndGo({ path: item.path })}
            onTouchEnd={(e) => { e.preventDefault(); closeAndGo({ path: item.path }); }}
            style={{ ...drawerPillStyle, touchAction: 'manipulation' }}
          >{item.label}</button>
        ))}
        <a
          href="mailto:info@smsc.org.au"
          onClick={() => setMenuOpen(false)}
          style={{ ...drawerPillStyle, textDecoration: 'none', display: 'block' }}
        >Email — info@smsc.org.au</a>
      </aside>
    </div>
  );
}

/* ============================================================ */

export default function BriefPage({ pageNum }) {
  const navigate = useNavigate();
  const { w: vw, h: vh, landscape: mqLandscape } = useViewport();
  const extra = PAGE_EXTRA_HOTSPOTS[pageNum] || [];
  const [forceLandscape, setForceLandscape] = useState(false);

  // If the phone actually rotates to landscape, cancel the manual override
  useEffect(() => {
    if (mqLandscape) setForceLandscape(false);
  }, [mqLandscape]);

  const onNavigate = (spot) => {
    if (spot.external) {
      window.location.href = spot.path;
    } else {
      navigate(spot.path);
    }
  };

  // Portrait phone = (matchMedia says portrait OR dimensions say portrait) AND viewport is narrow.
  // We show DesktopView (pixel-exact brief) as soon as the user rotates to landscape.
  const isPortraitPhone = !mqLandscape && vh > vw && vw < 900;

  // FORCED LANDSCAPE: user tapped the manual button because iOS rotation lock is on.
  // Rotate a rectangular wrapper 90° so it fills the physical portrait viewport.
  // The wrapper is sized in pixels (swap w/h) and DesktopView is given those explicit pixel dimensions.
  if (isPortraitPhone && forceLandscape) {
    return (
      <ForcedLandscapeView
        pageNum={pageNum}
        extra={extra}
        onNavigate={onNavigate}
        vw={vw}
        vh={vh}
        onExit={() => setForceLandscape(false)}
      />
    );
  }

  if (isPortraitPhone) {
    return <MobileView pageNum={pageNum} onNavigate={onNavigate} onForceLandscape={() => setForceLandscape(true)} />;
  }
  return <DesktopView pageNum={pageNum} extra={extra} onNavigate={onNavigate} vw={vw} vh={vh} />;
}
