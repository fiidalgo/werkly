# Code Review Checklist

## Purpose

Code reviews ensure code quality, share knowledge, and catch issues before production. This checklist helps reviewers and authors.

## For Authors (Before Requesting Review)

### Self-Review First

- [ ] Read your own diff on GitHub
- [ ] Check for debug `console.log()` statements
- [ ] Remove commented-out code
- [ ] Verify no secrets committed
- [ ] Check for TODO comments (resolve or create tickets)

### Code Quality

- [ ] TypeScript has no errors: `npm run build`
- [ ] Linter passes (no warnings)
- [ ] Code follows project conventions
- [ ] Functions are reasonably sized (< 50 lines)
- [ ] Complex logic has explanatory comments
- [ ] No duplicate code (DRY principle)

### Testing

- [ ] Manually tested all changed code paths
- [ ] Tested error cases
- [ ] Tested edge cases (empty data, null values)
- [ ] Checked on mobile viewport (if UI changes)
- [ ] No console errors in browser

### Documentation

- [ ] Updated README if needed
- [ ] Added/updated code comments for complex logic
- [ ] Updated API docs if adding endpoint
- [ ] Screenshots attached for UI changes

## For Reviewers

### First Pass - High Level

- [ ] Read PR description
- [ ] Understand the goal/feature
- [ ] Check if approach makes sense
- [ ] Verify PR size is reasonable (< 500 lines)

### Code Review - Details

#### Logic & Correctness

- [ ] Code does what PR claims
- [ ] No obvious bugs
- [ ] Error handling present
- [ ] Edge cases handled
- [ ] No infinite loops or memory leaks

#### Security

- [ ] No secrets in code
- [ ] Input validation on user data
- [ ] Authentication checks on protected routes
- [ ] RLS policies respected
- [ ] No SQL injection vulnerabilities
- [ ] XSS prevention (React handles most)

#### Performance

- [ ] No unnecessary re-renders
- [ ] Database queries use indexes
- [ ] API responses use pagination/limits
- [ ] Large lists virtualized
- [ ] Images optimized

#### Style & Readability

- [ ] Variable names are descriptive
- [ ] Functions have clear purpose
- [ ] Complex logic is commented
- [ ] Consistent formatting
- [ ] No spelling errors in user-facing text

#### TypeScript

- [ ] No `any` types (unless absolutely necessary)
- [ ] Props have proper types
- [ ] API responses typed
- [ ] No `@ts-ignore` without comment

### Database Changes

- [ ] Migration is idempotent
- [ ] RLS policies added
- [ ] Indexes added for queries
- [ ] Foreign keys have ON DELETE behavior
- [ ] Migrations tested locally first

### API Changes

- [ ] Authentication required
- [ ] Input validation
- [ ] Error responses have proper status codes
- [ ] Success responses consistent format
- [ ] Handles edge cases (user not found, etc.)

### UI Changes

- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (keyboard navigation, screen readers)
- [ ] Loading states present
- [ ] Error states handled gracefully
- [ ] Consistent with design system
- [ ] No layout shift during loading

## Review Comments

### Types of Comments

#### Blocking (Must Fix)

Use for:
- Security issues
- Bugs
- Breaking changes
- Performance problems

```
🚨 BLOCKING: This exposes the service role key to the client
```

#### Suggestion (Nice to Have)

Use for:
- Style improvements
- Alternative approaches
- Performance optimizations

```
💡 Suggestion: Consider using Promise.all here for better performance
```

#### Question (Clarification)

Use for:
- Understanding intent
- Unclear code

```
❓ Question: Why do we need this setTimeout?
```

#### Praise (Positive Feedback)

Use for:
- Clever solutions
- Clean code
- Good documentation

```
✨ Nice! This is much cleaner than the previous approach
```

### Writing Good Comments

**Be specific**:
```
❌ "This is wrong"
✅ "This will cause a memory leak because the event listener is never removed"
```

**Be constructive**:
```
❌ "This is bad code"
✅ "Consider extracting this into a helper function for reusability"
```

**Explain why**:
```
❌ "Change this"
✅ "Change this to use === instead of == to avoid type coercion bugs"
```

**Suggest solutions**:
```
❌ "This won't work"
✅ "This won't work for arrays with duplicate values. Try using a Set instead"
```

## Response Time

### Reviewer

- **First response**: Within 24 hours
- **Full review**: Within 48 hours
- **Urgent PRs**: Within 4 hours (label as `urgent`)

### Author

- **Reply to comments**: Within 24 hours
- **Push fixes**: Within 48 hours
- **Re-request review**: After addressing all feedback

## Approval Criteria

### When to Approve

- ✅ All blocking comments addressed
- ✅ Code does what PR claims
- ✅ No obvious bugs or security issues
- ✅ Follows team conventions
- ✅ Documentation updated

### When to Request Changes

- ❌ Security vulnerabilities
- ❌ Major bugs
- ❌ Breaks existing functionality
- ❌ Violates architecture decisions
- ❌ No tests for critical logic (future requirement)

### When to Comment But Approve

- Minor style suggestions
- Performance micro-optimizations
- Alternative approaches (author's choice)
- Documentation improvements

## Common Review Patterns

### React Components

**Check for**:
- Proper `useEffect` cleanup
- Memoization where needed
- Correct dependency arrays
- Event listener cleanup
- No infinite render loops

**Example**:
```typescript
// ❌ Missing cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize)
}, [])

// ✅ Proper cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

### API Routes

**Check for**:
- Authentication check
- Input validation
- Error handling
- Proper status codes
- RLS respected

**Example**:
```typescript
// ❌ Missing validation
const { email } = await request.json()
await addEmployee(email)

// ✅ Validated
const { email } = await request.json()

if (!email || typeof email !== 'string' || !email.includes('@')) {
  return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
}

await addEmployee(email.toLowerCase().trim())
```

### Database Queries

**Check for**:
- Indexes exist for filters
- Results limited
- RLS policies present
- Proper error handling

**Example**:
```typescript
// ❌ No limit, slow on large tables
const { data } = await supabase
  .from('conversations')
  .select('*')

// ✅ Limited, fast
const { data } = await supabase
  .from('conversations')
  .select('*')
  .order('updated_at', { ascending: false })
  .limit(50)
```

## What Not to Review

Don't waste time on:
- Personal style preferences (tabs vs spaces)
- Minor naming conventions
- Formatting (linter handles this)
- "I would have structured this differently" (unless there's a real issue)

## Special Cases

### Hotfixes

For critical production bugs:
- Review within 1 hour
- Focus only on the fix
- Don't nitpick style
- Approve if it fixes the bug

### Large PRs (500+ lines)

- Ask author to break into smaller PRs
- Or schedule live review call
- Focus on high-level architecture first

### External Contributors

- Extra thorough security review
- Verify they signed CLA (if we have one)
- Be welcoming and educational
- Thank them for contributing

## Review Etiquette

### For Reviewers

**Do**:
- Review promptly
- Be respectful and constructive
- Ask questions if confused
- Praise good work
- Explain your reasoning

**Don't**:
- Be dismissive or rude
- Block PR on minor style issues
- Leave comments without explaining why
- Approve without actually reviewing
- Request changes and disappear

### For Authors

**Do**:
- Accept feedback gracefully
- Explain your reasoning if you disagree
- Fix blocking issues immediately
- Thank reviewers

**Don't**:
- Take it personally
- Argue unnecessarily
- Ignore comments
- Mark conversations resolved without fixing
- Merge without approval

## Tools

### GitHub Features

- **Review mode**: See all changes in context
- **Suggestions**: Propose code changes inline
- **Threads**: Keep discussions organized
- **Resolve**: Mark conversations resolved

### Chrome Extensions

- **Refined GitHub**: Better UI for reviews
- **Octotree**: File tree sidebar
- **GitHub Dark Theme**: Easier on eyes

## Examples of Good Reviews

### Example 1: Security Issue

```
🚨 BLOCKING: Line 23 exposes the service role key to the client

This key should only be used server-side. Move this logic to an API route.

See: lib/supabase/service.ts for example of proper usage.
```

### Example 2: Performance Suggestion

```
💡 Suggestion: This could be optimized with Promise.all

Current: Runs 3 API calls sequentially (~3s)
Proposed: Run in parallel (~1s)

const [conversations, documents, employees] = await Promise.all([
  fetchConversations(),
  fetchDocuments(),
  fetchEmployees(),
])
```

### Example 3: Positive Feedback

```
✨ Love this! The animation is super smooth and the code is very readable.

Minor suggestion: Consider extracting the animation duration (300ms) to a constant
so it's easy to adjust later.
```

## Anti-Patterns to Watch For

### useState for Everything

```typescript
// ❌ Too many states
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)
const [data, setData] = useState(null)

// ✅ Combine related state
const [state, setState] = useState({ loading: false, error: null, data: null })
```

### Prop Drilling

```typescript
// ❌ Passing props through 5 levels
<A><B><C><D><E data={data} /></D></C></B></A>

// ✅ Use context or state management
const DataContext = createContext()
```

### Premature Optimization

```typescript
// ❌ Micro-optimizing before it's a problem
const memoizedValue = useMemo(() => value, [value])

// ✅ Optimize when it's actually slow
// Most React renders are fast enough without optimization
```

## Questions?

- Slack: #engineering
- Review examples: Search GitHub for "approved PRs"
- Ask Werkly AI!

---

**Last Updated**: December 2024
**Maintainer**: Engineering Team
