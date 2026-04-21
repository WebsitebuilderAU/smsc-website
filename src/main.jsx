import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Gallery from './pages/Gallery.jsx'
import ShipDetail from './pages/ShipDetail.jsx'
import Meetings from './pages/Meetings.jsx'
import Events from './pages/Events.jsx'
import Chatterbox from './pages/Chatterbox.jsx'
import Contact from './pages/Contact.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="meetings" element={<Meetings />} />
          <Route path="events" element={<Events />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="gallery/:id" element={<ShipDetail />} />
          <Route path="chatterbox" element={<Chatterbox />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)
