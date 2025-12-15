# API Documentation Standards

## Overview

Well-documented APIs are critical for internal and external developers. This guide covers how to document our APIs.

## Documentation Location

**Internal APIs**: Inline code comments + Notion wiki
**External APIs** (future): Public docs site

## API Route Documentation

### File Header Comment

Every API route file should start with:

```typescript
/**
 * Chat API - Generates AI responses with RAG context
 * 
 * POST /api/chat
 * 
 * Authentication: Required
 * Rate limit: 10 requests/minute per user
 * 
 * Request body:
 * - messages: Array<{role, content}> - Chat history
 * - useContext: boolean - Whether to use RAG (default: true)
 * 
 * Response: Streaming text response
 * 
 * Example:
 * ```typescript
 * const response = await fetch('/api/chat', {
 *   method: 'POST',
 *   body: JSON.stringify({
 *     messages: [{ role: 'user', content: 'What is Werkly?' }],
 *     useContext: true,
 *   }),
 * })
 * const reader = response.body.getReader()
 * // ... handle streaming
 * ```
 */
```

## Endpoint Specification

### URL Pattern

Document the endpoint URL clearly:

```
POST /api/conversations
GET /api/conversations
GET /api/conversations/{id}/messages
POST /api/conversations/{id}/messages
DELETE /api/conversations/{id}
```

### HTTP Methods

Use semantic HTTP verbs:
- `GET` - Retrieve data (no side effects)
- `POST` - Create new resource
- `PUT` - Update entire resource
- `PATCH` - Update partial resource
- `DELETE` - Delete resource

### Authentication

Document auth requirements:

```markdown
## Authentication

**Required**: Yes
**Type**: Session cookie (Supabase Auth)
**Headers**: None (handled by middleware)

**Unauthorized response** (401):
```json
{
  "error": "Unauthorized"
}
```
```

### Request Format

#### Query Parameters

```markdown
## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Max results (default: 50, max: 100) |
| `offset` | number | No | Pagination offset (default: 0) |
| `status` | string | No | Filter by status: pending, completed, failed |

**Example**:
```
GET /api/documents?limit=20&status=completed
```
```

#### Request Body

```markdown
## Request Body

**Content-Type**: `application/json`

```json
{
  "title": "string (required, max 100 chars)",
  "content": "string (optional)"
}
```

**Validation**:
- `title`: Required, 1-100 characters
- `content`: Optional, max 10,000 characters

**Example**:
```json
{
  "title": "My first conversation",
  "content": "Initial message"
}
```
```

### Response Format

#### Success Response

```markdown
## Success Response

**Status**: 200 OK
**Content-Type**: `application/json`

```json
{
  "id": "uuid",
  "title": "string",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

**Example**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "My first conversation",
  "created_at": "2024-12-14T10:30:00Z",
  "updated_at": "2024-12-14T10:30:00Z"
}
```
```

#### Error Responses

```markdown
## Error Responses

### 400 Bad Request
Missing or invalid parameters

```json
{
  "error": "Title is required"
}
```

### 401 Unauthorized
Not authenticated

```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
Authenticated but no permission

```json
{
  "error": "Only employers can access this endpoint"
}
```

### 404 Not Found
Resource doesn't exist

```json
{
  "error": "Conversation not found"
}
```

### 500 Internal Server Error
Server error

```json
{
  "error": "Internal server error"
}
```
```

## Code Examples

### Include Multiple Languages

```markdown
## Examples

### JavaScript/TypeScript

```typescript
const response = await fetch('/api/conversations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'New chat' }),
})

const data = await response.json()
console.log('Created:', data.id)
```

### cURL

```bash
curl -X POST https://werkly.com/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title": "New chat"}'
```

### Python (future SDK)

```python
import werkly

client = werkly.Client(api_key="...")
conversation = client.conversations.create(title="New chat")
print(f"Created: {conversation.id}")
```
```

## Special Behaviors

### Streaming Responses

```markdown
## Streaming Response

This endpoint returns a stream of text chunks.

**Content-Type**: `text/plain; charset=utf-8`
**Transfer-Encoding**: `chunked`

**Reading the stream**:

```typescript
const response = await fetch('/api/chat', { /* ... */ })
const reader = response.body.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  
  const chunk = decoder.decode(value)
  console.log('Chunk:', chunk)
  // Append to UI
}
```
```

### Pagination

```markdown
## Pagination

**Parameters**:
- `limit`: Items per page (default: 50, max: 100)
- `offset`: Starting index (default: 0)

**Response includes**:
```json
{
  "data": [...],
  "total": 150,
  "limit": 50,
  "offset": 0,
  "has_more": true
}
```

**Next page**:
```
GET /api/items?limit=50&offset=50
```
```

## Rate Limiting

### Document Limits

```markdown
## Rate Limiting

**Limit**: 10 requests per minute per user

**Headers** (returned in response):
- `X-RateLimit-Limit`: 10
- `X-RateLimit-Remaining`: 7
- `X-RateLimit-Reset`: 1702569600 (Unix timestamp)

**429 Response** (Rate limited):
```json
{
  "error": "Rate limit exceeded",
  "retry_after": 42
}
```

**Backoff strategy**: Exponential backoff recommended
```

## API Versioning

### Current (No Versioning)

We're pre-v1, so APIs may change.

**Breaking changes**:
- Announce in #engineering 1 week before
- Provide migration guide
- Support old version for 30 days

### Future Versioning

```markdown
## API Versioning

**Current version**: v1

**URL format**: `/api/v1/conversations`

**Deprecation timeline**:
- Announce: 90 days before sunset
- Sunset: After 90 days, old version returns 410 Gone
```

## OpenAPI Spec (Future)

We'll generate OpenAPI specs for:
- Interactive API docs
- Automatic SDK generation
- API testing tools

**Example**:
```yaml
openapi: 3.0.0
info:
  title: Werkly API
  version: 1.0.0
paths:
  /api/conversations:
    post:
      summary: Create conversation
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
```

## Testing APIs

### Manual Testing

```bash
# Using cURL
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'
```

### Automated Testing (Future)

```typescript
// Example integration test
import { test, expect } from '@playwright/test'

test('create conversation', async ({ request }) => {
  const response = await request.post('/api/conversations', {
    data: { title: 'Test conversation' },
  })
  
  expect(response.status()).toBe(200)
  const data = await response.json()
  expect(data.conversation.title).toBe('Test conversation')
})
```

## Changelog

Track API changes in `API_CHANGELOG.md`:

```markdown
# API Changelog

## 2024-12-14

### Added
- `POST /api/employees` - Add employee to company
- `GET /api/employees` - List company employees

### Changed
- `POST /api/chat` - Now includes source citations in context

### Deprecated
- None

### Removed
- None

### Fixed
- `GET /api/conversations` - Now correctly orders by updated_at
```

## Deprecation Process

### Announcing Deprecation

```markdown
## Deprecated Endpoint

⚠️ **DEPRECATED**: This endpoint will be removed on March 1, 2025

**Reason**: Replaced by /api/v2/conversations

**Migration guide**: [Link to migration doc]

**Support**: Contact api@werkly.com for migration help
```

### Timeline

1. **Day 0**: Announce deprecation
2. **Day 30**: Add deprecation header to responses
3. **Day 60**: Send reminder email
4. **Day 90**: Remove endpoint (return 410 Gone)

## Documentation Tools

### Notion Wiki

Our internal API docs live in Notion:
- One page per API route
- Linked from engineering wiki
- Updated with every API change

### Code Comments

Inline JSDoc comments in code:

```typescript
/**
 * Creates a new conversation for the current user
 * 
 * @param title - Conversation title (max 100 chars)
 * @returns Created conversation object
 * @throws {Error} If user not in a company
 */
export async function createConversation(title: string) {
  // Implementation
}
```

### Postman Collection (Future)

Pre-built API requests for testing:
- All endpoints
- Example payloads
- Environment variables
- Test assertions

## API Design Principles

### RESTful Conventions

- **Nouns for resources**: `/api/conversations` not `/api/getConversations`
- **Plural names**: `/api/conversations` not `/api/conversation`
- **Nested resources**: `/api/conversations/{id}/messages`

### Consistent Naming

- **camelCase** for JSON keys: `created_at`, `userId`
- **kebab-case** for URLs: `/api/chat-search`
- **PascalCase** for types: `Conversation`, `Message`

### Error Messages

Be helpful:

```
❌ Bad: "Invalid input"
✅ Good: "Title must be between 1-100 characters"

❌ Bad: "Forbidden"
✅ Good: "Only employers can access this endpoint"
```

## Questions?

- API questions: #engineering Slack
- Documentation requests: Create Linear ticket
- Ask Werkly AI!

---

**Last Updated**: December 2024
**Maintainer**: Backend Team
