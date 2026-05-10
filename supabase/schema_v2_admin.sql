-- SMSC schema additions — adds member ship pages, meeting notes, club_info, and
-- multiple photos per ship. Idempotent: safe to re-run.

-- ============ Gallery: extend for member contributions ============
-- Each ship can be contributed by an SMSC member with their own photos and
-- write-up, per the Club spec.
alter table public.gallery_items
  add column if not exists slug          text unique,
  add column if not exists photos        jsonb default '[]'::jsonb,  -- array of public URLs
  add column if not exists member_name   text,
  add column if not exists member_email  text,
  add column if not exists scale         text,                       -- e.g. 1:96
  add column if not exists era           text,                       -- e.g. WWII / Age of Sail
  add column if not exists updated_at    timestamptz default now();

create index if not exists gallery_items_slug_idx on public.gallery_items (slug);
create index if not exists gallery_items_era_idx  on public.gallery_items (era);

-- ============ Meeting notes (separate from events calendar) ============
create table if not exists public.meeting_notes (
  id            uuid primary key default gen_random_uuid(),
  meeting_date  date not null,
  title         text,
  agenda        text,
  minutes_text  text,
  minutes_pdf   text,                  -- public URL to PDF
  attendees     int,
  created_at    timestamptz default now()
);
create index if not exists meeting_notes_date_idx on public.meeting_notes (meeting_date desc);

alter table public.meeting_notes enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where polname = 'public read meeting_notes') then
    create policy "public read meeting_notes" on public.meeting_notes for select using (true);
  end if;
end $$;

-- ============ Club info — single-row settings (members count, blurb, venue) ============
create table if not exists public.club_info (
  id             int primary key default 1,
  members_count  int,
  blurb          text,
  venue_name     text,
  venue_address  text,
  meeting_time   text,
  contact_email  text,
  updated_at     timestamptz default now(),
  constraint club_info_singleton check (id = 1)
);
insert into public.club_info (id) values (1) on conflict do nothing;

alter table public.club_info enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where polname = 'public read club_info') then
    create policy "public read club_info" on public.club_info for select using (true);
  end if;
end $$;

-- ============ Storage buckets (public read) ============
-- These are created via the Supabase dashboard if they don't already exist:
--   ship-photos     — public, used by gallery member uploads
--   newsletters     — public, PDFs for Chatterbox archive
--   meeting-minutes — public, PDFs for meeting notes
--   event-photos    — public, photos for events

-- ============ Authenticated write policies (admin-only) ============
-- Anyone signed in via Supabase Auth (Anelia + future committee) can write.
-- The site has only one admin login via /admin so this is effectively the
-- club account.
do $$ begin
  if not exists (select 1 from pg_policies where polname = 'auth write gallery') then
    create policy "auth write gallery"     on public.gallery_items   for all  to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'auth write events') then
    create policy "auth write events"      on public.events          for all  to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'auth write newsletters') then
    create policy "auth write newsletters" on public.newsletters     for all  to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'auth write videos') then
    create policy "auth write videos"      on public.videos          for all  to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'auth write pages') then
    create policy "auth write pages"       on public.pages           for all  to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'auth write meeting_notes') then
    create policy "auth write meeting_notes" on public.meeting_notes for all  to authenticated using (true) with check (true);
  end if;
  if not exists (select 1 from pg_policies where polname = 'auth write club_info') then
    create policy "auth write club_info"   on public.club_info       for all  to authenticated using (true) with check (true);
  end if;
end $$;
