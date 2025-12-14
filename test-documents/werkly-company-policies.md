# Werkly Company Policies & Guidelines

## Company Overview

Werkly is a fast-growing AI startup focused on revolutionizing workplace training and onboarding. We value innovation, collaboration, and continuous learning.

## Work Policies

### Working Hours

**Core Hours**: 10 AM - 4 PM (your local timezone)
- Be available during core hours for meetings and collaboration
- Flexible start/end times outside core hours
- Async communication encouraged

**Time Off**
- Unlimited PTO policy
- Minimum 2 weeks vacation per year encouraged
- Notify team at least 1 week in advance
- Update team calendar

### Remote Work

We are a **fully remote** company with team members across multiple time zones.

**Requirements:**
- Reliable internet connection
- Quiet workspace for meetings
- Response within 2 hours during core hours
- Attend weekly team meetings

**Best Practices:**
- Use video for team meetings
- Over-communicate in async channels
- Document decisions and discussions
- Respect time zones when scheduling

## Communication

### Primary Channels

**Slack Channels:**
- `#general` - Company-wide announcements
- `#engineering` - Technical discussions
- `#product` - Product planning and feedback
- `#random` - Non-work chat
- `#wins` - Celebrate team successes

**Meetings:**
- Monday: Weekly All-Hands (30 min)
- Tuesday: Engineering Standup (15 min)
- Thursday: Product Review (45 min)
- Friday: Demo & Retrospective (60 min)

**Response Times:**
- Urgent (Slack @mention): Within 1 hour
- Normal (Slack message): Within 4 hours
- Email: Within 24 hours
- Low priority: Within 48 hours

### Meeting Etiquette

- Join on time
- Camera on for team meetings
- Mute when not speaking
- Use "raise hand" feature
- Take notes in shared doc
- Send out action items after meeting

## Engineering Practices

### Code Review

All code must be reviewed before merging.

**As an Author:**
- Keep PRs small (< 400 lines)
- Write clear description
- Self-review before requesting
- Respond to feedback within 24 hours
- Update PR based on feedback

**As a Reviewer:**
- Review within 24 hours
- Be constructive and kind
- Explain reasoning
- Approve when ready
- Follow up on concerns

### Git Workflow

1. Create feature branch from `main`
2. Make small, focused commits
3. Write clear commit messages
4. Push and create PR
5. Address review feedback
6. Merge when approved
7. Delete feature branch

### Testing

**Before Submitting PR:**
- Test locally
- Check for console errors
- Verify functionality works
- Test edge cases
- Run type checks

**Required for Production:**
- Unit tests for critical logic
- Integration tests for API endpoints
- E2E tests for key user flows

### Deployment

**Staging:**
- Auto-deploys from `main` branch
- Use for testing before production
- Share staging links for review

**Production:**
- Manual trigger after testing on staging
- Requires approval from tech lead
- Monitor for errors after deploy
- Roll back if issues detected

## Product Development

### Sprint Cycle

We run 2-week sprints:

**Monday Week 1:**
- Sprint planning
- Review backlog
- Commit to sprint goals

**Monday Week 2:**
- Mid-sprint check-in
- Adjust if needed
- Address blockers

**Friday Week 2:**
- Sprint review & demo
- Retrospective
- Celebrate wins

### Priority Levels

**P0 - Critical**
- System down or major bug
- Security vulnerability
- Start immediately

**P1 - High**
- Important feature
- Significant bug
- Next sprint

**P2 - Medium**
- Nice to have feature
- Minor bug
- Backlog

**P3 - Low**
- Future consideration
- Enhancement
- Someday/maybe

## Security & Compliance

### Data Handling

**Customer Data:**
- Never access production customer data without approval
- Use staging data for testing
- Never share customer information externally
- Report any data breaches immediately

**Credentials:**
- Use password manager (1Password)
- Enable 2FA on all accounts
- Never commit secrets to Git
- Use environment variables
- Rotate keys every 90 days

**Access Control:**
- Request only necessary permissions
- Follow principle of least privilege
- Review access quarterly
- Offboard access immediately when leaving

### API Keys & Secrets

**OpenAI API:**
- Keep API keys secret
- Monitor usage regularly
- Set spending limits
- Use separate keys for dev/staging/prod

**Supabase:**
- Never expose service role key
- Use anon key in client code
- Implement RLS properly
- Audit database access logs

### Security Incidents

If you discover a security issue:

1. **Don't Panic**
2. **Notify immediately** in #security or DM security team
3. **Don't share publicly** until patch is ready
4. **Document** what you found
5. **Assist** with fix if needed

## Customer Support

### Support Channels

- **Email**: support@werkly.io (monitored 9 AM - 6 PM PT)
- **In-app chat**: 24/7 (we respond within 4 hours)

### Response Commitments

- Critical issues: Within 2 hours
- High priority: Within 4 hours
- Normal: Within 24 hours
- Low priority: Within 3 business days

### Escalation Path

1. Support team attempts resolution
2. Escalate to engineering if technical
3. Involve product team for feature requests
4. Loop in leadership for critical issues

## Professional Development

### Learning Budget

Each employee receives **$2,000/year** for professional development:

**Eligible Expenses:**
- Online courses (Udemy, Coursera, etc.)
- Technical books
- Conference tickets
- Certifications
- Workshop fees

**Process:**
- Get manager approval
- Make purchase
- Submit receipt for reimbursement
- Share learnings with team

### Conference Attendance

We encourage conference attendance:
- 1-2 conferences per year
- Company covers ticket + travel
- Present or write blog post afterward
- Share insights with team

### Internal Learning

- **Tech Talks**: Monthly internal presentations
- **Lunch & Learn**: Weekly casual learning sessions
- **Pair Programming**: Encouraged for skill sharing
- **Mentorship**: Formal program for all employees

## Equipment & Tools

### Standard Setup

**Hardware Provided:**
- Laptop (MacBook Pro M2 or equivalent)
- External monitor
- Keyboard & mouse
- Headphones with mic

**Software Licenses:**
- JetBrains IDEs or VS Code
- 1Password
- Slack
- Figma
- Notion
- GitHub Copilot

### Replacement & Upgrades

- Hardware refreshed every 3 years
- Request upgrades through IT
- Report issues immediately
- Return old equipment

## Performance & Growth

### Performance Reviews

**Quarterly Check-ins:**
- 1:1 with manager
- Review goals and progress
- Address any concerns
- Set goals for next quarter

**Annual Review:**
- Comprehensive performance evaluation
- 360-degree feedback
- Compensation review
- Career development planning

### Career Ladder

**Engineer Levels:**
1. Junior Engineer
2. Engineer
3. Senior Engineer
4. Staff Engineer
5. Principal Engineer

**Promotion Criteria:**
- Technical skills
- Impact on product
- Collaboration
- Leadership (at senior+ levels)

### Feedback Culture

We value continuous feedback:
- Give specific, actionable feedback
- Assume good intent
- Focus on behaviors, not personality
- Celebrate successes publicly
- Address concerns privately

## Health & Wellness

### Benefits

**Health Insurance:**
- Medical, dental, vision
- Company covers 100% for employee
- Company covers 75% for dependents

**Mental Health:**
- Therapy/counseling covered
- Monthly wellness stipend ($100)
- Mental health days encouraged

**Parental Leave:**
- 16 weeks paid for primary caregiver
- 8 weeks paid for secondary caregiver
- Flexible return-to-work schedule

### Work-Life Balance

We believe in sustainable work practices:
- No after-hours Slack messages
- Respect PTO and boundaries
- Flexible scheduling for life events
- "Focus time" blocks encouraged

## Frequently Asked Questions

### How do I request time off?

1. Add to team calendar
2. Message your manager
3. Update Slack status
4. Set up coverage if needed

### What if I'm sick?

- Message your manager ASAP
- Update Slack status to 🤒
- Focus on recovery
- No doctor's note needed (unless extended)

### How do I expense something?

1. Get pre-approval if over $100
2. Make purchase
3. Submit receipt in Expensify
4. Include business justification
5. Reimbursed within 2 weeks

### Can I work from a different location?

Yes! Just ensure:
- You have reliable internet
- You're available during core hours
- You notify your team
- You comply with tax regulations

### How do I report a bug in production?

1. Check #engineering for existing reports
2. If new, create detailed bug report:
   - What happened
   - What you expected
   - Steps to reproduce
   - Screenshots/video if possible
3. Tag @engineering-team
4. For critical bugs, page on-call engineer

### What's the policy on AI tool usage?

We encourage responsible AI tool use:
- **Allowed**: GitHub Copilot, ChatGPT for coding assistance
- **Review**: All AI-generated code before committing
- **Prohibited**: Sharing customer data with external AI tools
- **Best Practice**: Use AI as a helper, not a replacement for thinking

---

**Questions?**
Ask in #general or email people@werkly.io

**Last Updated**: December 2025
**Version**: 2.0
