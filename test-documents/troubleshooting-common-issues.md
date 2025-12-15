# Troubleshooting Common Issues

## Overview

Quick solutions to common problems you might encounter at Werkly.

## Development Issues

### "npm install" Fails

**Symptoms**:
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions**:
1. Try with legacy peer deps:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Clear cache and retry:
   ```bash
   rm -rf node_modules package-lock.json
   npm cache clean --force
   npm install
   ```

3. Check Node version:
   ```bash
   node -v  # Should be v18 or v20
   nvm use 20  # If using nvm
   ```

### "npm run dev" Won't Start

**Symptoms**:
- Port 3000 already in use
- Module not found errors
- Environment variable errors

**Solutions**:

**Port already in use**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

**Module not found**:
```bash
# Install dependencies
npm install

# Clear Next.js cache
rm -rf .next
npm run dev
```

**Environment variables**:
```bash
# Check .env.local exists
ls -la .env.local

# Copy from example if missing
cp .env.example .env.local

# Fill in actual values
code .env.local
```

### TypeScript Errors

**Symptoms**:
```
Type error: Property 'X' does not exist on type 'Y'
```

**Solutions**:

1. **Check types file**: `lib/types/database.ts`
2. **Use ts-ignore temporarily**:
   ```typescript
   // @ts-ignore
   const value = obj.property
   ```

3. **Type the variable**:
   ```typescript
   const data: MyType = await fetchData()
   ```

4. **Restart TypeScript server** (VSCode):
   - Cmd+Shift+P → "Restart TS Server"

### Hot Reload Not Working

**Solutions**:

```bash
# Clear cache
rm -rf .next

# Restart dev server
# Ctrl+C
npm run dev
```

### Build Fails Locally

**Symptoms**:
```
npm run build
Failed to compile
```

**Solutions**:

1. **Check TypeScript errors** (shown in output)
2. **Fix all type errors**
3. **Ensure all imports exist**
4. **Check for syntax errors**
5. **Try clean build**:
   ```bash
   rm -rf .next
   npm run build
   ```

## Authentication Issues

### Can't Log In

**Symptoms**:
- "Invalid credentials" error
- Stuck on login page
- Redirect loop

**Solutions**:

**Check email spelling**: Common typo

**Clear browser data**:
1. Open DevTools (F12)
2. Application → Storage → Clear site data
3. Try again

**Reset password**:
1. Click "Forgot password" on login
2. Check email (including spam)
3. Follow reset link

**Check Supabase**:
- Verify user exists in auth.users
- Check email_confirmed_at
- Review auth logs

**Still stuck?**: Contact support@werkly.com

### "User not associated with a company"

**Cause**: Your profile doesn't have a company_id

**Solution** (if employee):
- Ask your employer to add you via Employees page
- Provide them your email address

**Solution** (if employer):
- This shouldn't happen (created during signup)
- Contact support@werkly.com

### Session Expired

**Symptoms**:
- Logged out unexpectedly
- Have to log in frequently

**Solutions**:
- **Check browser settings**: Allow cookies
- **Incognito mode**: Try logging in there
- **Clear cache**: Clear and try again

## Chat Issues

### AI Not Responding

**Symptoms**:
- Loading forever
- Error message
- Blank response

**Checks**:

1. **Check OpenAI API key** (in Vercel env vars)
2. **Check console errors** (F12 → Console)
3. **Check Vercel logs** (for API errors)
4. **Check OpenAI status**: status.openai.com

**Common causes**:
- OpenAI API down
- Rate limit hit
- Invalid API key
- Network timeout

### No Relevant Context Found

**Symptoms**:
- AI doesn't use company docs
- Generic responses
- Console shows "No relevant context found"

**Checks**:

1. **Are documents uploaded?** (Check Documents page)
2. **Are they processed?** (Status should be "completed")
3. **Are you in a company?** (Employee must be added by employer)
4. **Check database**:
   ```sql
   SELECT COUNT(*) FROM document_embeddings 
   WHERE company_id = 'your-company-id';
   ```

**Solutions**:
- Upload documents if none exist
- Wait for processing to complete
- Have employer add you to company
- Try more specific questions

### Streaming Stops Mid-Response

**Cause**: Network timeout or OpenAI API issue

**Solutions**:
- Refresh and try again
- Check network connection
- Check OpenAI status
- Contact support if persistent

## Document Upload Issues

### Upload Fails

**Symptoms**:
- Error message
- File doesn't appear in list
- Progress bar stuck

**Common causes**:

**File too large**:
- Max: 50MB
- Solution: Split or compress file

**Unsupported type**:
- Allowed: PDF, DOCX, DOC, TXT, MD
- Solution: Convert to supported format

**Storage quota exceeded**:
- Contact support to increase limit

**Network issue**:
- Check internet connection
- Try again

### Processing Stuck on "Pending"

**Symptoms**:
- Document status stays "pending"
- Never moves to "processing" or "completed"

**Solutions**:

1. **Wait 2 minutes** (processing is automatic)
2. **Check Vercel logs** for errors
3. **Refresh page** to see updated status
4. **If > 5 minutes**, contact support

### Processing Failed

**Check error message** in document list (hover over "failed" badge)

**Common errors**:
- "No text extracted" → PDF might be scanned image
- "Unsupported format" → Check file type
- "OpenAI API error" → Temporary, try re-uploading

## Supabase Issues

### RLS Blocking Query

**Symptoms**:
```
new row violates row-level security policy for table "X"
```

**Cause**: Query doesn't match RLS policy

**Solutions**:

1. **Check you're authenticated**: `await supabase.auth.getUser()`
2. **Use correct client**:
   - User queries: `createClient()` (respects RLS)
   - System operations: `createServiceClient()` (bypasses RLS)
3. **Verify company_id** matches
4. **Check policy** in Supabase dashboard

### Connection Pool Exhausted

**Symptoms**:
```
remaining connection slots are reserved
```

**Cause**: Too many database connections

**Solutions**:

1. **Short-term**: Restart application
2. **Long-term**: 
   - Close connections properly
   - Use connection pooling
   - Increase pool size in Supabase

### Slow Queries

**Symptoms**: API takes > 5s to respond

**Checks**:

1. **Find slow queries** in Supabase logs
2. **Check for missing indexes**:
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM documents WHERE company_id = '...';
   ```

3. **Add indexes** if needed:
   ```sql
   CREATE INDEX idx_documents_company ON documents(company_id);
   ```

## Vercel Issues

### Deployment Failed

**Check Vercel build logs** for errors

**Common errors**:

**TypeScript errors**:
- Fix in code
- Push again

**Missing env variables**:
- Add in Vercel dashboard
- Redeploy

**Build timeout**:
- Reduce bundle size
- Optimize imports
- Contact Vercel support

### Function Timeout

**Symptoms**:
```
Function exceeded timeout of 10s
```

**Solutions**:

1. **Optimize function** (reduce processing time)
2. **Use streaming** (for long responses)
3. **Move to background job** (for heavy processing)
4. **Increase timeout** (Vercel dashboard, Pro plan only)

## Browser-Specific Issues

### Safari

**Issue**: Cookies not persisting
**Solution**: Check "Prevent cross-site tracking" is OFF

**Issue**: Sidebar animation janky
**Solution**: Known issue, fix coming in v2.1.1

### Firefox

**Issue**: Input not focusing on page load
**Solution**: Click input manually (fix coming)

### Chrome

**Generally works best** - use for development

## Network Issues

### CORS Errors

**Symptoms**:
```
Access-Control-Allow-Origin error
```

**Cause**: Usually misconfigured API call

**Solution**:
- Verify API URL is correct
- Check if using https (not http)
- Use relative URLs (`/api/chat` not full URL)

### Timeout Errors

**Symptoms**:
- Request hangs forever
- Eventually times out

**Solutions**:
- Check internet connection
- Check API is running (Vercel status)
- Check firewall/VPN not blocking
- Try different network

## Data Issues

### Embeddings Not Created

**Symptoms**:
- Document status "completed"
- But no results in search
- Database shows 0 embeddings

**Check**:
```sql
SELECT COUNT(*) FROM document_embeddings
WHERE document_id = 'your-document-id';
```

**Solutions**:
- Check OpenAI API key is valid
- Check API logs for errors during processing
- Try re-uploading document
- Contact support

### User Not in Company

**Symptoms**:
- Employee can't search docs
- "User not associated with company" error

**Solution**:
- Employer must add employee via Employees page
- Check profile has company_id:
  ```sql
  SELECT company_id FROM profiles WHERE id = 'user-id';
  ```

## When to Contact Support

### Contact support@werkly.com if:

- Issue persists after trying solutions
- Data loss or corruption
- Security concerns
- Billing questions
- Feature doesn't work as documented

### Include in report:

- **What you're trying to do**
- **What's happening instead**
- **Steps to reproduce**
- **Browser and OS**
- **Screenshots** (if relevant)
- **Console errors** (F12 → Console → screenshot)

### Response times:

- **P0 (Critical)**: < 15 minutes
- **P1 (High)**: < 1 hour
- **P2 (Medium)**: < 4 hours
- **P3 (Low)**: < 24 hours

## Quick Fixes

### Restart Everything

When in doubt:

```bash
# Stop dev server
Ctrl+C

# Clear all caches
rm -rf .next node_modules

# Reinstall
npm install

# Restart
npm run dev
```

**Success rate**: ~60% of issues

### Browser Reset

```
1. Clear site data (DevTools → Application → Clear)
2. Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Restart browser
4. Try incognito mode
```

**Success rate**: ~40% of frontend issues

### Check Status Pages

Before debugging, check if services are down:
- **Vercel**: status.vercel.com
- **Supabase**: status.supabase.com
- **OpenAI**: status.openai.com

If services are down, wait for restoration.

## Resources

- **Status page**: status.werkly.com
- **Support email**: support@werkly.com
- **Slack**: #help
- **Documentation**: handbook.werkly.com
- **Ask Werkly AI**: It knows these docs!

---

**Last Updated**: December 2024
**Maintainer**: Support Team
