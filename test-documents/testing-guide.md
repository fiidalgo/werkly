# Testing Guide

## Testing Philosophy

At Werkly, we believe in pragmatic testing: test what matters, don't over-test, and prioritize user-facing functionality.

## Testing Stack

Currently in MVP phase:
- **Manual testing**: Primary method
- **TypeScript**: Type safety as first line of defense
- **Build validation**: `npm run build` catches type errors

**Future additions**:
- Jest (unit tests)
- Playwright (E2E tests)
- Vitest (fast unit testing)

## Manual Testing Checklist

### Before Every PR

**Authentication Flow**:
- [ ] Signup with valid email
- [ ] Signup with duplicate email (should fail)
- [ ] Signup with weak password (should fail)
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Logout

**Dashboard (Employee)**:
- [ ] Chat loads correctly
- [ ] Can send message
- [ ] Response streams in real-time
- [ ] Markdown renders correctly
- [ ] Conversation saved
- [ ] Conversation appears in sidebar
- [ ] Can load previous conversation
- [ ] Settings page loads

**Dashboard (Employer)**:
- [ ] All employee features work
- [ ] Documents tab visible
- [ ] Can upload document
- [ ] Document processes successfully
- [ ] Can delete document
- [ ] Employees tab visible
- [ ] Can add employee
- [ ] Employee list shows correctly

**Responsive Design**:
- [ ] Test on mobile viewport (375px)
- [ ] Test on tablet (768px)
- [ ] Test on desktop (1440px)

### Edge Cases

**Empty States**:
- [ ] New user with no conversations
- [ ] Employer with no documents
- [ ] Employer with no employees
- [ ] Chat with no context found

**Error States**:
- [ ] Network offline
- [ ] API returns error
- [ ] File upload fails
- [ ] Invalid file type

**Loading States**:
- [ ] Chat is streaming
- [ ] Document is processing
- [ ] Page is loading

## Testing Environments

### Local Development

```bash
npm run dev
```

**Test against**:
- Local Supabase (if using local instance)
- Or production Supabase (be careful!)

### Preview Deployments

- Automatically created for PRs
- Use for manual testing before merge
- Share with QA team

### Production

- **Never test in production**
- Only verify after deployment
- Use real accounts sparingly

## Common Test Scenarios

### Test 1: New User Onboarding

```
1. Visit werkly.com
2. Click "Get Started"
3. Sign up as employer with company name
4. Verify redirect to dashboard
5. Upload sample document
6. Wait for processing
7. Ask question related to document
8. Verify context-aware response
```

**Expected**: Seamless flow, no errors

### Test 2: Employee Adding Flow

```
1. Log in as employer
2. Go to Employees tab
3. Add employee by email (must exist)
4. Log out
5. Log in as employee
6. Ask question about company docs
7. Verify gets context from docs
```

**Expected**: Employee can search company documents

### Test 3: Conversation Persistence

```
1. Start new chat
2. Send 3 messages
3. Navigate to Settings
4. Go back to Dashboard
5. Verify conversation still loaded
6. Refresh page
7. Verify conversation in sidebar
8. Click conversation
9. Verify full history loads
```

**Expected**: No data loss, history persists

## Testing Best Practices

### Test Early, Test Often

Don't wait until "done" to test. Test:
- After every significant change
- Before pushing to GitHub
- After seeing preview deployment
- Before approving PRs

### Test Like a User

- Don't just test happy path
- Try to break things
- Use different browsers
- Test on actual mobile devices
- Be impatient (don't wait for loading)
- Make typos
- Try invalid inputs

### Document Bugs

Found a bug? Create GitHub issue:

```markdown
## Bug: Chat doesn't scroll to bottom

**Steps to reproduce**:
1. Load conversation with 20+ messages
2. Send new message
3. Observe: doesn't auto-scroll

**Expected**: Should scroll to latest message
**Actual**: Stays at current position

**Browser**: Chrome 120
**Device**: MacBook Pro
**Screenshot**: [attach]
```

## Browser Compatibility

### Officially Supported

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

### Mobile

- **iOS Safari**: Latest version
- **Android Chrome**: Latest version

### Not Supported

- Internet Explorer (dead)
- Opera Mini
- Browsers older than 2 versions

## Performance Testing

### Lighthouse Audit

```bash
# Run in Chrome DevTools
# Lighthouse tab → Generate report
```

**Targets**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

### Load Testing

For API endpoints:

```bash
# Using Apache Bench
ab -n 1000 -c 10 https://werkly.com/api/chat

# Or use k6, Artillery, etc.
```

**Targets**:
- API response: < 2s
- Chat first token: < 1.5s
- Vector search: < 500ms

## Debugging Tools

### Browser DevTools

- **Console**: Check for errors
- **Network**: Monitor API calls
- **React DevTools**: Inspect component state
- **Application**: Check localStorage, cookies

### Vercel Logs

- Real-time function logs
- Filter by status code
- Search by error message

### Supabase Logs

- API logs
- Auth logs
- Database logs

## Test Data

### Creating Test Users

```sql
-- Check Supabase Auth dashboard
-- Or use signup flow

-- For bulk testing, use + addressing:
user+test1@example.com
user+test2@example.com
```

### Resetting Test Data

```sql
-- Clear test conversations
DELETE FROM conversations WHERE user_id = 'test-user-id';

-- Clear test documents
DELETE FROM documents WHERE company_id = 'test-company-id';

-- Careful: This deletes embeddings via CASCADE
```

## Future: Automated Testing

### Unit Tests (Coming Soon)

```typescript
// Example: lib/text-extraction/index.test.ts
import { chunkText } from './index'

describe('chunkText', () => {
  it('should chunk text correctly', () => {
    const text = "A".repeat(1500)
    const chunks = chunkText(text, 1000, 200)
    expect(chunks.length).toBe(2)
    expect(chunks[0].length).toBe(1000)
  })
})
```

### E2E Tests (Coming Soon)

```typescript
// Example: tests/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can sign up and log in', async ({ page }) => {
  await page.goto('https://werkly.com')
  await page.click('text=Get Started')
  // ... test flow
})
```

### CI Pipeline (Coming Soon)

```yaml
# .github/workflows/test.yml
name: Test
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm run build
      - run: npm test
```

## QA Process

### For New Features

1. **Dev testing**: Developer tests locally
2. **Preview deployment**: Create PR, test preview
3. **Peer review**: Another engineer tests
4. **Merge**: Deploy to production
5. **Smoke test**: Quick production verification

### For Bug Fixes

1. **Reproduce bug**: Verify it exists
2. **Fix locally**: Test fix works
3. **Verify fix**: Test edge cases
4. **Deploy**: Same as features
5. **Verify in production**: Bug is gone

## Resources

- Jest docs: https://jestjs.io
- Playwright docs: https://playwright.dev
- Testing best practices: https://kentcdodds.com/blog/write-tests
- #engineering Slack

---

**Last Updated**: December 2024
**Maintainer**: Engineering Team
