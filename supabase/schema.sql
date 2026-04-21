-- SMSC Website schema
-- Run in Supabase SQL editor, or via CLI on first deploy.

-- ============ Gallery ============
create table if not exists public.gallery_items (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  builder      text,
  ship_type    text,
  year         int,
  description  text,
  image_url    text,
  featured     boolean default false,
  created_at   timestamptz default now()
);
create index if not exists gallery_items_ship_type_idx on public.gallery_items (ship_type);
create index if not exists gallery_items_year_idx      on public.gallery_items (year);

-- ============ Events ============
create table if not exists public.events (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  event_date  timestamptz,
  location    text,
  event_type  text,  -- Meeting, EXPO, Workshop, Other
  created_at  timestamptz default now()
);

-- ============ Chatterbox newsletter archive ============
create table if not exists public.newsletters (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  issue_number   text,
  pdf_url        text,
  published_date date,
  created_at     timestamptz default now()
);

-- ============ Videos ============
create table if not exists public.videos (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text,
  embed_url     text,           -- Vimeo/YouTube embed URL
  cf_stream_id  text,           -- Cloudflare Stream UID (optional, future)
  thumbnail_url text,
  category      text,
  created_at    timestamptz default now()
);

-- ============ Page content (editable copy) ============
create table if not exists public.pages (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  title      text,
  content    text,
  updated_at timestamptz default now()
);

-- ============ Contact form submissions ============
create table if not exists public.contact_submissions (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz default now()
);

-- ============ Row Level Security ============
-- Public READ on all content tables; writes go via service_role only.
alter table public.gallery_items       enable row level security;
alter table public.events              enable row level security;
alter table public.newsletters         enable row level security;
alter table public.videos              enable row level security;
alter table public.pages               enable row level security;
alter table public.contact_submissions enable row level security;

create policy "public read gallery"     on public.gallery_items for select using (true);
create policy "public read events"      on public.events        for select using (true);
create policy "public read newsletters" on public.newsletters   for select using (true);
create policy "public read videos"      on public.videos        for select using (true);
create policy "public read pages"       on public.pages         for select using (true);

-- Contact form: anyone can INSERT, nobody can SELECT except admins (service_role bypass RLS anyway).
create policy "anyone submits contact" on public.contact_submissions for insert with check (true);
