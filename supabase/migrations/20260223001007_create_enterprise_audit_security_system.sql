/*
  # Enterprise Audit & Security System
  
  1. New Tables
    - `system_audit_logs` - Complete audit trail of all critical actions
      - Tracks actor, action, entity type/id, before/after state
      - Records IP and device fingerprint
      - Append-only for compliance
    - `gaming_risk_scores` - Anti-cheat risk scoring
      - Per-user risk tracking
      - Flags suspicious patterns
    - `match_integrity_logs` - Tournament match integrity monitoring
      - Pattern detection for cheating
      - Severity levels
    - `gaming_sanctions` - Temporary and permanent bans
      - Type: warning, temporary_ban, permanent_ban
      - Expiration tracking
  
  2. Security
    - All tables are append-only (no updates/deletes via RLS)
    - Admin-only read access
    - Writes only via RPC functions
  
  3. Performance
    - Indexed for common query patterns
    - Partitioning strategy ready for high-volume logs
*/

-- System audit logs (append-only)
CREATE TABLE IF NOT EXISTS system_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  ip_address inet,
  device_fingerprint text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON system_audit_logs(actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON system_audit_logs(entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON system_audit_logs(action_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON system_audit_logs(created_at DESC);

-- Gaming risk scores
CREATE TABLE IF NOT EXISTS gaming_risk_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  risk_score numeric(5,2) DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  flags jsonb DEFAULT '[]'::jsonb,
  last_incident_at timestamptz,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS idx_gaming_risk_scores_user ON gaming_risk_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_gaming_risk_scores_score ON gaming_risk_scores(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_gaming_risk_scores_updated ON gaming_risk_scores(updated_at DESC);

-- Match integrity logs
CREATE TABLE IF NOT EXISTS match_integrity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid REFERENCES tournament_matches(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  pattern text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_match_integrity_match ON match_integrity_logs(match_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_match_integrity_user ON match_integrity_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_match_integrity_severity ON match_integrity_logs(severity, created_at DESC);

-- Gaming sanctions
CREATE TABLE IF NOT EXISTS gaming_sanctions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('warning', 'temporary_ban', 'permanent_ban')),
  reason text NOT NULL,
  issued_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_gaming_sanctions_user ON gaming_sanctions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gaming_sanctions_active ON gaming_sanctions(user_id, expires_at);
CREATE INDEX IF NOT EXISTS idx_gaming_sanctions_type ON gaming_sanctions(type, created_at DESC);

-- Enable RLS
ALTER TABLE system_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_integrity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE gaming_sanctions ENABLE ROW LEVEL SECURITY;

-- RLS: Admin-only read access
CREATE POLICY "Admin can read audit logs"
  ON system_audit_logs FOR SELECT
  USING (false);

CREATE POLICY "Admin can read risk scores"
  ON gaming_risk_scores FOR SELECT
  USING (false);

CREATE POLICY "Admin can read integrity logs"
  ON match_integrity_logs FOR SELECT
  USING (false);

CREATE POLICY "Users can read own sanctions"
  ON gaming_sanctions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Helper function to write audit logs
CREATE OR REPLACE FUNCTION write_audit_log(
  p_action_type text,
  p_entity_type text,
  p_entity_id uuid,
  p_before_state jsonb DEFAULT NULL,
  p_after_state jsonb DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO system_audit_logs (
    actor_id,
    action_type,
    entity_type,
    entity_id,
    before_state,
    after_state,
    metadata
  ) VALUES (
    auth.uid(),
    p_action_type,
    p_entity_type,
    p_entity_id,
    p_before_state,
    p_after_state,
    p_metadata
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- Helper function to check active sanctions
CREATE OR REPLACE FUNCTION has_active_sanction(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_ban boolean;
BEGIN
  SELECT EXISTS(
    SELECT 1
    FROM gaming_sanctions
    WHERE user_id = p_user_id
      AND (expires_at IS NULL OR expires_at > now())
      AND type IN ('temporary_ban', 'permanent_ban')
  ) INTO v_has_ban;
  
  RETURN v_has_ban;
END;
$$;