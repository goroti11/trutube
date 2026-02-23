/*
  # Enterprise Compliance & Legal System
  
  1. New Tables
    - `legal_documents` - Global and division-specific terms/policies
      - Supports domains: global, live, gaming, wallet, premium, community
      - Versioned documents with activation tracking
    - `legal_acceptances` - User acceptance tracking
      - Records user_id, document_id, timestamp, IP, device fingerprint
      - Audit trail for compliance
  
  2. Security
    - Enable RLS on all tables
    - Users can read active documents
    - Users can only create acceptances for themselves
    - Users can read their own acceptance history
    - Only service role can manage documents
  
  3. Notes
    - This system enforces gating for Live Studio and Gaming Division
    - Required before users can access restricted features
*/

-- Legal documents table
CREATE TABLE IF NOT EXISTS legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL CHECK (domain IN ('global', 'live', 'gaming', 'wallet', 'premium', 'community')),
  version text NOT NULL,
  title text NOT NULL,
  content_url text,
  content_md text,
  is_active boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(domain, version)
);

CREATE INDEX IF NOT EXISTS idx_legal_documents_domain_active ON legal_documents(domain, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_legal_documents_created ON legal_documents(created_at DESC);

-- Legal acceptances table
CREATE TABLE IF NOT EXISTS legal_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES legal_documents(id) ON DELETE CASCADE,
  accepted_at timestamptz DEFAULT now(),
  ip_address inet,
  device_fingerprint text,
  UNIQUE(user_id, document_id)
);

CREATE INDEX IF NOT EXISTS idx_legal_acceptances_user ON legal_acceptances(user_id);
CREATE INDEX IF NOT EXISTS idx_legal_acceptances_document ON legal_acceptances(document_id);
CREATE INDEX IF NOT EXISTS idx_legal_acceptances_accepted_at ON legal_acceptances(accepted_at DESC);

-- Enable RLS
ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_acceptances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for legal_documents
CREATE POLICY "Anyone can read active legal documents"
  ON legal_documents FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role can manage legal documents"
  ON legal_documents FOR ALL
  USING (false);

-- RLS Policies for legal_acceptances
CREATE POLICY "Users can read own acceptances"
  ON legal_acceptances FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own acceptances"
  ON legal_acceptances FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Helper function to check if user has accepted required documents for a domain
CREATE OR REPLACE FUNCTION check_legal_acceptance(p_user_id uuid, p_domain text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_required_count int;
  v_accepted_count int;
BEGIN
  -- Count active documents for domain
  SELECT COUNT(*)
  INTO v_required_count
  FROM legal_documents
  WHERE domain = p_domain
    AND is_active = true;
  
  -- Count user acceptances for domain
  SELECT COUNT(DISTINCT la.document_id)
  INTO v_accepted_count
  FROM legal_acceptances la
  JOIN legal_documents ld ON la.document_id = ld.id
  WHERE la.user_id = p_user_id
    AND ld.domain = p_domain
    AND ld.is_active = true;
  
  RETURN v_accepted_count >= v_required_count;
END;
$$;