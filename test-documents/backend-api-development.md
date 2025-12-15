# Backend API Development Guide

## Overview

Werkly's backend is built using Next.js API Routes with serverless architecture deployed on Vercel.

## API Structure

All API routes live in `app/api/`:

```
app/api/
├── chat/
│   ├── route.ts (Main chat endpoint)
│   └── search/route.ts (Vector search)
├── conversations/
│   ├── route.ts (List/create conversations)
│   └── [id]/messages/route.ts (Message CRUD)
├── documents/
│   └── process/route.ts (Document processing)
└── employees/
    └── route.ts (Employee management)
```

## Creating an API Route

### Basic Structure

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Your logic here
    const data = { message: 'Hello' }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // POST handler
}
```

### Dynamic Routes

```typescript
// app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  // Use id in your logic
}
```

## Database Access

### Regular Client (Respects RLS)

```typescript
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()

// This respects Row Level Security policies
const { data } = await supabase
  .from('documents')
  .select('*')
  .eq('company_id', companyId)
```

### Service Client (Bypasses RLS)

Use ONLY for trusted backend operations:

```typescript
import { createServiceClient } from '@/lib/supabase/service'

const supabaseService = createServiceClient()

// This bypasses RLS - use carefully!
const { data } = await supabaseService
  .from('document_embeddings')
  .insert(embeddings)
```

**When to use Service Client:**
- Background processing (document embeddings)
- System operations (cleanup, migrations)
- Trusted RPC functions

**NEVER use Service Client for:**
- User-initiated queries
- Anything that should respect permissions
- Client-exposed endpoints

## Authentication Patterns

### Check User

```typescript
const { data: { user } } = await supabase.auth.getUser()

if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Check Employer Role

```typescript
const isEmployer = user.user_metadata?.is_employer === true

if (!isEmployer) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

### Get User's Company

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('company_id')
  .eq('id', user.id)
  .single()

const companyId = profile?.company_id
```

## OpenAI Integration

### Generate Embeddings

```typescript
import { createEmbedding } from '@/lib/openai/client'

const embedding = await createEmbedding("text to embed")
// Returns number[] with 1536 dimensions
```

### Chat Completions

```typescript
import { openai } from '@/lib/openai/client'

const stream = await openai.chat.completions.create({
  model: 'gpt-4',
  stream: true,
  messages: [
    { role: 'system', content: 'You are...' },
    { role: 'user', content: 'Hello' },
  ],
})

// Stream response
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || ''
  // Send to client
}
```

## Database Operations

### Insert with Return

```typescript
const { data: newDoc, error } = await supabase
  .from('documents')
  .insert({ filename: 'test.pdf', company_id: companyId })
  .select()
  .single()

if (error) throw error
console.log('Created:', newDoc.id)
```

### Update with Filters

```typescript
await supabase
  .from('documents')
  .update({ status: 'completed' })
  .eq('id', documentId)
  .eq('company_id', companyId) // Ensure company isolation
```

### RPC Functions

```typescript
const { data, error } = await supabase.rpc('match_documents', {
  query_embedding: embedding,
  query_company_id: companyId,
  match_threshold: 0.5,
  match_count: 5,
})
```

## Error Handling

### Standard Pattern

```typescript
try {
  // Your logic
  
  if (someError) {
    return NextResponse.json(
      { error: 'Specific error message' },
      { status: 400 }
    )
  }
  
  return NextResponse.json({ success: true, data })
} catch (error) {
  console.error('API error:', error)
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'Internal server error' },
    { status: 500 }
  )
}
```

### Status Codes

- `200` - Success
- `400` - Bad request (invalid input)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (logged in but no permission)
- `404` - Not found
- `500` - Server error

## Streaming Responses

### Text Streaming

```typescript
const encoder = new TextEncoder()

const stream = new ReadableStream({
  async start(controller) {
    try {
      for await (const chunk of aiStream) {
        controller.enqueue(encoder.encode(chunk))
      }
      controller.close()
    } catch (error) {
      controller.error(error)
    }
  },
})

return new Response(stream, {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
})
```

## Testing APIs

### Using curl

```bash
# GET request
curl http://localhost:3000/api/conversations

# POST request
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Hello"}]}'
```

### Using browser console

```javascript
const response = await fetch('/api/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Test' }),
})
const data = await response.json()
console.log(data)
```

## Performance Tips

1. **Use Indexes**: Ensure queries have proper DB indexes
2. **Limit Results**: Always use `.limit()` on queries
3. **Parallel Processing**: Use `Promise.all()` for independent operations
4. **Streaming**: Stream large responses instead of buffering
5. **Caching**: Consider Next.js cache for static data

## Security Checklist

- ✅ Always validate user authentication
- ✅ Check user permissions (employer vs employee)
- ✅ Validate all input (never trust client data)
- ✅ Use RLS policies for data isolation
- ✅ Never expose service role key to client
- ✅ Sanitize error messages (no internal details)
- ✅ Rate limit endpoints (future: implement rate limiting)

## Common Pitfalls

### ❌ Don't: Bypass RLS for user queries

```typescript
// BAD - uses service client for user query
const supabaseService = createServiceClient()
const { data } = await supabaseService
  .from('documents')
  .select('*')
```

### ✅ Do: Use regular client

```typescript
// GOOD - respects RLS
const supabase = await createClient()
const { data } = await supabase
  .from('documents')
  .select('*')
```

### ❌ Don't: Forget error handling

```typescript
// BAD - no error handling
const { data } = await supabase.from('users').select()
return NextResponse.json(data)
```

### ✅ Do: Always handle errors

```typescript
// GOOD - proper error handling
const { data, error } = await supabase.from('users').select()
if (error) throw error
return NextResponse.json(data)
```

## Deployment

### Vercel Deployment

Vercel automatically deploys:
- `main` branch → Production
- PRs → Preview deployments

### Environment Variables

Set in Vercel dashboard:
- `NEXT_PUBLIC_*` - Exposed to client
- Regular vars - Server-only (including service keys)

## Monitoring

Check logs in:
1. **Local**: Terminal output
2. **Vercel**: Functions → Logs
3. **Supabase**: Logs & API section

## Need Help?

- Slack: #backend-help
- Review: `app/api/chat/route.ts` (good example)
- Docs: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

---

**Last Updated**: December 2024
**Maintainer**: Backend Team
