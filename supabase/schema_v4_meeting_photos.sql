-- SMSC schema addition — meeting photo galleries + video linkage
-- Run this once in Supabase SQL editor (safe: uses IF NOT EXISTS).

-- 1. Add a photos column to meeting_notes (JSON array of public image URLs).
alter table public.meeting_notes
  add column if not exists photos jsonb default '[]'::jsonb;

-- 2. Optional: link a video (Cloudflare Stream playback URL) to a meeting.
alter table public.meeting_notes
  add column if not exists video_url text;

-- 3. Backfill nulls just in case.
update public.meeting_notes
  set photos = coalesce(photos, '[]'::jsonb)
  where photos is null;
