# Backend Performance Optimization

## Overview

This guide covers backend-specific performance optimization techniques for Werkly's APIs and database.

## Database Performance

### Query Optimization

**Use EXPLAIN ANALYZE**:

```sql
EXPLAIN ANALYZE
SELECT * FROM document_embeddings
WHERE company_id = 'abc-123'
ORDER BY embedding <=> '[...]'::vector
LIMIT 5;
```

**Look for**:
- Seq Scan (bad) → Add index
- Index Scan (good)
- Execution time
- Planning time

### Index Strategy

**Create indexes for**:
- Foreign keys (company_id, user_id)
- Filters in WHERE clauses
- ORDER BY columns
- JOIN columns

**Example**:
```sql
-- Before: 2000ms (Seq Scan)
SELECT * FROM conversations WHERE user_id = '...';

-- Add index
CREATE INDEX idx_conversations_user ON conversations(user_id);

-- After: 5ms (Index Scan)
```

**Vector indexes**:

```sql
CREATE INDEX idx_embeddings_vector 
ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

**Tuning**:
- `lists`: √(total_rows) for IVFFlat
- Higher = more accurate but slower build
- Lower = faster build but less accurate
- Rebuild as data grows

### Connection Pooling

**Issue**: Creating new DB connection per request is slow

**Solution**: Supabase handles this automatically

**Monitor**:
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check connection limits
SHOW max_connections;
```

**If hitting limits**:
- Ensure connections are closed properly
- Use Supabase connection pooler
- Increase max_connections (last resort)

### Query Patterns

**Batch operations**:

```typescript
// ❌ N queries in loop
for (const id of ids) {
  await supabase.from('docs').select().eq('id', id)
}

// ✅ Single query
await supabase.from('docs').select().in('id', ids)
```

**Pagination**:

```typescript
// ❌ Fetches all rows (slow on large tables)
const { data } = await supabase
  .from('conversations')
  .select('*')

// ✅ Paginated
const { data } = await supabase
  .from('conversations')
  .select('*')
  .range(0, 49) // First 50 rows
```

**Select only needed columns**:

```typescript
// ❌ Fetches all columns (including large ones)
.select('*')

// ✅ Only needed columns
.select('id, title, updated_at')
```

## API Performance

### Response Time Goals

**Current targets**:
- Simple GET: < 200ms
- Complex query: < 500ms
- RAG search: < 300ms
- Chat first token: < 1.5s

**Measurement**: Vercel Analytics

### Streaming

**For long responses**:

```typescript
// ❌ Buffer entire response (slow first byte)
const fullResponse = await generateLongResponse()
return NextResponse.json(fullResponse)

// ✅ Stream chunks (fast first byte)
const stream = new ReadableStream({
  async start(controller) {
    for await (const chunk of generateChunks()) {
      controller.enqueue(encoder.encode(chunk))
    }
    controller.close()
  }
})

return new Response(stream)
```

**Use for**:
- AI responses (GPT-4)
- Large file downloads
- Real-time data feeds

### Parallel Processing

```typescript
// ❌ Sequential (3s total)
const user = await getUser(id)           // 1s
const company = await getCompany(user.company_id)  // 1s
const docs = await getDocuments(company.id)        // 1s

// ✅ Parallel where possible (1s total)
const [user, generalDocs] = await Promise.all([
  getUser(id),              // 1s
  getDocuments('general'),  // 1s (doesn't depend on user)
])
const company = await getCompany(user.company_id) // 1s (depends on user)
```

### Caching (Future)

**Candidates for caching**:
- User profiles (rarely change)
- Company documents list
- Common query results
- Embeddings (never change)

**Cache strategy**:
```typescript
// Pseudocode
const cached = await redis.get(key)
if (cached) return JSON.parse(cached)

const fresh = await database.query(...)
await redis.set(key, JSON.stringify(fresh), { ex: 300 }) // 5 min TTL

return fresh
```

**Tools to consider**:
- Vercel KV (Redis)
- Upstash
- Cloudflare Workers KV

## OpenAI API Optimization

### Reduce Latency

**Current**: ~1.5s to first token

**Optimizations**:

**1. Shorter prompts**:
```typescript
// ❌ 2000 tokens in context
const context = allDocuments.join('\n\n')

// ✅ 800 tokens (top 5 chunks only)
const context = topChunks.slice(0, 5).join('\n\n')
```

**2. Use streaming**:
```typescript
// ✅ Stream for fast perceived performance
stream: true
```

**3. Lower temperature for faster responses**:
```typescript
temperature: 0.3 // More deterministic, slightly faster
```

**4. Use gpt-4o-mini for non-critical requests** (future):
- Faster
- Cheaper
- Good enough for simple questions

### Reduce Costs

**Current cost**: ~$0.04 per query

**Optimizations**:

**1. Smaller embeddings** (future):
```typescript
// Current: text-embedding-3-small (1536 dim)
// Future: text-embedding-3-small (512 dim)
// Savings: 3x cheaper, slightly less accurate
```

**2. Batch embeddings**:
```typescript
// ❌ 10 separate API calls
for (const chunk of chunks) {
  await createEmbedding(chunk)
}

// ✅ 1 batched API call
await createEmbeddings(chunks) // Up to 2048 inputs
```

**3. Cache common queries** (future):
- "What is Werkly?" asked often
- Cache embedding and results

### Rate Limiting

**OpenAI limits**:
- Tier 1: 500 RPM, 30K TPM
- Tier 2: 5,000 RPM, 300K TPM

**If hitting limits**:
- Implement queue system
- Exponential backoff on 429 errors
- Upgrade OpenAI tier
- Consider alternative providers

## Document Processing

### Current Pipeline

```
Upload → Storage → Extract Text → Chunk → Generate Embeddings → Store
```

**Bottleneck**: Embedding generation (2-5s per chunk)

### Optimizations

**1. Parallel chunk processing**:

```typescript
// ✅ Already implemented
const embeddingPromises = chunks.map(chunk => 
  createEmbedding(chunk)
)
const embeddings = await Promise.all(embeddingPromises)
```

**2. Background processing**:
- Current: User waits for processing
- Future: Return immediately, process in background
- Notify when complete (webhook or polling)

**3. Smart chunking**:

```typescript
// Current: Fixed 1000 char chunks with 200 overlap
chunkText(text, 1000, 200)

// Future: Semantic chunking
// Break at natural boundaries (sections, paragraphs)
chunkBySections(text)
```

**4. Incremental processing** (future):
- Process one document at a time (not all at once)
- Show progress (Document 3 of 10)
- Allow cancellation

## Vector Search Optimization

### Current Performance

**Metrics**:
- Search time: 150-300ms for 10K embeddings
- Accuracy: ~85% relevance
- Cost: ~$0.001 per search

### Improvements

**1. Better index tuning**:

```sql
-- For small datasets (< 10K vectors)
CREATE INDEX ... WITH (lists = 100);

-- For medium datasets (10K-100K)
CREATE INDEX ... WITH (lists = 300);

-- For large datasets (> 100K)
CREATE INDEX ... WITH (lists = 500);

-- Rebuild when data 2x
DROP INDEX idx_embeddings_vector;
CREATE INDEX ...
```

**2. Approximate search** (already using IVFFlat):
- Trades accuracy for speed
- Good enough for RAG (slight quality drop acceptable)

**3. Pre-filter by company**:

```sql
-- ✅ Filter first (uses company_id index)
WHERE company_id = '...'

-- Then search vectors
ORDER BY embedding <=> query_vector
```

**4. Hybrid search** (future):
- Combine vector search (semantic)
- With keyword search (exact matches)
- Weighted combination

## Monitoring & Profiling

### Vercel Analytics

**Key metrics**:
- Function duration
- Function invocations
- Error rate
- Cold starts

**Access**: Vercel dashboard → Analytics

### Supabase Monitoring

**Key metrics**:
- Query performance
- Connection pool usage
- Database size
- Index usage

**Access**: Supabase dashboard → Reports

### Custom Logging

```typescript
// Add timing logs
console.time('vector-search')
const results = await vectorSearch(query)
console.timeEnd('vector-search')
// Output: vector-search: 234ms
```

### Vercel Web Analytics

**Tracks**:
- Page load times
- Core Web Vitals
- Real user monitoring

**Target**: P75 < 2s

## Scaling Considerations

### Current Scale

- **Users**: ~100
- **Companies**: ~10
- **Documents**: ~100
- **Embeddings**: ~3,000
- **Queries**: ~500/day

### Scaling Limits

**Database**:
- Current: Supabase Pro (8GB RAM)
- Scales to: 100K embeddings comfortably
- Beyond: Consider dedicated database or sharding

**API**:
- Current: Vercel Hobby (serverless)
- Scales to: 1M requests/month
- Beyond: Upgrade to Pro ($20/month)

**OpenAI**:
- Current: Tier 1 (500 RPM)
- Scales to: 10K queries/day comfortably
- Beyond: Upgrade tier or batch requests

### Bottlenecks to Watch

**1. Vector search** (> 100K embeddings):
- Solution: Better index, sharding by company

**2. Embedding generation** (> 1K docs/day):
- Solution: Queue system, batch API calls

**3. Database connections** (> 1K concurrent users):
- Solution: Connection pooling, read replicas

## Load Testing

### Tools

**Apache Bench** (simple):
```bash
ab -n 1000 -c 10 https://werkly.com/api/chat
```

**k6** (advanced):
```javascript
import http from 'k6/http';
import { check } from 'k6';

export default function () {
  const res = http.post('https://werkly.com/api/chat', 
    JSON.stringify({ messages: [...] })
  );
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2s': (r) => r.timings.duration < 2000,
  });
}
```

### Load Test Scenarios

**Scenario 1: Normal load**
- 10 concurrent users
- 5 requests/user/minute
- Duration: 10 minutes
- **Expected**: All responses < 2s

**Scenario 2: Peak load**
- 100 concurrent users
- 10 requests/user/minute
- Duration: 5 minutes
- **Expected**: p95 < 3s, no 500 errors

**Scenario 3: Stress test**
- 500 concurrent users
- Ramp up over 5 minutes
- Find breaking point
- **Expected**: Graceful degradation, no data loss

## Quick Wins

### 1. Add Missing Indexes

```sql
-- Check for missing indexes
SELECT schemaname, tablename, attname
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND null_frac < 0.5
  AND NOT EXISTS (
    SELECT 1 FROM pg_index 
    WHERE indrelid = (schemaname||'.'||tablename)::regclass
  );

-- Add indexes as needed
```

### 2. Optimize Frequent Queries

Use `pg_stat_statements` to find slow queries:

```sql
SELECT 
  query,
  calls,
  mean_exec_time,
  max_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

### 3. Enable Query Plan Caching

```sql
-- Prepare frequently-used queries
PREPARE get_conversation AS
SELECT * FROM conversations WHERE id = $1;

-- Execute
EXECUTE get_conversation('conversation-id');
```

### 4. Use Correct Data Types

```sql
-- ❌ TEXT for UUIDs (slower)
user_id TEXT

-- ✅ UUID type (faster, takes less space)
user_id UUID
```

### 5. Batch API Calls

```typescript
// ❌ 10 separate OpenAI calls
for (const chunk of chunks) {
  const embedding = await openai.embeddings.create({ input: chunk })
}

// ✅ 1 batched call
const embeddings = await openai.embeddings.create({
  input: chunks, // Up to 2048 inputs
})
```

## Edge Cases

### Cold Starts

**Issue**: First request after idle is slow (serverless)

**Current impact**: ~500ms added latency
**Mitigation**: Vercel keeps functions warm with traffic
**Future**: Pre-warming, reserved instances

### Rate Limiting

**Current**: No rate limiting (trust-based)

**Future implementation**:
```typescript
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
})

const { success } = await ratelimit.limit(userId)
if (!success) {
  return NextResponse.json(
    { error: 'Rate limit exceeded' },
    { status: 429 }
  )
}
```

### Memory Leaks

**Common causes**:
- Event listeners not cleaned up
- Unclosed database connections
- Large objects in memory

**Detection**:
```typescript
// Monitor memory usage
console.log('Memory:', process.memoryUsage())

// Look for growth over time
```

**Prevention**:
- Always clean up in useEffect
- Close connections explicitly
- Stream large data (don't buffer)

## Production Optimizations

### Enable Compression

**Vercel automatically compresses**:
- gzip for older browsers
- Brotli for modern browsers

**Savings**: 70-80% size reduction for text

### Use CDN

**Vercel Edge Network**:
- 70+ global locations
- Automatic caching
- DDoS protection

**Already configured** (no action needed)

### Database Connection Pooling

**Supabase Pooler**:
- Connection pooling built-in
- Automatically manages connections
- No configuration needed

**For heavy load** (future):
- Use transaction pooling mode
- Or PgBouncer separately

## Benchmarking

### Baseline Metrics (Dec 2024)

**API Response Times**:
- GET /api/conversations: 150ms (p50), 300ms (p95)
- POST /api/chat: 900ms first token (p50), 1800ms (p95)
- POST /api/documents/process: 2.5s per doc

**Database**:
- Simple queries: 5-20ms
- Vector search: 150-300ms
- Embeddings insert: 50ms per chunk

**OpenAI**:
- Embedding generation: 200-400ms
- Chat completion first token: 800-1500ms

### Performance Tracking

**Track weekly**:
- p50, p95, p99 for all APIs
- Error rates
- Function duration
- Database query times

**Alert if**:
- p95 > 2x baseline
- Error rate > 0.5%
- Any metric > 10s

## Future Optimizations

### 1. Background Job Queue (Q1 2025)

**For**: Document processing, embeddings
**Tools**: BullMQ, Inngest
**Benefit**: Instant upload response, process later

### 2. Read Replicas (Q2 2025)

**For**: Scaling read queries
**Setup**: Supabase read replicas
**Benefit**: 10x read throughput

### 3. Caching Layer (Q2 2025)

**For**: Common queries, embeddings
**Tools**: Redis (Vercel KV or Upstash)
**Benefit**: 10-100x faster repeated queries

### 4. Multi-Region Deployment (Q3 2025)

**For**: Global customers
**Setup**: Vercel multi-region + Supabase multi-region
**Benefit**: Lower latency for international users

### 5. Custom Model Serving (Q4 2025)

**For**: Reduced OpenAI costs
**Setup**: Self-hosted embedding model
**Benefit**: 10x cheaper, similar quality

## Resources

- PostgreSQL performance: https://postgresql.org/docs/current/performance-tips.html
- Supabase optimization: https://supabase.com/docs/guides/platform/performance
- Vercel performance: https://vercel.com/docs/concepts/functions/serverless-functions/limits
- #engineering Slack
- Ask Werkly AI!

---

**Last Updated**: December 2024
**Maintainer**: Backend Team
