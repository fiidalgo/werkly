# Meeting Best Practices

## Overview

Meetings should be intentional and effective. This guide helps you run better meetings and respect everyone's time.

## Before Scheduling a Meeting

### Ask: Does This Need to Be a Meeting?

**Yes, schedule a meeting for**:
- Brainstorming or ideation
- Complex decisions requiring discussion
- Team alignment on strategy
- Conflict resolution
- 1:1s and skip-levels

**No, use async instead**:
- Status updates → Slack or Notion
- Information sharing → Loom video or doc
- Simple questions → Slack
- Feedback on docs → Comments in Notion

### Meeting Types

**Sync (Real-time)**:
- Standups, team meetings, 1:1s
- Architecture reviews
- Sprint planning
- Incidents

**Async (Recorded/Written)**:
- Project updates
- Demo videos
- Decision docs
- RFCs (Request for Comments)

## Scheduling Best Practices

### Calendar Etiquette

**Do**:
- Send calendar invite (don't just Slack)
- Include Zoom/Meet link in invite
- Add agenda in description
- Give 24+ hours notice
- Check attendees' time zones
- Use "optional" for non-essential attendees

**Don't**:
- Double-book without asking
- Schedule over lunch (12-1pm)
- Schedule before 10am or after 5pm PT
- Schedule on Friday afternoons

### Meeting-Free Blocks

**Company-wide**:
- **No-meeting Tuesdays**: 1-3pm (focus time)
- **No-meeting Fridays**: After 2pm

**Personal**: Block calendar for focus work

## Meeting Agenda

### Required Elements

Every meeting must have:
1. **Purpose**: Why are we meeting?
2. **Agenda**: What will we discuss?
3. **Duration**: How long? (Default: 25 or 50 min)
4. **Desired outcome**: What decision or action?

### Template

```markdown
# Meeting: [Title]
**Date**: Dec 14, 2024
**Time**: 2pm PT (25 min)
**Attendees**: Alice, Bob, Carol
**Optional**: David

## Purpose
Decide on tech stack for proactive suggestions feature

## Agenda
1. Review options (10 min)
   - Server-side ranking
   - Client-side filtering
   - Hybrid approach
2. Discuss tradeoffs (10 min)
3. Make decision (5 min)

## Desired Outcome
Decision on approach + owner assigned

## Pre-read
- RFC: [Link to Notion doc]
```

**Share** in #engineering 24 hours before meeting

## During the Meeting

### Start on Time

- **Don't wait** for latecomers
- Start at :00 or :30 exactly
- First 2 minutes: Small talk welcome
- Minute 3: Dive in

### Roles

**Facilitator**:
- Keeps discussion on track
- Ensures everyone speaks
- Manages time

**Note-taker**:
- Documents key points
- Captures decisions
- Records action items

**Timekeeper**:
- Warns at 50% mark
- Warns at 5 min left
- Suggests parking lot for tangents

### Meeting Norms

**Do**:
- Camera on
- Mute when not speaking
- Raise hand (virtually or literally)
- Listen actively
- Take notes
- Ask clarifying questions

**Don't**:
- Check email/Slack
- Interrupt others
- Dominate conversation
- Go off-topic for long
- Make side conversations

### Parking Lot

For topics that arise but aren't on agenda:
- Note in "Parking Lot" section
- Discuss after meeting or schedule follow-up
- Don't derail current discussion

## Types of Meetings

### Daily Standup (15 min)

**Format**:
- What I did yesterday
- What I'm doing today
- Blockers (if any)

**Rules**:
- Start on time
- 2 minutes max per person
- No problem-solving (take offline)
- Async in Slack if can't attend

### 1:1s (30 min, weekly)

**Employee's meeting** (you set agenda)

**Topics**:
- Progress on goals
- Challenges/blockers
- Career growth
- Feedback (both directions)
- Work-life balance

**Manager's responsibility**:
- Listen actively
- Provide guidance
- Remove blockers
- Give feedback

### Team Retrospectives (60 min, bi-weekly)

**Format**:
1. What went well? (15 min)
2. What could be better? (15 min)
3. Action items (20 min)
4. Appreciations (10 min)

**Rules**:
- Blameless (no finger-pointing)
- Specific examples
- Actionable outcomes
- Rotate facilitator

### Sprint Planning (90 min, bi-weekly)

**Agenda**:
1. Review last sprint (15 min)
2. Demo completed work (20 min)
3. Plan next sprint (40 min)
4. Estimate and commit (15 min)

**Output**:
- Sprint backlog
- Clear priorities
- Everyone knows what they're working on

### Architecture Review (60 min, as needed)

**For**:
- Major technical decisions
- New system design
- Tech stack changes

**Attendees**:
- Tech lead
- Relevant engineers
- CTO (optional)

**Pre-work**:
- RFC document shared 2 days before
- Everyone reads before meeting

## Decision-Making

### Consensus vs Disagree and Commit

**Seek input, not consensus**:
1. Gather perspectives
2. Designated person decides
3. Everyone commits to decision

**Disagree and commit**:
- Share your disagreement
- Accept the decision
- Support it fully (no "I told you so")

### DACI Framework

For major decisions:
- **Driver**: Leads decision process
- **Approver**: Makes final call
- **Contributors**: Provide input
- **Informed**: Need to know outcome

## After the Meeting

### Notes & Action Items

**Within 1 hour of meeting**:
- Post notes in Notion
- Share in relevant Slack channel
- Tag owners in action items
- Create Linear tickets for eng work

**Template**:
```markdown
# Meeting Notes: [Title]
**Date**: Dec 14, 2024
**Attendees**: Alice, Bob, Carol

## Key Decisions
1. Using server-side ranking for suggestions
2. Launching in Q1 2025

## Action Items
- [ ] @alice: Create design mockups (Due: Dec 21)
- [ ] @bob: Spike on ranking algorithm (Due: Dec 18)
- [ ] @carol: Update roadmap doc (Due: Dec 15)

## Parking Lot
- Consider A/B testing ranking algorithms
- Explore personalization based on role

## Next Meeting
Jan 4, 2025 - Review progress
```

### Follow-Up

- Share recording (if recorded)
- Send action item reminders (3 days before due)
- Schedule follow-up meeting (if needed)

## Meeting Anti-Patterns

### ❌ Meetings About Meetings

Don't schedule a meeting to plan another meeting. Use Slack.

### ❌ Update Meetings

Don't gather people just to give updates. Use Slack or Loom.

### ❌ FYI Meetings

If it's just "FYI", send an email or Slack message.

### ❌ No-Agenda Meetings

If there's no agenda, decline the meeting or ask for one.

### ❌ Meeting to Read a Doc

Don't use meeting time to read a document together. Share beforehand.

## Effective Meeting Patterns

### ✅ Working Session

**Purpose**: Make progress on concrete task
**Example**: Design mockups together, debug issue live, write RFC

**Structure**:
- Brief intro (5 min)
- Work together (40 min)
- Wrap up and next steps (5 min)

### ✅ Decision Meeting

**Purpose**: Make a specific decision
**Example**: Choose tech stack, approve design, prioritize features

**Pre-work required**: Options analyzed beforehand
**Structure**:
- Present options (10 min)
- Discuss tradeoffs (20 min)
- Decide (10 min)

### ✅ Alignment Meeting

**Purpose**: Get everyone on same page
**Example**: Kickoff new project, align on strategy, quarterly planning

**Structure**:
- Context and goals (15 min)
- Discussion (25 min)
- Commitments (15 min)

## Virtual Meeting Tips

### Technical Setup

- Test audio/video before important meetings
- Wired internet > WiFi (if possible)
- Good lighting (face visible)
- Noise-canceling headphones
- Background blur or professional background

### Engagement

**As participant**:
- Camera on shows engagement
- Use reactions (👍 in Zoom)
- Raise hand before speaking
- Use chat for questions
- Stay present (close email)

**As facilitator**:
- Call on people by name
- Ask "Anything to add?" explicitly
- Watch for raised hands
- Monitor chat for questions
- Check if anyone is lost

## Time Management

### Start and End on Time

- Start at :00 or :30 sharp
- End 5 minutes early (50 min for 1 hour slot)
- Gives people transition time

### Keep It Short

- **Default**: 25 minutes (not 30)
- **Max**: 50 minutes (not 60)
- Longer meetings = diminishing returns

### Respect People's Time

If meeting ends early:
- **End early** (give time back)
- Don't fill time just because it's scheduled
- People will thank you

## Meeting ROI

Calculate cost of meeting:

**Example**:
- 6 people × $75/hour average × 1 hour = $450
- Better be worth $450 of value!

**Questions**:
- Could this be an email? (Save $450)
- Do all 6 people need to be here? (Invite fewer)
- Could it be 30 minutes? (Save $225)

## Meeting Culture

### Company Norms

- **Defaultto async**: Meetings are expensive
- **Meeting audits**: Review recurring meetings quarterly
- **No-meeting days**: Protect deep work time
- **Recording friendly**: OK to record and watch later

### Individual Boundaries

**You can**:
- Decline meetings without agenda
- Suggest async alternative
- Leave early if not needed
- Reschedule if conflicting priorities

## Special Meeting Types

### All-Hands (Monthly, 60 min)

**Format**:
- Company updates (20 min)
- Product demo (15 min)
- Team spotlights (15 min)
- Q&A (10 min)

**Recording**: Always recorded for remote/timezone differences

### Sprint Review/Demo (30 min, bi-weekly)

**Show what shipped**:
- Each team demos their work
- Focus on user impact
- 5 min per team max
- Celebrate wins

### Retrospectives (60 min, bi-weekly)

**Reflect and improve**:
- What went well
- What didn't
- Action items for next sprint

**Rules**: Blameless, specific, actionable

## Questions?

- Meeting best practices: #operations Slack
- Need to reschedule: Just update calendar invite
- Ask Werkly AI!

---

**Last Updated**: December 2024
**Maintainer**: Operations Team
