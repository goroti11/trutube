/*
  # Seed Default Legal Documents
  
  Creates default legal documents for each domain:
  - Global Terms of Service
  - Live Streaming Terms
  - Gaming Division Rules
  - Wallet & TruCoins Terms
  
  These serve as placeholders and should be updated with real content.
*/

-- Global Terms
INSERT INTO legal_documents (domain, version, title, content_md, is_active)
VALUES (
  'global',
  '1.0.0',
  'GOROTI Terms of Service',
  '# GOROTI Terms of Service

## 1. Acceptance of Terms
By accessing and using GOROTI, you accept and agree to be bound by these Terms of Service.

## 2. User Conduct
Users must comply with all applicable laws and regulations.

## 3. Content Rights
Users retain ownership of content they upload but grant GOROTI necessary licenses.

## 4. Privacy
Please review our Privacy Policy to understand data collection practices.

## 5. Termination
GOROTI reserves the right to terminate accounts for violations.

*Last updated: 2026-02-23*',
  true
)
ON CONFLICT (domain, version) DO NOTHING;

-- Live Streaming Terms
INSERT INTO legal_documents (domain, version, title, content_md, is_active)
VALUES (
  'live',
  '1.0.0',
  'Live Streaming Terms & Guidelines',
  '# Live Streaming Terms & Guidelines

## 1. Broadcaster Requirements
- Must be 18+ years old
- Must comply with community guidelines
- Responsible for all content broadcast

## 2. Prohibited Content
- Illegal activities
- Harassment or hate speech
- Sexually explicit content
- Copyright infringement

## 3. Monetization
- TruCoins-based gift system
- Revenue share applies
- Minimum withdrawal thresholds

## 4. Moderation
- GOROTI reserves the right to terminate streams
- Violations may result in account suspension

## 5. Data and Analytics
- Stream analytics are provided as-is
- Viewer data subject to privacy policy

*Last updated: 2026-02-23*',
  true
)
ON CONFLICT (domain, version) DO NOTHING;

-- Gaming Division Rules
INSERT INTO legal_documents (domain, version, title, content_md, is_active)
VALUES (
  'gaming',
  '1.0.0',
  'Gaming Division Rules & Regulations',
  '# Gaming Division Rules & Regulations

## 1. Fair Play
- No cheating, exploits, or manipulation
- Anti-cheat systems are in place
- Violations result in immediate disqualification

## 2. Tournament Participation
- Entry fees are non-refundable
- Must meet eligibility requirements
- Team composition rules apply

## 3. Prize Distribution
- Winners verified before payout
- TruCoins credited within 7 days
- Tax implications are player responsibility

## 4. Sanctions
- Warnings for minor violations
- Temporary bans for moderate violations
- Permanent bans for severe violations

## 5. Dispute Resolution
- Report disputes within 24 hours
- GOROTI decision is final
- Appeals process available

## 6. Anti-Cheat
- All matches monitored
- Risk scoring applied
- Suspicious activity investigated

*Last updated: 2026-02-23*',
  true
)
ON CONFLICT (domain, version) DO NOTHING;

-- Wallet & TruCoins Terms
INSERT INTO legal_documents (domain, version, title, content_md, is_active)
VALUES (
  'wallet',
  '1.0.0',
  'Wallet & TruCoins Terms',
  '# Wallet & TruCoins Terms

## 1. Virtual Currency
- TruCoins are virtual currency with no real-world value
- Cannot be exchanged for cash
- Used within GOROTI ecosystem only

## 2. Purchases
- All purchases are final
- No refunds unless required by law
- Pricing subject to change

## 3. Wallet Security
- Users responsible for account security
- Report unauthorized transactions immediately
- GOROTI not liable for user negligence

## 4. Transfers
- Peer-to-peer transfers allowed
- Transaction fees may apply
- Reversals not supported

## 5. Compliance
- KYC verification may be required
- Anti-fraud measures in place
- Suspicious activity monitored

*Last updated: 2026-02-23*',
  true
)
ON CONFLICT (domain, version) DO NOTHING;