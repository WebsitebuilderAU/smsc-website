import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * BriefLayout — no header, no footer. Each route's element supplies its own
 * pixel-exact PDF page background via BriefPage. This mirrors Anelia's
 * InDesign PDF exactly, edge to edge.
 */
export default function BriefLayout() {
  return (
    <div style={{ background: '#253f8e', minHeight: '100vh' }}>
      <Outlet />
    </div>
  );
}
