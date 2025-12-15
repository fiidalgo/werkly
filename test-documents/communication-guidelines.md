# Communication Guidelines

## Overview

Clear communication is essential for remote/hybrid teams. This guide covers how we communicate at Werkly.

## Communication Channels

### Slack

**Primary communication tool**

**Response expectations**:
- **Urgent** (🚨): 15 minutes
- **Normal**: 1 hour during work hours
- **Off hours**: Next business day

**Channels**:
- **#general**: Company announcements
- **#engineering**: Engineering discussions
- **#product**: Product updates
- **#design**: Design work
- **#sales**: Sales team
- **#support**: Support issues
- **#random**: Fun, non-work
- **#wins**: Celebrate successes

### Email

**Use for**:
- External communication
- Formal documentation
- Contracts and agreements
- Long-form updates

**Don't use for**:
- Urgent requests (use Slack)
- Quick questions (use Slack)
- Internal team communication

**Response time**: Within 24 hours

### Zoom/Google Meet

**Use for**:
- Meetings (see meeting guidelines)
- Complex discussions
- 1:1s
- Pairing sessions

**Don't use for**:
- Simple questions (use Slack)
- Updates (record Loom instead)

### Notion

**Use for**:
- Documentation
- Process docs
- Meeting notes
- RFCs (technical proposals)
- Project plans

**Best practices**:
- Keep updated
- Link from Slack when referencing
- Tag relevant people
- Use templates

### Linear

**Use for**:
- Bug reports
- Feature requests
- Sprint planning
- Task tracking

**Don't use for**:
- Discussion (use Slack or Notion)
- Questions (use Slack)

## Writing Effectively

### Be Clear and Concise

**❌ Bad**:
"So I was thinking we might want to possibly consider maybe looking into whether we could potentially implement some kind of feature that would allow users to..."

**✅ Good**:
"Proposal: Add export feature for conversations. This lets users download chat history as PDF."

### Use Structure

**For longer messages**:

```markdown
## Context
[Why are you writing]

## Proposal
[What you're proposing]

## Tradeoffs
- Pro: X
- Con: Y

## Decision needed
[What you need from reader]
```

### Use Formatting

**Slack/Notion supports**:
- **Bold**: Important points
- *Italics*: Emphasis
- `Code`: Technical terms
- > Quotes: Highlight key info
- Lists: Break down steps
- Links: Reference docs

### Be Specific

**❌ Vague**:
"The thing is broken"

**✅ Specific**:
"The chat API returns 500 errors when processing questions longer than 1000 characters. Started ~2pm today. Affects all users."

## Async Communication

### Benefits

- Works across timezones
- Thoughtful responses
- Searchable history
- No meeting needed

### Best Practices

**Set context**:
- Don't assume people know what you're referring to
- Link to relevant docs/tickets
- Include enough info to respond

**Be patient**:
- Don't expect instant reply
- Give 24 hours before following up
- Use 🚨 if truly urgent

**Thread conversations**:
- Use Slack threads
- Keeps channels organized
- Makes it searchable

## Sync Communication

### When to Go Sync

**Good reasons**:
- High-bandwidth discussion (lots of back-and-forth)
- Emotional/sensitive topics
- Urgent blockers
- Building relationships

**Bad reasons**:
- "I prefer talking" (respect others' time)
- "Easier for me" (might not be easier for them)
- Habit (challenge if it could be async)

### Quick Slack Huddles

For quick sync discussions:
1. Start Slack huddle
2. Discuss (< 15 minutes)
3. Post summary in channel for others

## Time Zones

### Team Distribution

- **Pacific** (PT): 7 people
- **Eastern** (ET): 3 people
- **Central** (CT): 2 people

### Working Across Timezones

**Do**:
- Use world clock (worldtimebuddy.com)
- Include timezone in times: "2pm PT"
- Rotate meeting times fairly
- Record meetings for those who can't attend
- Over-communicate in writing

**Don't**:
- Schedule meetings only convenient for you
- Expect instant responses at 8am your time
- Forget about holidays in other regions

## Status & Availability

### Slack Status

**Use status to communicate availability**:

- 🟢 **Available**: Default, working and responsive
- 🗓️ **In a meeting**: Might respond slower
- 🎯 **Focusing**: Deep work, will check Slack later
- 🏖️ **Out of office**: Not working today
- 🤒 **Sick**: Out sick
- 🚫 **Do not disturb**: Only ping if emergency

**Pro tip**: Set status to auto-clear

### Calendar

**Keep calendar updated**:
- Block focus time
- Mark OOO (out of office)
- Accept/decline invites promptly
- Set working hours in Google Calendar

## Writing Style

### Professional But Friendly

**We are**:
- Conversational (not corporate speak)
- Friendly (use emoji occasionally 👍)
- Direct (say what you mean)
- Respectful (assume good intent)

**We are not**:
- Overly formal ("Dear Sir/Madam")
- Sarcastic (doesn't translate well in text)
- Passive-aggressive
- All caps (unless excited!)

### Examples

✅ "Hey team! Quick update on the API migration. We're 80% done. Target: Friday. Questions?"

✅ "This PR looks great! One suggestion: consider adding error handling on line 45. Otherwise LGTM 🚀"

❌ "Per my previous email, as I mentioned before, I already addressed this..."

### Emoji Usage

**Appropriate**:
- ✅ Checkmarks
- 🎉 Celebrations
- 👀 "I'm looking into this"
- 🚀 Shipped
- 🐛 Bugs
- 💡 Ideas

**Not appropriate**:
- 💩 (negative connotation)
- 🙄 (eye roll, rude)
- 😤 (frustrated)

## Feedback & Disagreement

### Giving Feedback

**Be direct but kind**:

✅ "I noticed the meeting ran 15 minutes over. Can we stick to 50 minutes next time?"

❌ "You always waste everyone's time with long meetings"

**Be specific**:

✅ "In yesterday's standup, you interrupted Carol twice. Let's make sure everyone gets to share."

❌ "You interrupt too much"

### Disagreeing

**Disagree respectfully**:

✅ "I see it differently. What if we tried approach B instead? Here's why..."

❌ "That's a terrible idea"

**Disagree and commit**:
- Share your perspective
- Listen to others
- Let decision-maker decide
- Commit to the decision even if you disagree

## Meeting Communication

See **Meeting Best Practices** doc for full details.

**Quick tips**:
- Send agenda beforehand
- Take notes during
- Share summary after
- Record for those who can't attend

## External Communication

### With Customers

**Tone**: Professional, helpful, empathetic

**Always**:
- Respond within 4 hours
- Set clear expectations
- Follow up proactively
- Admit mistakes if we made them

**Never**:
- Blame the customer
- Make promises you can't keep
- Ignore them (respond even if no solution yet)
- Use jargon without explaining

### With Vendors

**Professional**:
- Clear about requirements
- Respectful of their time
- Provide necessary info
- Follow up on commitments

### On Social Media

**If representing Werkly**:
- Get approval from marketing first
- Be professional
- No politics or controversial topics
- Disclose if you work for Werkly

## Crisis Communication

### Internal

For incidents:
- Create #incident-YYYY-MM-DD channel
- Update every 15 minutes
- Be transparent about what's known/unknown
- Focus on resolution first, blame never

### External

For customer-facing issues:
- Update status page immediately
- Email affected customers
- Be transparent about cause
- Commit to prevention

**Template**: See Incident Response Playbook

## Remote Work Communication

### Over-Communicate

When remote:
- Share more than you think necessary
- Update team on progress
- Ask questions in public channels (helps others)
- Make work visible

### Use Video

**Camera on when**:
- Team meetings
- 1:1s
- Brainstorming
- Important discussions

**Camera optional when**:
- Standup
- Large all-hands
- You're not feeling well
- Background distractions

### Create Social Connections

**Remote work can be isolating**:
- Join virtual coffee chats
- Participate in #random
- Attend team events
- Schedule informal video chats

## Documentation

### When to Document

**Document**:
- Decisions (why we chose X over Y)
- Processes (how to do recurring tasks)
- Learnings (from incidents, experiments)
- Architecture (system design)

**Don't document**:
- Obvious things
- Things that change daily
- Work in progress (wait until stable)

### Where to Document

| What | Where |
|------|-------|
| Code decisions | Inline comments |
| API docs | Notion + code comments |
| Process | Notion wiki |
| Incidents | Linear + Notion |
| Decisions | Notion decision log |
| Learnings | Notion or blog post |

### Writing Good Docs

**Structure**:
- Overview (what is this?)
- How to use it
- Examples
- Common issues
- FAQs

**Keep updated**:
- Review quarterly
- Update when process changes
- Delete outdated docs

## Questions & Answers

### Where to Ask Questions

| Question Type | Channel |
|--------------|---------|
| Quick coding question | #engineering |
| Product clarification | #product |
| Process question | #operations |
| Urgent blocker | DM manager + 🚨 |
| Customer issue | #support |
| Anything else | #help or Ask Werkly! |

### How to Ask Good Questions

**Include**:
- What you're trying to do
- What you've tried
- Error messages (full text)
- Relevant code (use threads or snippet)
- Screenshots (if UI issue)

**Example**:

✅ Good:
"I'm trying to upload a PDF to Supabase Storage but getting a 403 error. I've checked the RLS policy and it looks correct. Error: `new row violates...`. Code: [snippet]. Any ideas?"

❌ Bad:
"Upload not working. Help?"

## Communication Anti-Patterns

### ❌ @channel / @here Abuse

**Only use for**:
- Incidents
- Company-wide urgent announcements
- Time-sensitive (< 1 hour) requests

**Don't use for**:
- Normal questions
- FYIs
- Can-wait requests

### ❌ "Just checking in"

**Don't**:
"Just checking in on this"

**Do**:
"What's blocking progress on X? Can I help?"

### ❌ "Quick question" (that's not quick)

If it takes > 5 minutes to answer, it's not a "quick question". Be upfront about complexity.

### ❌ DMing instead of public channels

**Ask in public channels first**:
- Others might have same question
- Multiple people can help
- Creates searchable knowledge

**DM for**:
- Sensitive topics
- Feedback
- Personal matters

## Best Practices

1. **Respond, even if brief**: "Looking into this, back to you in 1 hour"
2. **Use reactions**: 👀 = "I saw this", ✅ = "Agree", ❤️ = "Thanks"
3. **Edit, don't delete**: If you made a mistake, edit with strikethrough
4. **Thread replies**: Keep channels organized
5. **Search before asking**: Someone might have asked before
6. **Share learnings**: Help others learn from your questions
7. **Say thanks**: Appreciate people who help

## Questions?

- #operations Slack
- Ask your manager
- Ask Werkly AI!

---

**Last Updated**: December 2024
**Maintainer**: Operations Team
