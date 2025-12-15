# Deployment Procedures

## Overview

Werkly uses Vercel for frontend deployment with automated CI/CD. This guide covers deployment process and best practices.

## Deployment Pipeline

```
Push to main
    ↓
GitHub webhook
    ↓
Vercel build
    ↓
TypeScript check
    ↓
Build Next.js
    ↓
Deploy to production
    ↓
Health check
```

**Average deployment time**: 2-3 minutes

## Environments

### Production

- **URL**: https://werkly.com
- **Branch**: `main`
- **Auto-deploy**: Yes (on merge to main)
- **Access**: All users

### Preview

- **URL**: Unique per PR (e.g., `werkly-pr-123.vercel.app`)
- **Branch**: Any feature branch
- **Auto-deploy**: Yes (on PR creation)
- **Access**: Team only

### Development

- **URL**: http://localhost:3000
- **Branch**: Any local branch
- **Manual**: `npm run dev`

## Deployment Process

### Automatic (Recommended)

1. **Create PR** from feature branch
2. **Vercel builds preview** automatically
3. **Review preview** deployment
4. **Merge PR** to main
5. **Vercel deploys to production** automatically
6. **Monitor** for errors

### Manual (Emergency Only)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy current directory
vercel --prod

# Requires: Team member permissions
```

## Pre-Deployment Checklist

Before merging to main:

- [ ] All tests pass locally
- [ ] Build succeeds: `npm run build`
- [ ] Preview deployment works
- [ ] No console errors in preview
- [ ] Database migrations applied (if any)
- [ ] Environment variables updated (if needed)
- [ ] Breaking changes communicated to team
- [ ] Rollback plan documented (if risky change)

## Environment Variables

### Adding New Variables

**In Vercel Dashboard**:
1. Project Settings → Environment Variables
2. Add variable name and value
3. Select environments (Production, Preview, Development)
4. Redeploy to apply

**For preview deployments**:
- Use same values as production (usually)
- Or set up separate preview values

**Types**:
- `NEXT_PUBLIC_*` - Exposed to browser
- Regular - Server-only

### Required Variables

Production must have:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

## Database Migrations

### Before Deploying Code That Needs Schema Changes

1. **Run migration in Supabase SQL Editor first**
2. **Verify it works** (check tables created)
3. **Then deploy code** that uses new schema

**Order matters**:
```
❌ BAD: Deploy code → Run migration (app breaks!)
✅ GOOD: Run migration → Deploy code (seamless)
```

### Migration Checklist

- [ ] Backup database (Supabase does this automatically)
- [ ] Test migration on local Supabase instance
- [ ] Run migration on production
- [ ] Verify tables/columns exist
- [ ] Deploy code
- [ ] Monitor for errors

## Monitoring Deployments

### Vercel Dashboard

Check:
- **Deployment status**: Building, Ready, Error
- **Function logs**: Real-time API logs
- **Analytics**: Traffic, errors, performance

### Health Checks

After deployment, verify:

```bash
# Check homepage
curl https://werkly.com

# Check API health
curl https://werkly.com/api/health

# Check authentication
# Visit https://werkly.com/login and test
```

### Key Metrics

- **Uptime**: Should be 99.9%+
- **Response time**: < 2s for API routes
- **Error rate**: < 0.1%
- **Build time**: 2-3 minutes

## Rollback Procedures

### Instant Rollback (Vercel)

1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"
4. Confirm

**Time to rollback**: ~30 seconds

### Git Rollback

```bash
# Revert last commit on main
git checkout main
git revert HEAD
git push origin main

# This creates a new commit that undoes changes
# Triggers new deployment
```

## Troubleshooting Failed Deployments

### Build Failed

**Check**:
1. Vercel build logs
2. TypeScript errors
3. Missing dependencies
4. Environment variables

**Common fixes**:
```bash
# Locally test build
npm run build

# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Deployed But Broken

**Check**:
1. Function logs for errors
2. Browser console for client errors
3. Supabase logs for DB errors
4. Environment variables set correctly

**Quick fix**: Rollback immediately, debug locally

### Slow Performance

**Check**:
1. Function duration in logs
2. Database query performance
3. External API latency (OpenAI)
4. Large bundle size

## Database Backups

### Automatic Backups

Supabase automatically backs up:
- **Daily**: Last 7 days
- **Weekly**: Last 4 weeks (Pro plan)

### Manual Backup

```bash
# Using Supabase CLI
supabase db dump -f backup_$(date +%Y%m%d).sql

# Restore
psql -h db.xxx.supabase.co -U postgres -f backup.sql
```

## Deployment Windows

### Preferred Times

- **Weekdays**: 10am - 4pm PT (team is online)
- **Avoid**: Fridays after 2pm, weekends, holidays

### Emergency Deploys

For critical bugs:
- Any time is acceptable
- Notify team in #engineering
- Monitor for 30 minutes after
- Document in incident log

## Vercel Configuration

### vercel.json

We don't use a custom config currently, but here's how:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "installCommand": "npm install"
}
```

### Custom Domains

- `werkly.com` → Production
- `app.werkly.com` → Production (alternative)
- `*.vercel.app` → Preview deployments

## Performance Optimization

### Bundle Size

Check: Vercel Analytics → Functions

**Target**: < 250KB per route

**Tips**:
- Use dynamic imports for large components
- Lazy load non-critical code
- Optimize images (use Next.js Image component)

### Caching

Next.js automatically caches:
- Static pages
- API routes (with `revalidate`)
- Images

## Security

### Deployment Secrets

- **Never** commit `.env.local`
- Store in Vercel dashboard only
- Rotate regularly
- Use separate keys for preview vs production

### Access Control

**Who can deploy**:
- Admins: Full access
- Engineers: Can deploy to preview
- External: No access

## Incident Response

### If Production is Down

1. **Alert team**: Post in #incidents immediately
2. **Assess**: Check Vercel status, logs
3. **Rollback**: If recent deployment caused it
4. **Fix**: If external issue (Supabase, OpenAI)
5. **Document**: Write post-mortem

### Post-Mortem Template

```markdown
## Incident: [Brief description]
**Date**: Dec 14, 2024
**Duration**: 15 minutes
**Severity**: P1 (Production down)

**Timeline**:
- 10:00 AM: Deployment to main
- 10:05 AM: Users report errors
- 10:07 AM: Team alerted
- 10:10 AM: Rollback initiated
- 10:15 AM: Production restored

**Root Cause**: Database migration not applied before code deployment

**Resolution**: Applied migration, redeployed

**Action Items**:
- [ ] Update deployment checklist
- [ ] Add pre-deploy migration check
- [ ] Add monitoring for this error

**Prevention**: Always run migrations before code deploys
```

## Resources

- Vercel docs: https://vercel.com/docs
- Vercel status: https://vercel-status.com
- #engineering Slack
- #incidents Slack (for emergencies)

## Questions?

Ask in #engineering or consult with DevOps team.

---

**Last Updated**: December 2024
**Maintainer**: DevOps Team
