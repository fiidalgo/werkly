# Security Best Practices at Werkly

## Overview

Security is paramount at Werkly. This guide outlines required security practices for all engineers.

## Authentication & Authorization

### Never Expose Secrets

**❌ Bad**:
```typescript
const API_KEY = "sk-1234567890abcdef"
```

**✅ Good**:
```typescript
const API_KEY = process.env.OPENAI_API_KEY
```

### Environment Variables

- **Client-side**: Prefix with `NEXT_PUBLIC_`
- **Server-only**: No prefix (service keys, DB credentials)
- **Never commit**: Add all secrets to `.env.local`, not `.env`

### Service Role Key Protection

The `SUPABASE_SERVICE_ROLE_KEY` bypasses ALL security policies.

**Only use it**:
- In API routes (server-side)
- For trusted system operations
- Never in client components

```typescript
// ✅ Safe - server-side API route
import { createServiceClient } from '@/lib/supabase/service'
const supabase = createServiceClient()

// ❌ NEVER - client component
"use client"
const supabase = createServiceClient() // DANGER!
```

## Row Level Security (RLS)

### Always Enable RLS

```sql
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;
```

Without RLS, all data is publicly accessible!

### Company Isolation

Every policy should filter by company:

```sql
CREATE POLICY "company_isolation" ON documents
  FOR SELECT TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );
```

### Test Your Policies

```bash
# Try accessing as different users
# Try accessing other companies' data
# Verify unauthorized access fails
```

## Input Validation

### Always Validate

```typescript
// ❌ Bad - trusts client input
const { filename } = await request.json()
await saveFile(filename)

// ✅ Good - validates
const { filename } = await request.json()

if (!filename || typeof filename !== 'string') {
  return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
}

if (filename.includes('../') || filename.includes('..\\')) {
  return NextResponse.json({ error: 'Path traversal detected' }, { status: 400 })
}

await saveFile(filename)
```

### Sanitize User Input

```typescript
import DOMPurify from 'dompurify'

// For HTML content
const clean = DOMPurify.sanitize(userInput)

// For SQL - use parameterized queries (Supabase does this automatically)
```

## File Upload Security

### Validate File Types

```typescript
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/markdown',
]

if (!ALLOWED_TYPES.includes(file.type)) {
  throw new Error('File type not allowed')
}
```

### Limit File Sizes

```typescript
const MAX_SIZE = 50 * 1024 * 1024 // 50MB

if (file.size > MAX_SIZE) {
  throw new Error('File too large')
}
```

### Scan for Malware

For production, integrate virus scanning:
- AWS Lambda with ClamAV
- Third-party services (VirusTotal API)
- Cloudflare Workers with malware detection

## API Security

### Rate Limiting

```typescript
// TODO: Implement rate limiting
// Consider: Upstash Rate Limit, Vercel KV, or custom solution

import { Ratelimit } from "@upstash/ratelimit"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
})

const { success } = await ratelimit.limit(userId)
if (!success) {
  return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
}
```

### CORS Configuration

Next.js handles CORS automatically, but be aware:

```typescript
// For external APIs, specify allowed origins
const response = new Response(data, {
  headers: {
    'Access-Control-Allow-Origin': 'https://werkly.com',
    'Access-Control-Allow-Methods': 'GET, POST',
  },
})
```

## Secrets Management

### Rotation Schedule

- **API Keys**: Rotate every 90 days
- **Database passwords**: Rotate every 30 days
- **Service accounts**: Review quarterly

### Where Secrets Live

- **Local dev**: `.env.local` (gitignored)
- **Vercel prod**: Environment variables dashboard
- **Team sharing**: Use 1Password or similar (never Slack/email)

## Common Vulnerabilities

### SQL Injection

**Risk**: Low (Supabase uses parameterized queries)

```typescript
// ✅ Safe - Supabase handles escaping
await supabase
  .from('users')
  .select()
  .eq('email', userInput) // Automatically escaped
```

### XSS (Cross-Site Scripting)

**Risk**: Medium (user-generated content)

```typescript
// ❌ Dangerous
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe - React escapes by default
<div>{userInput}</div>

// ✅ Safe - use markdown parser
<ReactMarkdown>{userInput}</ReactMarkdown>
```

### CSRF (Cross-Site Request Forgery)

**Risk**: Low (Supabase handles CSRF tokens)

Next.js and Supabase automatically protect against CSRF.

### Insecure Direct Object References (IDOR)

**Risk**: High (without RLS)

```typescript
// ❌ Bad - anyone can access any document
GET /api/documents/123

// ✅ Good - RLS ensures user can only access their company's docs
const { data } = await supabase
  .from('documents')
  .select()
  .eq('id', '123') // RLS automatically filters by company
```

## Logging & Monitoring

### What to Log

- ✅ Authentication attempts (success/failure)
- ✅ Authorization failures (403 errors)
- ✅ API errors (500 errors)
- ✅ Unusual patterns (many failed requests)

### What NOT to Log

- ❌ Passwords
- ❌ API keys
- ❌ Personal identifiable information (PII)
- ❌ Credit card numbers

### Example

```typescript
// ❌ Bad
console.log('User login:', email, password)

// ✅ Good
console.log('Login attempt:', email.replace(/@.*/, '@***'))
```

## Dependency Security

### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Review and update
npm outdated
```

### Dependabot

GitHub Dependabot automatically creates PRs for security updates. **Always review and merge promptly**.

## Incident Response

### If You Discover a Security Issue

1. **Don't panic**
2. **Don't share publicly** (no Slack, no GitHub issues)
3. **Email security@werkly.com immediately**
4. **Document what you found**
5. **Don't attempt to exploit it further**

### Responsible Disclosure

If someone reports a security issue to us:
1. Acknowledge within 24 hours
2. Validate the issue
3. Fix within 7 days for critical, 30 days for medium
4. Credit the reporter (if they want)
5. Publish security advisory after fix

## Security Checklist for PRs

Before submitting PR:

- [ ] No secrets in code
- [ ] Input validation on all user data
- [ ] RLS policies tested
- [ ] Error messages don't leak sensitive info
- [ ] File uploads validated and size-limited
- [ ] Authentication checked on protected endpoints
- [ ] No `console.log` with sensitive data
- [ ] Dependencies up to date (`npm audit`)

## Required Reading

All engineers must review:
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Supabase RLS docs: https://supabase.com/docs/guides/auth/row-level-security
- Next.js security best practices

## Questions?

- Slack: #security (monitored by Security team)
- Email: security@werkly.com
- Emergency: Page on-call security engineer

---

**Last Updated**: December 2024
**Maintainer**: Security Team
**Classification**: Internal - All Engineers
