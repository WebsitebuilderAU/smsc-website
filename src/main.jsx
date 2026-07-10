import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import BriefLayout from './BriefLayout.jsx'
import BriefPage from './pages/BriefPage.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Meetings from './pages/Meetings.jsx'
import Chatterbox from './pages/Chatterbox.jsx'
import ExpoYear from './pages/ExpoYear.jsx'
import ShipDetail from './pages/ShipDetail.jsx'
import Contact from './pages/Contact.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminGallery from './admin/AdminGallery.jsx'
import AdminEvents from './admin/AdminEvents.jsx'
import AdminMeetings from './admin/AdminMeetings.jsx'
import AdminNewsletters from './admin/AdminNewsletters.jsx'
import AdminVideos from './admin/AdminVideos.jsx'
import AdminClubInfo from './admin/AdminClubInfo.jsx'
import AdminContactSubmissions from './admin/AdminContactSubmissions.jsx'
import AdminPages from './admin/AdminPages.jsx'
import './index.css'

// Public site now uses the real App layout (top navy band + real page bodies +
// bottom pill/wordmark strip) per Anelia's 7 Jul refinements. BriefPage image
// renderer is kept as a fallback for the pages we don't yet have HTML for
// (Events, Gallery, Contact).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="chatterbox" element={<Chatterbox />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="/" element={<BriefLayout />}>
          <Route path="events" element={<BriefPage pageNum={4} />} />
          <Route path="events/expo" element={<BriefPage pageNum={5} />} />
          <Route path="events/expo/:year" element={<BriefPage pageNum={6} />} />
          <Route path="gallery" element={<BriefPage pageNum={8} />} />
          <Route path="gallery/:id" element={<ShipDetail />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="meetings" element={<AdminMeetings />} />
          <Route path="newsletters" element={<AdminNewsletters />} />
          <Route path="videos" element={<AdminVideos />} />
          <Route path="club" element={<AdminClubInfo />} />
          <Route path="pages" element={<AdminPages />} />
          <Route path="contact" element={<AdminContactSubmissions />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
