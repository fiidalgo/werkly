# Database Schema & Best Practices

## Overview

Werkly uses Supabase (PostgreSQL) with pgvector extension for our database. This guide covers schema design, RLS policies, and best practices.

## Core Tables

### companies

Stores company information.

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Relationships**:
- One company has many profiles
- One company has many documents
- One company has many embeddings

### profiles

Links users to companies.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Points**:
- `id` matches `auth.users.id` (one-to-one)
- `company_id` can be NULL (before employer adds them)
- Auto-created via trigger on user signup

### documents

Uploaded company documents.

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Status Values**:
- `pending` - Just uploaded
- `processing` - Being processed
- `completed` - Ready for search
- `failed` - Processing error

### document_embeddings

Vector embeddings for semantic search.

```sql
CREATE TABLE document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  chunk_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Points**:
- `embedding` is a pgvector type (1536 dimensions)
- `content` stores the text chunk
- `chunk_index` maintains order
- `metadata` stores additional info (filename, etc.)

### conversations

Chat conversation metadata.

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  company_id UUID NOT NULL REFERENCES companies(id),
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### messages

Individual chat messages.

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Row Level Security (RLS)

### What is RLS?

Row Level Security ensures users can only access their own company's data at the **database level**.

### Example Policy

```sql
-- Users can only view documents from their company
CREATE POLICY "Users can view documents from their company"
  ON documents FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );
```

### Policy Types

- **SELECT**: Who can read rows
- **INSERT**: Who can create rows
- **UPDATE**: Who can modify rows
- **DELETE**: Who can delete rows

### Best Practices

1. **Enable RLS**: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. **Specify roles**: Use `TO authenticated` not `TO public`
3. **Company isolation**: Always filter by `company_id`
4. **Test policies**: Try accessing as different users

## Database Functions

### Vector Search

```sql
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding VECTOR(1536),
  query_company_id UUID,
  match_threshold FLOAT DEFAULT 0.5,
  match_count INT DEFAULT 5
)
RETURNS TABLE (...) AS $$
  SELECT
    id,
    content,
    1 - (embedding <=> query_embedding) as similarity
  FROM document_embeddings
  WHERE company_id = query_company_id
    AND 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$ LANGUAGE sql STABLE;
```

**Key Operators**:
- `<=>` - Cosine distance
- `<->` - L2 distance
- `<#>` - Inner product

### SECURITY DEFINER Functions

Use for privileged operations:

```sql
CREATE OR REPLACE FUNCTION create_company_for_user(...)
RETURNS JSON AS $$
BEGIN
  -- This runs with postgres permissions
  INSERT INTO companies...
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**When to use**:
- Initial company creation during signup
- Employee management (cross-user operations)
- System maintenance tasks

**Security**:
- Always validate caller permissions inside function
- Never trust input parameters
- Use explicit checks (is_employer, company_id, etc.)

## Indexes

### Standard Indexes

```sql
-- Foreign keys
CREATE INDEX idx_documents_company ON documents(company_id);
CREATE INDEX idx_profiles_company ON profiles(company_id);

-- Sorting
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

-- Filtering
CREATE INDEX idx_documents_status ON documents(status);
```

### Vector Index

```sql
CREATE INDEX idx_embeddings_vector ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

**Tuning**:
- `lists = sqrt(total_rows)` is a good starting point
- Rebuild index as data grows
- Monitor query performance

## Triggers

### Auto-Update Timestamp

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Profile Creation on Signup

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

## Migrations

### Creating Migrations

1. Create file: `supabase/migrations/XXX_description.sql`
2. Write idempotent SQL
3. Run in Supabase SQL Editor
4. Test thoroughly
5. Commit to git

### Migration Best Practices

- **Idempotent**: Use `CREATE OR REPLACE`, `IF NOT EXISTS`
- **Reversible**: Consider how to undo
- **Small**: One concern per migration
- **Tested**: Test on dev database first

### Example Migration

```sql
-- 001_add_feature.sql

-- Create table
CREATE TABLE IF NOT EXISTS my_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- Add RLS
ALTER TABLE my_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_can_read" ON my_table
  FOR SELECT TO authenticated
  USING (true);

-- Add index
CREATE INDEX IF NOT EXISTS idx_my_table_id ON my_table(id);
```

## Query Optimization

### Use Indexes

```sql
-- BAD - full table scan
SELECT * FROM documents WHERE filename = 'test.pdf';

-- GOOD - uses index
SELECT * FROM documents WHERE company_id = '...' AND filename = 'test.pdf';
```

### Limit Results

```sql
-- Always use LIMIT for lists
SELECT * FROM conversations
WHERE user_id = '...'
ORDER BY updated_at DESC
LIMIT 50;
```

### Use Specific Columns

```sql
-- BAD - fetches everything
SELECT * FROM documents;

-- GOOD - only what you need
SELECT id, filename, status FROM documents;
```

## Common Queries

### Get User's Company

```typescript
const { data: profile } = await supabase
  .from('profiles')
  .select('company_id')
  .eq('id', userId)
  .single()
```

### Count Embeddings per Document

```sql
SELECT 
  d.filename,
  COUNT(e.id) as embedding_count
FROM documents d
LEFT JOIN document_embeddings e ON e.document_id = d.id
GROUP BY d.id, d.filename;
```

### Find Most Active Users

```sql
SELECT 
  u.email,
  COUNT(DISTINCT c.id) as conversation_count,
  COUNT(m.id) as message_count
FROM auth.users u
JOIN conversations c ON c.user_id = u.id
JOIN messages m ON m.conversation_id = c.id
GROUP BY u.id, u.email
ORDER BY message_count DESC
LIMIT 10;
```

## Backup & Recovery

### Manual Backup

Supabase Dashboard → Database → Backups

### Point-in-Time Recovery

Available for Pro plan and above

### Export Data

```bash
# Using Supabase CLI
supabase db dump -f backup.sql
```

## Troubleshooting

### RLS Blocking Queries

```sql
-- Temporarily disable RLS for testing (local only!)
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'documents';

-- Test as specific user
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims.sub = 'user-id-here';
```

### Slow Queries

```sql
-- Explain query plan
EXPLAIN ANALYZE
SELECT * FROM document_embeddings
WHERE company_id = '...'
ORDER BY embedding <=> '[...]'
LIMIT 5;
```

## Need Help?

- Supabase docs: https://supabase.com/docs
- PostgreSQL docs: https://postgresql.org/docs
- Slack: #backend-help
- Ask Werkly AI!

---

**Last Updated**: December 2024
**Maintainer**: Backend Team
