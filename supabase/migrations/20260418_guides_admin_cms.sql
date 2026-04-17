-- Soft delete + optional tutorial video URL for Manage Content CMS
ALTER TABLE guides
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz,
  ADD COLUMN IF NOT EXISTS video_url text;

-- Elevate legacy super_admin to admin (single product role for staff CMS)
UPDATE profiles SET role = 'admin'::user_role WHERE role = 'super_admin'::user_role;
