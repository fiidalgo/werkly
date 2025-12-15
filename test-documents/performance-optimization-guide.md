# Performance Optimization Guide

## Overview

Fast applications create better user experiences. This guide covers performance optimization techniques for Werkly.

## Frontend Performance

### React Optimization

**Avoid unnecessary re-renders**:

```typescript
// ❌ Creates new object every render
<Component style={{ marginTop: 10 }} />

// ✅ Define outside component
const styles = { marginTop: 10 }
<Component style={styles} />
```

**Use proper dependencies**:

```typescript
// ❌ Missing dependency
useEffect(() => {
  fetchData(userId)
}, []) // userId missing!

// ✅ All dependencies included
useEffect(() => {
  fetchData(userId)
}, [userId])
```

**Memoize expensive computations**:

```typescript
// ❌ Recalculates every render
const sortedItems = items.sort((a, b) => ...)

// ✅ Only recalculates when items change
const sortedItems = useMemo(
  () => items.sort((a, b) => ...),
  [items]
)
```

**When to optimize**:
- Large lists (> 100 items)
- Complex calculations
- Expensive DOM operations

**When not to optimize**:
- Small lists (< 50 items)
- Simple operations
- Before measuring (premature optimization!)

### Next.js Optimization

**Use Server Components**:

```typescript
// ✅ Server Component (default)
async function Page() {
  const data = await fetchData() // No API call needed!
  return <div>{data}</div>
}

// ❌ Client Component (when not needed)
"use client"
function Page() {
  const [data, setData] = useState()
  useEffect(() => { fetchData() }, []) // Extra API call
}
```

**Dynamic imports**:

```typescript
// ❌ Loads PDF parser for everyone
import pdfParse from 'pdf-parse'

// ✅ Only loads when needed
const pdfParse = await import('pdf-parse')
```

**Image optimization**:

```typescript
// ❌ Regular img tag
<img src="/logo.png" />

// ✅ Next.js Image
import Image from 'next/image'
<Image src="/logo.png" width={200} height={50} alt="Logo" />
```

### Bundle Size

**Check bundle size**:
```bash
npm run build
# Look for large chunks in output
```

**Reduce**:
- Remove unused dependencies
- Use dynamic imports
- Tree-shake properly
- Avoid large libraries

**Target**: < 250KB per route

### Lighthouse Scores

**Run audit**:
Chrome DevTools → Lighthouse → Generate report

**Targets**:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

**Common issues**:
- Large images (optimize with Next.js Image)
- No lazy loading (use dynamic imports)
- Render-blocking resources (inline critical CSS)

## Backend Performance

### Database Queries

**Use indexes**:

```sql
-- ❌ Slow - full table scan
SELECT * FROM documents WHERE filename = 'test.pdf';

-- ✅ Fast - uses index
CREATE INDEX idx_documents_filename ON documents(filename);
SELECT * FROM documents WHERE filename = 'test.pdf';
```

**Limit results**:

```typescript
// ❌ Fetches all conversations
const { data } = await supabase
  .from('conversations')
  .select('*')

// ✅ Fetches only what's needed
const { data } = await supabase
  .from('conversations')
  .select('*')
  .order('updated_at', { ascending: false })
  .limit(50)
```

**Select specific columns**:

```typescript
// ❌ Fetches everything
.select('*')

// ✅ Only what you need
.select('id, title, updated_at')
```

**Avoid N+1 queries**:

```typescript
// ❌ N+1 - queries in a loop
for (const doc of documents) {
  const embeddings = await getEmbeddings(doc.id) // N queries!
}

// ✅ Single query with join
const docs = await supabase
  .from('documents')
  .select('*, embeddings:document_embeddings(*)')
```

### API Response Times

**Targets**:
- Simple queries: < 200ms
- Complex queries: < 500ms
- RAG chat first token: < 1.5s
- Document upload: < 2s

**Optimization techniques**:

**Parallel processing**:

```typescript
// ❌ Sequential - 3s total
const docs = await fetchDocs() // 1s
const users = await fetchUsers() // 1s
const settings = await fetchSettings() // 1s

// ✅ Parallel - 1s total
const [docs, users, settings] = await Promise.all([
  fetchDocs(),
  fetchUsers(),
  fetchSettings(),
])
```

**Caching** (future):

```typescript
// Cache expensive operations
const cached = await redis.get(key)
if (cached) return cached

const result = await expensiveOperation()
await redis.set(key, result, { ex: 300 }) // 5 min cache
return result
```

**Streaming**:

```typescript
// ❌ Buffer entire response - slow first byte
const fullResponse = await generateLongResponse()
return NextResponse.json(fullResponse)

// ✅ Stream - fast first byte
const stream = generateLongResponse()
return new Response(stream)
```

### Vector Search Optimization

**Current approach**:
- IVFFlat index
- Cosine similarity
- Company filtering

**Metrics**:
- Search time: ~200ms for 10K embeddings
- Scales to: ~1M embeddings

**Optimization**:

**Tune index**:

```sql
-- For < 10K embeddings
CREATE INDEX idx_embeddings_vector ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- For 100K+ embeddings
CREATE INDEX idx_embeddings_vector ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 300);

-- Rule: lists = sqrt(total_rows)
```

**Pre-filter by company**:

```sql
-- ✅ Filter first, then search
SELECT * FROM document_embeddings
WHERE company_id = '...'  -- Uses index
ORDER BY embedding <=> query_vector
LIMIT 5;
```

## Monitoring Performance

### Metrics to Track

**Frontend**:
- Time to first paint
- Time to interactive
- Largest contentful paint
- Cumulative layout shift

**Backend**:
- API response time (p50, p95, p99)
- Database query time
- Error rate
- Function duration

**Business**:
- Chat response time
- Document processing time
- Search accuracy

### Tools

**Vercel Analytics**:
- Real user monitoring
- Core web vitals
- Function performance

**Browser DevTools**:
- Performance tab
- Network tab
- Lighthouse

**Supabase Logs**:
- Query performance
- Slow query log

## Common Bottlenecks

### 1. Unoptimized Images

**Issue**: Large PNG/JPG files slow page load

**Solution**:
- Use Next.js `Image` component
- Serve WebP format
- Lazy load below fold

### 2. Large JavaScript Bundles

**Issue**: > 500KB bundles slow initial load

**Solution**:
- Code split with dynamic imports
- Remove unused dependencies
- Tree-shake properly

### 3. Slow Database Queries

**Issue**: Queries taking > 1s

**Solution**:
- Add indexes
- Limit results
- Select specific columns
- Use joins instead of N+1

### 4. OpenAI API Latency

**Issue**: 2-3s for first token

**Solution**:
- Streaming (don't wait for full response)
- Show loading state immediately
- Optimize prompt length
- Consider caching common queries (future)

### 5. Too Many Re-renders

**Issue**: Component renders 10+ times per interaction

**Solution**:
- Check useEffect dependencies
- Memoize values
- Split components (don't pass everything as props)

## Load Testing

### Why Load Test?

Find performance issues before users do!

**Test before**:
- Major launches
- Marketing campaigns
- Big customer onboarding

### Tools

**Apache Bench** (simple):
```bash
ab -n 1000 -c 10 https://werkly.com/api/chat
```

**k6** (advanced):
```javascript
import http from 'k6/http';

export default function () {
  http.post('https://werkly.com/api/chat', 
    JSON.stringify({ messages: [...] })
  );
}
```

### Interpreting Results

**Good performance**:
- p50 < 500ms
- p95 < 2s
- Error rate < 0.1%
- Throughput > 100 req/s

**Red flags**:
- p95 > 5s
- Error rate > 1%
- Increasing latency under load
- Memory leaks

## Performance Budget

### Targets

**Page load** (Initial):
- < 2s on 3G
- < 1s on 4G/WiFi
- < 500ms repeat visits

**Interaction**:
- < 100ms response to user action
- < 16ms for 60fps animations

**API**:
- < 200ms for simple queries
- < 500ms for complex queries
- < 1.5s for first AI token

### Monitoring

**Alert if**:
- p95 > 3s (3 of 100 requests slow)
- Error rate > 1%
- Downtime > 1 minute

## Quick Wins

### 1. Add Indexes

```sql
-- Before: 2s query time
SELECT * FROM documents WHERE company_id = '...';

-- After: 50ms query time
CREATE INDEX idx_documents_company ON documents(company_id);
```

### 2. Limit Results

```typescript
// Before: Fetch 10,000 rows
.select('*')

// After: Fetch 50 rows
.select('*').limit(50)
```

### 3. Use React.memo for Expensive Components

```typescript
// Before: Re-renders on every parent render
function ExpensiveComponent({ data }) { ... }

// After: Only re-renders when data changes
const ExpensiveComponent = React.memo(({ data }) => { ... })
```

### 4. Debounce User Input

```typescript
// Before: Search on every keystroke
onChange={(e) => search(e.target.value)}

// After: Search after 300ms pause
onChange={(e) => debouncedSearch(e.target.value)}
```

### 5. Streaming for Long Responses

```typescript
// Before: Wait for full response (5s)
const fullResponse = await generateResponse()
return NextResponse.json(fullResponse)

// After: Stream chunks (500ms to first byte)
const stream = generateResponse()
return new Response(stream)
```

## Measuring Impact

### Before & After

**Always measure**:
1. Baseline metrics before optimization
2. Implement optimization
3. Measure again
4. Calculate improvement

**Example**:
```
Feature: Chat API
Before: p95 = 3.2s
After: p95 = 1.1s
Improvement: 66% faster
```

### Cost-Benefit

**Consider**:
- Time to implement
- Complexity added
- Performance gained

**Worth it if**:
- High-traffic feature
- Significant improvement (> 30%)
- Low complexity

**Not worth it if**:
- Rarely used feature
- Minor improvement (< 10%)
- High complexity

## Resources

- Web Vitals: https://web.dev/vitals
- Next.js Performance: https://nextjs.org/docs/app/building-your-application/optimizing
- React Performance: https://react.dev/learn/render-and-commit
- #engineering Slack
- Ask Werkly AI!

---

**Last Updated**: December 2024
**Maintainer**: Engineering Team
