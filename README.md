# SMSC Website

Rebuild of [smsc.org.au](https://smsc.org.au) for the Sydney Model Shipbuilders Club.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Routing:** React Router v6
- **Database:** Supabase (gallery, events, newsletters, videos)
- **Hosting:** Netlify
- **Video:** Cloudflare Stream (planned)
- **Email:** Zoho Mail (planned)

## Running locally

```bash
npm install
cp .env.example .env.local   # paste Supabase URL + anon key
npm run dev
```

Runs on http://localhost:5173

If `.env.local` is not set, the gallery falls back to built-in stub data
so the site still renders without the database wired up.

## Project structure

```
src/
  App.jsx              Layout (header, footer, nav)
  main.jsx             Router + entry
  pages/
    Home.jsx
    About.jsx
    Gallery.jsx        Searchable grid (stub → Supabase)
    Events.jsx
    Chatterbox.jsx     Newsletter archive
    Membership.jsx
    Contact.jsx
  lib/
    supabase.js        Client + live-mode detector
  data/
    galleryStub.js     Fallback gallery items
```

## Deployment

Netlify auto-deploys on push to `main`. Environment variables
(`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) are set in the Netlify dashboard.

Built and maintained by [Website Builder Australia](https://websitebuilderaustralia.com.au).
