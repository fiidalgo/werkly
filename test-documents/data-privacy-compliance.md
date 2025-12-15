# Data Privacy & Compliance

## Overview

Werkly takes data privacy seriously. This guide covers our policies, compliance standards, and engineer responsibilities.

## Data We Collect

### User Data

**Authentication** (via Supabase Auth):
- Email address
- Hashed password (not plaintext!)
- Login timestamps
- Session tokens

**Profile Data**:
- Company association
- User metadata (is_employer flag)
- Account creation date

**Usage Data**:
- Conversations and messages
- Documents uploaded
- Search queries
- Feature usage

### Company Data

**Documents**:
- File contents (PDF, DOCX, TXT, MD)
- File metadata (name, size, type)
- Upload timestamp and uploader

**Embeddings**:
- Text chunks from documents
- Vector embeddings (1536-dimensional)
- Chunk metadata

**Analytics** (Future):
- Aggregate usage stats
- Popular questions
- Document effectiveness

## How We Store Data

### Encryption

**At rest**:
- Database: AES-256 encryption (Supabase default)
- File storage: Encrypted (Supabase Storage)
- Backups: Encrypted

**In transit**:
- All connections use TLS 1.2+
- HTTPS everywhere
- No unencrypted HTTP

### Data Location

**Primary**: US-West (Supabase region: us-west-1)

**Backups**: 
- Same region
- Daily automated backups
- 7-day retention (extendable)

**Future**: Regional options for international customers

## Data Isolation

### Multi-Tenancy Architecture

**Company-level isolation**:
- Every table has `company_id` foreign key
- Row Level Security (RLS) enforces access
- No cross-company queries possible

**User-level isolation**:
- Users can only access their own conversations
- Employers can see company data (documents, employees)
- Employees can only see company documents (not employee list)

### RLS Policies

Example policy ensuring isolation:

```sql
CREATE POLICY "company_isolation" ON documents
  FOR SELECT TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid()
    )
  );
```

**Result**: Users literally cannot query other companies' data

## Data Retention

### Active Data

**Retained indefinitely** while account active:
- User profiles
- Conversations
- Documents
- Embeddings

### Deleted Data

**When user deletes**:
- Soft delete (marked as deleted, retained 30 days)
- Hard delete after 30 days (unrecoverable)

**When account closed**:
- 30-day grace period (can restore)
- Then permanently deleted
- Cascade deletes (all user data removed)

### Backups

**Retained for**:
- Daily backups: 7 days
- Weekly backups: 30 days (Pro plan)
- Compliance backups: 7 years (Enterprise only)

## Third-Party Services

### OpenAI

**What we send**:
- User questions (chat queries)
- Document text (for embeddings)
- Context chunks (for RAG)

**What they store**:
- Nothing (opted out of training)
- 30-day security retention (default)

**Data Processing Agreement**: Yes (signed)

**Compliance**: SOC 2, GDPR compliant

### Supabase

**What they store**:
- All database data
- Auth sessions
- File storage

**Encryption**: AES-256 at rest, TLS in transit

**Compliance**: SOC 2, ISO 27001, GDPR, HIPAA (available)

**Data Processing Agreement**: Yes (automatically via their terms)

### Vercel

**What they store**:
- Application logs (7 days)
- Build logs (30 days)
- Analytics data (90 days)

**No user data** stored long-term

**Compliance**: SOC 2, GDPR compliant

## GDPR Compliance

### User Rights

**Right to access**:
- Users can export all their data
- Request via support@werkly.com
- Provided within 30 days

**Right to deletion**:
- Users can delete account anytime
- Settings → Account → Delete Account
- Or email support@werkly.com

**Right to portability**:
- Export conversations as JSON
- Export documents (original files)
- API access for data export (future)

**Right to rectification**:
- Users can update their profile anytime
- Employers can update company data

### Lawful Basis

**Consent**: For marketing emails (optional)
**Contract**: For service delivery (required)
**Legitimate interest**: For product improvements (anonymized)

### Data Protection Officer

**Contact**: privacy@werkly.com

## SOC 2 Compliance

### Current Status

**In progress**: Type I audit scheduled for Q1 2025

**Controls implemented**:
- Access controls
- Encryption (at rest and in transit)
- Audit logging
- Incident response procedures
- Vendor management

### Security Practices

**Access control**:
- Principle of least privilege
- Role-based access (employer vs employee)
- RLS policies at database level
- Regular access reviews

**Monitoring**:
- Error tracking (Vercel logs)
- Security alerts (Supabase)
- Anomaly detection (future)

**Incident response**:
- Documented procedures
- On-call rotation
- Post-mortem process

## Engineer Responsibilities

### Code Practices

**Always**:
- Validate user input
- Use parameterized queries (prevent SQL injection)
- Escape output (prevent XSS)
- Implement authentication checks
- Respect RLS policies
- Handle errors gracefully (don't leak sensitive info)

**Never**:
- Log passwords or tokens
- Commit secrets to git
- Bypass security checks
- Hard-code credentials
- Disable RLS without reason

### Data Handling

**Minimize collection**:
- Only collect data we need
- Don't store unnecessary PII
- Use aggregates when possible

**Secure processing**:
- Process in memory (don't write sensitive data to disk)
- Clear sensitive data after use
- Use secure APIs (TLS only)

**Audit trail**:
- Log access to sensitive data
- Log data modifications
- Retain logs for compliance

## Security Incidents

### If You Discover a Data Breach

**Immediately**:
1. **Don't panic**
2. **Don't investigate further** (preserve evidence)
3. **Email security@werkly.com** with:
   - What you found
   - When you found it
   - What data might be affected
   - Steps to reproduce

**We will**:
1. Acknowledge within 15 minutes
2. Investigate immediately
3. Notify affected users (if required)
4. Report to authorities (if required by law)
5. Document and learn

### Reporting Timeline

**GDPR**: 72 hours to report to supervisory authority
**CCPA**: "Without unreasonable delay"

## Customer Data Requests

### From Law Enforcement

**Process**:
1. Forward to legal@werkly.com
2. Legal reviews subpoena/warrant
3. Minimal disclosure (only what's required)
4. Notify customer (unless legally prohibited)

**We never**:
- Provide data without legal process
- Proactively search user data
- Cooperate with fishing expeditions

### From Customers

**Data export**: Provided within 30 days
**Data deletion**: Executed within 30 days
**Data correction**: Updated within 7 days

## Privacy by Design

### Principles

1. **Proactive not reactive**: Build privacy in from start
2. **Privacy by default**: Most restrictive settings default
3. **End-to-end security**: Every component secured
4. **Visibility and transparency**: Clear privacy policy
5. **User-centric**: Users control their data

### Examples at Werkly

- **RLS policies**: Can't forget to check permissions, database enforces
- **Company isolation**: Architected from day one
- **Encryption everywhere**: TLS and AES-256 default
- **Minimal collection**: Only collect what we need
- **User control**: Can delete account anytime

## Training Requirements

### All Employees

**Must complete**:
- Security awareness training (annually)
- GDPR fundamentals (annually)
- Phishing simulation (quarterly)

**Time**: ~2 hours per year

### Engineers

**Additional training**:
- Secure coding practices (onboarding)
- OWASP Top 10 (annually)
- RLS best practices (onboarding)

**Time**: +3 hours per year

## Data Processing Agreements

### With Customers

**Enterprise customers** sign DPA covering:
- Data processing terms
- Security measures
- Sub-processors (OpenAI, Supabase)
- Liability and indemnification

**Template**: legal@werkly.com

### With Vendors

We vet all vendors for:
- Security practices
- Compliance certifications
- Data handling policies
- Incident response procedures

**Current vendors**:
- ✅ OpenAI (DPA signed, SOC 2, GDPR)
- ✅ Supabase (DPA signed, SOC 2, GDPR, ISO 27001)
- ✅ Vercel (DPA signed, SOC 2, GDPR)

## Privacy Policy

### Key Points

**What we collect**:
- Account info (email)
- Usage data (conversations, searches)
- Company documents (uploaded by employers)

**How we use it**:
- Provide service
- Improve product
- Customer support
- Security

**What we don't do**:
- Sell data (never)
- Train AI on your data (opted out)
- Share with third parties (except sub-processors)
- Use for advertising

**Full policy**: https://werkly.com/privacy

## Questions?

### For Users

- Privacy policy: https://werkly.com/privacy
- Data export: support@werkly.com
- Account deletion: Settings → Account

### For Engineers

- Security questions: #security Slack
- Privacy questions: privacy@werkly.com
- Compliance: compliance@werkly.com
- Ask Werkly AI!

## Resources

- GDPR guide: https://gdpr.eu
- CCPA guide: https://oag.ca.gov/privacy/ccpa
- OWASP: https://owasp.org
- Supabase RLS docs: https://supabase.com/docs/guides/auth/row-level-security

---

**Last Updated**: December 2024
**Maintainer**: Security & Compliance Team
**Classification**: Internal - Required Reading
