-- 5B Tech Support — Full Database Schema
-- Run this against your Supabase Postgres instance via the SQL Editor.

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('member', 'admin', 'super_admin');
CREATE TYPE user_tier AS ENUM ('free', 'pro');
CREATE TYPE account_status AS ENUM ('email_unverified', 'active', 'past_due', 'canceled');
CREATE TYPE support_priority AS ENUM ('none', 'standard');
CREATE TYPE ticket_status AS ENUM ('open', 'awaiting_response', 'in_progress', 'resolved');
CREATE TYPE os_type AS ENUM ('windows11', 'macos');
CREATE TYPE sender_role AS ENUM ('user', 'agent', 'system');
CREATE TYPE deletion_status AS ENUM ('pending', 'approved', 'denied');

-- ============================================================
-- UTILITY: auto-update updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TABLES
-- ============================================================

-- 1. profiles
CREATE TABLE profiles (
  user_id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email              text NOT NULL,
  full_name          text,
  role               user_role NOT NULL DEFAULT 'member',
  tier               user_tier NOT NULL DEFAULT 'free',
  account_status     account_status NOT NULL DEFAULT 'email_unverified',
  support_priority   support_priority NOT NULL DEFAULT 'none',
  stripe_customer_id text UNIQUE,
  trial_expires_at   timestamptz,
  pro_trial_started_at timestamptz,
  is_complimentary_pro boolean NOT NULL DEFAULT false,
  onboarding_completed boolean NOT NULL DEFAULT false,
  notifications_enabled boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. subscriptions
CREATE TABLE subscriptions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  stripe_subscription_id  text UNIQUE NOT NULL,
  stripe_price_id         text NOT NULL,
  status                  text NOT NULL,
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean NOT NULL DEFAULT false,
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- 3. support_tickets
CREATE TABLE support_tickets (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  assigned_admin_id  uuid REFERENCES profiles(user_id) ON DELETE SET NULL,
  title              text NOT NULL,
  description        text NOT NULL,
  os_type            os_type,
  issue_category     text,
  priority           support_priority NOT NULL DEFAULT 'standard',
  status             ticket_status NOT NULL DEFAULT 'open',
  last_admin_reply_at timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_tickets_user_status ON support_tickets(user_id, status);
CREATE INDEX idx_tickets_assigned_admin ON support_tickets(assigned_admin_id);

-- 4. support_ticket_messages
CREATE TABLE support_ticket_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id   uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  sender_role sender_role NOT NULL DEFAULT 'user',
  body        text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_ticket_id ON support_ticket_messages(ticket_id);

-- 5. support_ticket_attachments
CREATE TABLE support_ticket_attachments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id     uuid NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  message_id    uuid REFERENCES support_ticket_messages(id) ON DELETE SET NULL,
  user_id       uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  storage_path  text NOT NULL,
  file_name     text NOT NULL,
  mime_type     text NOT NULL,
  size_bytes    bigint NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_attachments_ticket_id ON support_ticket_attachments(ticket_id);

-- 6. user_saved_guides
CREATE TABLE user_saved_guides (
  user_id    uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  guide_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, guide_slug)
);

-- 7. user_recent_guides
CREATE TABLE user_recent_guides (
  user_id    uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  guide_slug text NOT NULL,
  viewed_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, guide_slug)
);

-- 8. guides
CREATE TABLE guides (
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

CREATE INDEX idx_guides_slug ON guides(slug);
CREATE INDEX idx_guides_category ON guides(category);
CREATE INDEX idx_guides_tier ON guides(tier_required);
CREATE INDEX idx_guides_published ON guides(is_published);

-- 9. account_deletion_requests
CREATE TABLE account_deletion_requests (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  reason      text,
  status      deletion_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid REFERENCES profiles(user_id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER deletion_requests_updated_at
  BEFORE UPDATE ON account_deletion_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 9. audit_log
CREATE TABLE audit_log (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES profiles(user_id) ON DELETE SET NULL,
  action     text NOT NULL,
  metadata   jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user_action ON audit_log(user_id, action);
CREATE INDEX idx_audit_created ON audit_log(created_at);

-- 10. billing_access_grants (short-lived unlock after email OTP on billing)
CREATE TABLE billing_access_grants (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_billing_grants_user_expires
  ON billing_access_grants(user_id, expires_at);

-- ============================================================
-- ADDITIONAL INDEXES
-- ============================================================

CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id);
CREATE INDEX idx_profiles_tier ON profiles(tier);
