# Customer Support Guide

## Overview

Providing exceptional support is core to Werkly's success. This guide covers support processes, tools, and best practices.

## Support Channels

### Email: support@werkly.com

- **Response time**: < 4 hours
- **Resolution time**: < 24 hours for P1, < 3 days for P2+
- **Who monitors**: Entire support team
- **Hours**: 9am - 6pm PT, Mon-Fri

### Intercom (In-App Chat)

- **Response time**: < 1 hour during business hours
- **After hours**: Auto-response with email option
- **Who monitors**: On-duty support engineer

### Slack (Enterprise customers)

- **Private channels**: #customer-companyname
- **Response time**: < 30 minutes
- **Who monitors**: Assigned account manager
- **Hours**: 9am - 6pm PT, Mon-Fri

## Issue Priority Levels

### P0 - Critical (Production Down)

**Examples**:
- App completely unavailable
- Data breach or security incident
- All users unable to log in

**Response**: Immediate (< 15 min)
**Resolution**: < 2 hours
**Who handles**: On-call engineer + CTO

### P1 - High (Major Feature Broken)

**Examples**:
- Chat not working
- Documents won't upload
- Users can't sign up
- RAG returning no results

**Response**: < 1 hour
**Resolution**: < 4 hours
**Who handles**: Support engineer

### P2 - Medium (Minor Feature Issues)

**Examples**:
- Sidebar animation glitchy
- Slow response times (but working)
- Conversation not saving occasionally

**Response**: < 4 hours
**Resolution**: < 24 hours
**Who handles**: Support engineer

### P3 - Low (Questions, Feature Requests)

**Examples**:
- "How do I...?"
- "Can you add...?"
- UI tweaks

**Response**: < 24 hours
**Resolution**: < 3 days
**Who handles**: Support engineer or PM

## Support Tools

### Intercom

Our primary support platform.

**Creating a Ticket**:
1. User messages come in automatically
2. Assign to yourself
3. Update priority tag
4. Start conversation

**Ticket Workflow**:
- New → In Progress → Waiting on Customer → Resolved

### Supabase Dashboard

For investigating issues:
- Check user accounts
- View database records
- Check RLS policies
- Review logs

**Access**: Support team + Engineering

### Vercel Logs

For API/deployment issues:
- Function logs
- Error traces
- Deployment history

### Linear (Issue Tracking)

For bugs that need engineering:
1. Create Linear issue
2. Link to support ticket
3. Tag with severity
4. Assign to engineering
5. Keep customer updated

## Common Issues & Solutions

### "I can't log in"

**Troubleshooting**:
1. Check email spelling
2. Try "Forgot password"
3. Check Supabase logs for auth errors
4. Verify email confirmation sent

**Common causes**:
- Typo in email
- Email not confirmed
- Account doesn't exist
- Browser blocking cookies

**Resolution**:
```
Hi [Name],

I see the issue - your email wasn't confirmed yet. I've manually confirmed it now. Try logging in again.

If still having trouble, try clearing your browser cache or using incognito mode.

Best,
Support Team
```

### "Chat isn't giving good answers"

**Troubleshooting**:
1. Check if documents are uploaded
2. Verify documents processed successfully
3. Check embedding count in database
4. Test vector search with sample query
5. Check if user is in correct company

**Common causes**:
- No documents uploaded yet
- Documents still processing
- Employee not added to company
- Question too vague

**Resolution**:
```
Hi [Name],

I checked your account. The issue is that you have 0 documents uploaded yet. 

To get started:
1. Log in as an employer
2. Go to Documents tab
3. Upload your company documentation
4. Wait for processing (shows as "completed")
5. Then try asking questions

Let me know if you need help!

Best,
Support Team
```

### "I can't upload documents"

**Troubleshooting**:
1. Check file type (PDF, DOCX, TXT, MD only)
2. Check file size (max 50MB)
3. Check storage quota
4. Check browser console errors

**Common causes**:
- Unsupported file type
- File too large
- Storage bucket full
- Browser extension blocking

**Resolution**:
```
Hi [Name],

The file type .xls isn't supported yet. Could you convert to PDF or DOCX and try again?

Supported formats:
- PDF
- Word (.docx, .doc)
- Text (.txt)
- Markdown (.md)

We're adding Excel support in Q2!

Best,
Support Team
```

### "Employees can't see documents"

**Troubleshooting**:
1. Check if employee is in company (profiles table)
2. Verify company_id matches documents
3. Check RLS policies are active
4. Test vector search manually

**Common cause**: Employee not added to company yet

**Resolution**:
```
Hi [Name],

The employee needs to be added to your company first. Here's how:

1. Log in as employer
2. Go to Employees tab
3. Enter their email address
4. Click "Add Employee"

Once added, they'll automatically have access to all company documents.

Let me know if you need help!

Best,
Support Team
```

## Response Templates

### Greeting

```
Hi [Name],

Thanks for reaching out! I'm here to help.

[Your message]

Best,
[Your Name]
Werkly Support
```

### Acknowledgment

```
Hi [Name],

Thanks for reporting this! I've created a ticket and our team is investigating.

I'll update you within [timeframe] with more information.

Best,
[Your Name]
```

### Resolution

```
Hi [Name],

Good news! This has been fixed. [Explanation of what was wrong and what was done].

Can you confirm it's working on your end?

Best,
[Your Name]
```

### Escalation to Engineering

```
Hi [Name],

This requires our engineering team to investigate. I've escalated this to them and tagged it as high priority.

Expected timeline: [timeframe]

I'll keep you updated every [frequency] until it's resolved.

Best,
[Your Name]
```

## Escalation Path

1. **Support Engineer** → 2. **Senior Support** → 3. **Engineering** → 4. **CTO**

**When to escalate**:
- Can't resolve in 2 hours (for P1)
- Requires code changes
- Security concerns
- Data loss
- Customer is upset (escalate to manager)

## Customer Communication

### Tone & Voice

- **Friendly**: But not overly casual
- **Helpful**: Focus on solutions, not problems
- **Empathetic**: Acknowledge frustration
- **Clear**: No jargon unless customer is technical
- **Prompt**: Don't leave customers waiting

**Examples**:

❌ "The vector embedding service is experiencing latency issues"
✅ "We're seeing slower response times right now. We're working on it and expect it fixed within the hour."

❌ "RTFM"
✅ "I can help with that! Here's how..."

### Setting Expectations

Be realistic:
```
❌ "We'll have this fixed ASAP"
✅ "We'll have this fixed by end of day today"

❌ "This is being worked on"
✅ "Engineering is working on this now. Expect an update in 2 hours"
```

## Handoff to Customer Success

For issues requiring implementation help:
1. Create handoff doc with context
2. Tag Customer Success in Linear
3. Introduce customer via email
4. CS schedules call

## Metrics

Track personal metrics:
- **First response time**: < 4 hours
- **Resolution time**: < 24 hours (P1)
- **Customer satisfaction**: 4.5+ / 5
- **Tickets resolved per day**: 10+

## Support Shift Schedule

**Coverage**: 9am - 6pm PT, Mon-Fri

**Shifts**:
- Morning (9am - 1pm): Engineer A
- Afternoon (1pm - 6pm): Engineer B
- On-call (after hours): Rotating weekly

## On-Call Procedures

### What Triggers Page

- P0 incidents (production down)
- Security alerts
- Uptime monitoring alerts

### Response Expectations

- **Acknowledge**: < 15 minutes
- **Assess severity**: Immediately
- **Escalate if needed**: Within 30 minutes
- **Resolve or mitigate**: < 2 hours

### On-Call Schedule

Rotating weekly among senior engineers:
- Week 1: Alice
- Week 2: Bob
- Week 3: Carol
- Repeat

**Compensation**: $500/week on-call pay

## Knowledge Base

### Creating Help Articles

When you solve an issue 3+ times:
1. Write help article
2. Add to knowledge base (Intercom or Werkly itself!)
3. Share in #support Slack
4. Link in future responses

### Popular Articles

- How to upload documents
- How to add employees
- Troubleshooting login issues
- Understanding conversation history
- Resetting your password

## Team Rituals

**Daily Standups** (9am):
- Review open tickets
- Share blockers
- Discuss tricky issues

**Weekly Retro** (Fridays 4pm):
- What went well
- What could improve
- Action items

## Questions?

- Slack: #support
- Manager: Head of Support
- Ask Werkly AI!

---

**Last Updated**: December 2024
**Maintainer**: Support Team
