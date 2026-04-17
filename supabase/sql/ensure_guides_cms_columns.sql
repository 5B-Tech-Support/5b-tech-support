-- Run this in the Supabase SQL Editor if you see:
--   "Could not find the 'video_url' column of 'guides' in the schema cache"
-- Omitting video/thumbnail still sends null for video_url from the app; the column must exist.

ALTER TABLE public.guides
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS video_url text;

-- Optional: refresh PostgREST schema (usually updates within ~1 minute after DDL).
-- In Dashboard: Settings → API → click "Reload schema" if errors persist.
