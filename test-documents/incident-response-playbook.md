# Incident Response Playbook

## Overview

This playbook guides our response to production incidents. Follow these procedures to minimize downtime and customer impact.

## Incident Severity Levels

### Sev 1 - Critical

**Definition**: Service completely unavailable or major security breach

**Examples**:
- App down for all users
- Database unavailable
- Data breach
- Authentication broken

**Response time**: Immediate (< 15 minutes)
**Page**: On-call engineer + CTO

### Sev 2 - High

**Definition**: Major feature broken affecting many users

**Examples**:
- Chat not working
- Document upload failing
- Slow API responses (> 10s)
- RAG returning no results

**Response time**: < 1 hour
**Page**: On-call engineer

### Sev 3 - Medium

**Definition**: Minor feature issues affecting some users

**Examples**:
- UI glitch on specific browser
- Intermittent errors (< 5% of requests)
- Slow but functional

**Response time**: < 4 hours
**Page**: No page, handled during business hours

### Sev 4 - Low

**Definition**: Cosmetic issues, low-impact bugs

**Examples**:
- Typo in UI
- Minor style issue
- Feature request

**Response time**: < 24 hours
**Page**: No page, handle via normal workflow

## Incident Response Process

### Step 1: Detection (0-5 minutes)

**How we detect**:
- User reports (Intercom, email, Slack)
- Monitoring alerts (Vercel, Supabase)
- Team member notices

**Immediate actions**:
1. Acknowledge the issue
2. Assess severity
3. Page appropriate people
4. Create #incident-YYYY-MM-DD Slack channel

### Step 2: Investigation (5-15 minutes)

**Gather information**:
- What's broken?
- Since when?
- How many users affected?
- Any recent deployments?
- Any error logs?

**Check**:
- Vercel deployment status
- Vercel function logs
- Supabase database status
- Supabase logs
- External services (OpenAI status)

### Step 3: Communication (Immediate)

**Internal** (#incidents Slack):
```
🚨 SEV 1 INCIDENT: Chat API Down

IMPACT: All users unable to send messages
STARTED: 2:35pm PT
STATUS: Investigating
LEAD: @alice

Updates every 15 minutes
```

**External** (Status page or email):
```
We're currently investigating an issue affecting chat functionality. 
Our team is working on a resolution. 
Updates: status.werkly.com
```

### Step 4: Mitigation (15-60 minutes)

**Options**:
1. **Rollback**: Revert to last known good deployment
2. **Hotfix**: Push fix directly to main
3. **Disable feature**: Feature flag or route removal
4. **Wait**: If external service (OpenAI, Supabase down)

**Priority**: Restore service first, perfect fix later

**Rollback procedure**:
```bash
# In Vercel dashboard
1. Go to Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Monitor for recovery
```

### Step 5: Resolution (Varies)

**Criteria for resolved**:
- Service fully restored
- Root cause identified
- Monitoring confirms stable
- No new errors for 15+ minutes

**Communication**:
```
✅ RESOLVED: Chat API restored

ISSUE: Database connection pool exhausted
FIX: Increased pool size from 10 to 50
DOWNTIME: 23 minutes (2:35pm - 2:58pm PT)
AFFECTED: ~500 users

Post-mortem: Tomorrow in #incidents
```

### Step 6: Post-Mortem (Within 48 hours)

**Required for**: All Sev 1 and Sev 2 incidents

**Format** (see template below):
1. What happened?
2. Timeline
3. Root cause
4. What we did
5. Action items to prevent recurrence

**Share with**:
- Engineering team (required reading)
- Leadership (for Sev 1)
- Affected customers (if requested)

## Post-Mortem Template

```markdown
# Post-Mortem: [Title]

**Date**: Dec 14, 2024
**Severity**: Sev 1
**Duration**: 23 minutes
**Affected users**: ~500
**Incident lead**: Alice Chen

## What Happened

At 2:35pm PT, users began reporting inability to send chat messages. Investigation revealed database connection pool was exhausted due to connection leak.

## Timeline (PT)

- **2:35pm**: First user report in Intercom
- **2:37pm**: On-call paged, #incident channel created
- **2:40pm**: Root cause identified (connection leak)
- **2:45pm**: Fix deployed (increase pool size)
- **2:50pm**: Service recovering
- **2:58pm**: Fully resolved, monitoring confirms stable

## Root Cause

Bug introduced in PR #234 where database connections weren't properly closed in error handling path. Under normal load, connections eventually exhausted.

## What Went Well

- Fast detection (2 minutes from first user report)
- Clear communication in #incident channel
- Quick root cause identification
- Effective rollback strategy available

## What Could Be Better

- Should have caught in code review (missing cleanup)
- No automated alerting (relied on user reports)
- Load testing would have caught this

## Action Items

- [ ] @alice: Add connection cleanup linter rule
- [ ] @bob: Add database connection monitoring
- [ ] @carol: Update code review checklist
- [ ] @engineering: Load test before major releases
- [ ] @alice: Add integration test for this scenario

**Due**: Dec 21, 2024

## Prevention

Similar issues prevented by:
1. Stricter code review (check connection cleanup)
2. Automated monitoring (alert before pool exhausted)
3. Load testing as part of QA
4. Connection pool sizing based on traffic patterns
```

## Roles & Responsibilities

### Incident Commander (IC)

**Responsibilities**:
- Declare severity
- Coordinate response
- Make decisions
- Communicate updates
- Run post-mortem

**Usually**: On-call engineer or senior engineer

### Technical Lead

**Responsibilities**:
- Investigate root cause
- Propose fixes
- Implement solution
- Verify resolution

### Communications Lead

**Responsibilities**:
- Update status page
- Email affected customers
- Social media (if needed)
- Coordinate with support team

### Support Lead

**Responsibilities**:
- Monitor support tickets
- Respond to customer questions
- Escalate reports to IC
- Post-incident customer communication

## Communication Templates

### Internal Update (Every 15 minutes)

```
UPDATE [Time]: Still investigating. Found X. Trying Y. Next update in 15 min.
```

### External Status Page

```
🟡 Investigating
We're investigating reports of issues with [feature]. 
Updates will be posted here.

🟠 Identified
We've identified the issue and are working on a fix.

🟢 Resolved
The issue has been resolved. All systems operational.
```

### Customer Email (Post-incident)

```
Subject: Service Disruption Update - Dec 14

Hi [Customer],

We wanted to follow up on the service disruption you may have experienced on Dec 14 from 2:35-2:58pm PT.

WHAT HAPPENED:
Our chat feature was unavailable for 23 minutes due to a database connection issue.

IMPACT:
Users were unable to send chat messages during this window.

RESOLUTION:
We identified and fixed the issue. Service is now fully restored.

PREVENTION:
We've implemented additional monitoring and testing to prevent recurrence.

We apologize for the inconvenience. If you have questions, please reply to this email.

Best,
Werkly Team
```

## On-Call Rotation

### Schedule

- **Week 1**: Alice
- **Week 2**: Bob
- **Week 3**: Carol
- **Week 4**: David

**Handoff**: Sundays at 6pm PT

### On-Call Expectations

- PagerDuty app installed
- Phone volume on
- Able to respond within 15 minutes
- Laptop accessible
- Sober (no drinking while on-call)

### On-Call Compensation

- **Base**: $500/week
- **If paged**: +$200 per incident
- **Weekend work**: 1.5x hourly rate

### Handoff Checklist

- [ ] Check ongoing incidents
- [ ] Review week's deployments
- [ ] Test access to all systems
- [ ] Review playbook
- [ ] Confirm contact info updated

## Monitoring & Alerts

### What We Monitor

**Uptime**:
- Homepage availability
- API endpoints
- Database connections

**Performance**:
- API response times
- Chat first token time
- Document processing duration

**Errors**:
- 500 error rate
- Failed API calls
- Database query failures

**Business Metrics**:
- Signups per hour
- Chat messages per minute
- Document uploads

### Alert Thresholds

- **Error rate**: > 1% (warn), > 5% (critical)
- **Response time**: > 5s (warn), > 10s (critical)
- **Downtime**: > 1 minute (critical)

## Runbooks

### Database Connection Issues

1. Check connection pool usage: Supabase → Logs
2. Identify slow queries: Check for missing indexes
3. Kill long-running queries if needed
4. Increase connection pool if needed
5. Deploy fix for connection leaks

### OpenAI API Failures

1. Check OpenAI status: status.openai.com
2. If down: Show graceful error to users
3. If rate limited: Implement exponential backoff
4. If working: Check our API key validity

### Deployment Rollback

1. Vercel → Deployments
2. Find last working deployment (check timestamp)
3. Click "..." → "Promote to Production"
4. Verify service restored
5. Investigate broken deployment

## Testing in Production

### Safe Guards

- Feature flags (future)
- Gradual rollouts (future)
- Monitoring dashboards
- Quick rollback capability

### When to Test

- Only for minor, non-critical features
- With monitoring ready
- During business hours
- With team online

## Post-Incident Customer Care

### Proactive Outreach

For Sev 1 incidents:
- Email all affected customers
- Offer 1:1 call if requested
- Provide credits or discounts if significant

### Customer Questions

Common questions:
- "Will this happen again?" → Explain prevention steps
- "Can I get a refund?" → Escalate to account manager
- "Why did this happen?" → Share simplified explanation

## Incident History

Track all incidents in Linear:
- Searchable by severity, component, date
- Links to post-mortems
- Action item tracking
- Trends over time

**Goal**: Learn from incidents, prevent repeats

## Resources

- PagerDuty: https://werkly.pagerduty.com
- Status page: https://status.werkly.com
- Vercel dashboard: https://vercel.com/werkly
- Supabase dashboard: https://supabase.com/dashboard
- #incidents Slack

## Questions?

- On-call: Page via PagerDuty
- General: #engineering Slack
- Emergency: Call CTO directly

---

**Last Updated**: December 2024
**Maintainer**: Engineering Leadership
**Classification**: Internal - Required Reading
