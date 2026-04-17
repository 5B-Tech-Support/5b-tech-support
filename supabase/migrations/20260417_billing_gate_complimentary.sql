-- Complimentary Pro flag and short-lived billing access grants

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_complimentary_pro boolean NOT NULL DEFAULT false;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS pro_trial_started_at timestamptz;

CREATE TABLE IF NOT EXISTS billing_access_grants (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_billing_grants_user_expires
  ON billing_access_grants(user_id, expires_at);
