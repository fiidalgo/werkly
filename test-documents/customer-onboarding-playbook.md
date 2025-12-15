# Customer Onboarding Playbook

## Overview

Great customer onboarding leads to successful customers. This playbook guides Sales and CS teams through onboarding new customers to Werkly.

## Onboarding Stages

### Stage 1: Contract Signed → Kickoff (Week 1)

**Timeline**: Within 3 days of contract signature

**Kickoff Call** (60 min):
- Intro Customer Success Manager (CSM)
- Set expectations
- Confirm success metrics
- Schedule implementation timeline

**Attendees**:
- Customer: Admin, key stakeholders
- Werkly: CSM, Sales (optional), Implementation Engineer

**Agenda**:
1. Introductions (10 min)
2. Product walkthrough (20 min)
3. Implementation plan (20 min)
4. Q&A (10 min)

**Deliverables**:
- Implementation plan doc
- Weekly check-in schedule
- CSM contact info
- Slack channel created

### Stage 2: Setup & Configuration (Week 1-2)

**Admin account creation**:
1. CSM creates employer account
2. Sends credentials to customer admin
3. Admin logs in and sets up profile

**Company configuration**:
- Company name
- Logo (future feature)
- Branding colors (future)
- User permissions (future)

**Technical setup**:
- SSO integration (Enterprise only, future)
- API access (Enterprise only, future)
- Webhook configuration (future)

**Timeline**: 2-3 days

### Stage 3: Document Upload (Week 2)

**Document collection workshop** (90 min):
- Review customer's existing docs
- Identify what to upload first
- Prioritize by value (what employees need most)
- Plan upload schedule

**Recommended first uploads**:
1. Onboarding guides
2. Company policies (PTO, remote work, etc.)
3. Technical setup guides
4. FAQ documents
5. Process documentation

**Upload process**:
- Customer uploads themselves (guided by CSM)
- Or CSM uploads (with customer's files)
- Monitor processing status
- Verify embeddings created

**Success criteria**:
- 10-20 documents uploaded
- All processed successfully
- Test queries return results

**Timeline**: 3-5 days

### Stage 4: Employee Addition (Week 2-3)

**Pilot group** (10-20 employees):
- Start with 1-2 teams
- Include advocates/champions
- Mix of roles (technical and non-technical)
- Get feedback before broader rollout

**Adding employees**:
1. Collect employee emails
2. Employees sign up individually
3. Employer adds them via Employees page
4. Employees can now access company docs

**Communication**:
- Send welcome email to pilot group
- Include "how to get started" guide
- Encourage questions
- Set up feedback channel

**Timeline**: 2-3 days

### Stage 5: Training (Week 3)

**Admin training** (45 min):
- Document management
- Employee management
- Viewing analytics (future)
- Best practices

**Employee training** (30 min):
- How to ask questions
- Interpreting responses
- Giving feedback
- Tips for better results

**Format**: 
- Live webinar (recorded)
- Or Loom videos
- Plus written guide

**Timeline**: 1 week

### Stage 6: Pilot & Feedback (Week 3-6)

**Duration**: 2-4 weeks

**Weekly check-ins** with customer:
- Usage metrics review
- Feedback collection
- Issue resolution
- Document optimization

**Metrics to track**:
- Activation rate (% who asked 1+ question)
- Questions per employee per week
- Satisfaction scores
- Time-to-answer
- Document coverage (% of questions answered)

**Adjustments**:
- Upload more documents (based on unanswered questions)
- Refine document quality
- Add more employees
- Adjust settings (thresholds, etc.)

### Stage 7: Broader Rollout (Week 6+)

**When to expand**:
- Pilot group satisfaction > 4/5
- > 70% activation rate
- Major issues resolved
- Customer feels confident

**Rollout plan**:
- Team by team (not all at once)
- 1-2 teams per week
- Collect feedback continuously
- Monitor metrics

**Communication**:
- Announcement email
- Demo video
- FAQs
- Support channel

**Timeline**: 2-6 weeks depending on company size

### Stage 8: Ongoing Success (Week 12+)

**Transition to ongoing**:
- Bi-weekly check-ins (instead of weekly)
- Customer self-sufficient
- Monitor metrics proactively
- Reach out if issues detected

**Expansion opportunities**:
- Additional teams
- Advanced features (Slack integration, etc.)
- API access
- Custom integrations

## Success Metrics

### Activation

**Definition**: Employee asks 1+ question in first 7 days

**Target**: > 70%

**If low**:
- Improve onboarding communication
- Make first question suggestions
- Personal outreach to inactive employees

### Engagement

**Definition**: Questions per employee per week

**Target**: > 5 questions/week

**If low**:
- Upload more documents
- Improve doc quality
- Better suggestions
- Training/reminders

### Satisfaction

**Definition**: User rating (1-5 stars)

**Target**: > 4.0 average

**If low**:
- Collect qualitative feedback
- Identify common complaints
- Address top 3 issues

### Time-to-Answer

**Definition**: How long to find information

**Target**: < 2 minutes vs. 15+ minutes before Werkly

**Measurement**: User survey ("How long would this have taken before Werkly?")

## Common Challenges

### "Employees aren't using it"

**Causes**:
- Don't know it exists (communication)
- Don't know how to use it (training)
- Don't see value (wrong docs uploaded)
- Prefer old method (change management)

**Solutions**:
- Manager advocacy (have managers use it)
- Lunch & learn demos
- Success stories (share internally)
- Integration (bring Werkly to where they are - Slack)

### "Answers aren't good enough"

**Causes**:
- Documents incomplete
- Documents poorly structured
- Similarity threshold too high
- Questions too vague

**Solutions**:
- Upload more docs (fill gaps)
- Restructure docs (clear sections, headings)
- Lower threshold (0.5 → 0.4)
- Train users on better questions

### "Too expensive"

**Response**:
- Show ROI calculation
- Compare to previous costs
- Demonstrate time savings
- Calculate cost per employee (usually < $10/month)

**If legitimate concern**:
- Offer discount for annual commitment
- Reduce scope (fewer employees initially)
- Tiered pricing based on usage

## Customer Success Tools

### Intercom

- Tag conversations with customer name
- Track support tickets
- Measure response times

### HubSpot

- Customer health score
- Usage metrics
- Renewal tracking
- Expansion opportunities

### Notion

- Customer notes and history
- Onboarding plans
- Meeting notes
- Success plans

## Handoff: Sales to CS

**Sales provides**:
- Customer context (why they bought)
- Key stakeholders
- Special requirements
- Pricing/contract details

**CS receives**:
- Customer info in HubSpot
- Intro email from sales
- Kickoff call scheduled
- Slack channel created

## Escalation Path

### When to Escalate

**To Engineering**:
- Technical issues
- Feature requests blocking success
- Product bugs

**To Product**:
- Feature prioritization questions
- Roadmap discussions
- Product feedback themes

**To Leadership**:
- Account at risk
- Expansion opportunity
- Contract negotiation

## Customer Segmentation

### SMB (< 100 employees)

**Onboarding**: Mostly self-service
**Touch**: Monthly check-ins
**CSM**: 1 CSM per 20 accounts

### Mid-Market (100-1,000 employees)

**Onboarding**: Guided (this playbook)
**Touch**: Bi-weekly check-ins
**CSM**: 1 CSM per 10 accounts

### Enterprise (1,000+ employees)

**Onboarding**: White-glove
**Touch**: Weekly check-ins
**CSM**: Dedicated CSM per account
**Extras**: Custom integrations, training, SLAs

## Expansion Signals

### When to Upsell

**Signals customer is ready**:
- High usage (> 10 questions/employee/week)
- Asking about advanced features
- Wants to add more employees
- Positive feedback
- Sharing with other teams

**Expansion opportunities**:
- Upgrade tier (more employees)
- Add Slack integration
- API access
- Training packages
- Custom features

## Renewal Process

### 30 Days Before Renewal

**Check**:
- Usage metrics healthy?
- Satisfaction scores good?
- Any unresolved issues?
- Value being realized?

**If yes**: Easy renewal
**If no**: Create success plan to address

### Renewal Call

**Agenda**:
1. Review year's success
2. Share metrics and ROI
3. Discuss future goals
4. Present renewal terms
5. Answer questions

**Goal**: Secure renewal + expansion

## Resources

### Customer-Facing

- Help Center: help.werkly.com
- Video tutorials: youtube.com/werkly
- Product updates: changelog.werkly.com
- Status page: status.werkly.com

### Internal

- CS playbook: Notion
- Customer health dashboard: HubSpot
- #customer-success Slack
- Weekly CS team meeting (Mondays 10am)

## Questions?

- CS team: #customer-success Slack
- Manager: Head of Customer Success
- Ask Werkly AI!

---

**Last Updated**: December 2024
**Maintainer**: Customer Success Team
