-- Migration: Create guides table
-- Run this in the Supabase SQL Editor if the table doesn't exist yet.

CREATE TABLE IF NOT EXISTS guides (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug               text UNIQUE NOT NULL,
  title              text NOT NULL,
  description        text NOT NULL,
  category           text NOT NULL,
  os_type            os_type NOT NULL DEFAULT 'windows11',
  tier_required      user_tier NOT NULL DEFAULT 'free',
  difficulty         text NOT NULL DEFAULT 'beginner',
  estimated_minutes  int NOT NULL DEFAULT 5,
  thumbnail_url      text,
  content            text NOT NULL DEFAULT '',
  is_published       boolean NOT NULL DEFAULT false,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER guides_updated_at
  BEFORE UPDATE ON guides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX IF NOT EXISTS idx_guides_slug ON guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_category ON guides(category);
CREATE INDEX IF NOT EXISTS idx_guides_tier ON guides(tier_required);
CREATE INDEX IF NOT EXISTS idx_guides_published ON guides(is_published);
