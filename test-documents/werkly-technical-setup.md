# Werkly Technical Setup Guide

## Local Development Environment

This guide covers setting up your local development environment for Werkly.

## Prerequisites

- Node.js 20+ and npm
- Git
- Supabase account
- OpenAI API key
- Code editor (VS Code recommended)

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/werkly.git
cd werkly
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key
```

**Where to find these:**

- **Supabase URL/Keys**: Project Settings → API in Supabase Dashboard
- **OpenAI API Key**: https://platform.openai.com/api-keys

### 4. Run Database Migrations

1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase/migrations/001_rag_setup.sql`
3. Run `supabase/migrations/002_storage_setup.sql`

### 5. Disable Email Confirmation (Development Only)

For easier local testing:
1. Go to Authentication → Providers → Email
2. Toggle OFF "Confirm email"
3. Remember to re-enable for production!

### 6. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
werkly/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Landing page
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   └── dashboard/               # Dashboard routes
│       ├── layout.tsx           # Dashboard layout
│       ├── page.tsx             # Main dashboard
│       ├── documents/           # Document management
│       └── settings/            # User settings
├── components/
│   ├── ui/                      # Shadcn UI components
│   ├── dashboard/               # Dashboard-specific components
│   └── documents/               # Document upload components
├── lib/
│   ├── supabase/               # Supabase clients & helpers
│   ├── openai/                 # OpenAI API wrapper
│   └── types/                  # TypeScript type definitions
├── supabase/
│   ├── migrations/             # Database migrations
│   └── README.md               # Migration instructions
├── workers/
│   └── embedding/              # Background worker for embeddings
└── public/                     # Static assets
```

## Database Setup

### Understanding the Schema

**Companies**
- One company per employer
- Automatically created on employer signup

**Profiles**
- Links auth.users to companies
- Auto-created via database trigger
- Stores company_id for user

**Documents**
- Tracks uploaded files
- Stores metadata and status
- Company-isolated via RLS

**Document Embeddings**
- Stores text chunks with vectors
- 1536 dimensions (OpenAI model)
- Indexed with pgvector for fast similarity search

### Row Level Security (RLS)

All tables have RLS enabled with policies that:
- Filter data by user's company_id
- Prevent cross-company data access
- Use SECURITY DEFINER functions for controlled operations

Example policy:
```sql
CREATE POLICY "Users can view their company documents"
  ON documents FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );
```

## API Routes (Coming Soon)

### Document Processing

**POST /api/documents/process**
- Triggered after document upload
- Extracts text from PDF/DOCX
- Chunks text into manageable pieces
- Generates embeddings
- Stores in database

**GET /api/documents**
- Lists user's company documents
- Filtered by company_id

### Chat Interface

**POST /api/chat**
- Accepts user query
- Generates query embedding
- Performs vector similarity search
- Returns top K relevant chunks
- Generates LLM response with context

**POST /api/chat/stream**
- Same as above but streams response
- Better UX for long responses

## Common Development Tasks

### Running Type Checks

```bash
npm run type-check
```

### Running Linter

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

### Testing Storage Upload

1. Sign up as Employer with company name
2. Navigate to Documents tab
3. Upload a test file
4. Check Supabase Dashboard → Storage → documents bucket
5. Verify file is in `{company_id}/` folder

### Debugging RLS Policies

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- View all policies
SELECT tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;

-- Test as specific user
SET request.jwt.claims.sub = 'user-id-here';
SELECT * FROM documents;
```

## Deployment

### Vercel Deployment

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push to main

### Environment Variables for Production

Make sure to set these in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

### Supabase Production Checklist

- [ ] Enable email confirmation
- [ ] Review RLS policies
- [ ] Set up backup schedule
- [ ] Configure SMTP for emails
- [ ] Review storage limits
- [ ] Set up monitoring

## Troubleshooting

### "Failed to create company: new row violates row-level security policy"

This means the RLS policies aren't set up correctly. Check:
1. Did you run both migrations?
2. Is the `create_company_for_user()` function created?
3. Try running the patch in `supabase/migrations/`

### "No such function: create_company_for_user"

Run this in SQL Editor:
```sql
-- Check if function exists
SELECT routine_name FROM information_schema.routines 
WHERE routine_name = 'create_company_for_user';
```

If it doesn't exist, re-run `001_rag_setup.sql`

### Storage upload fails with 403

Check storage policies:
```sql
-- View storage policies
SELECT policyname, definition
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';
```

Verify the user's profile has a `company_id` set.

### Build fails with TypeScript errors

```bash
# Delete .next and node_modules
rm -rf .next node_modules

# Reinstall
npm install

# Try building again
npm run build
```

## Best Practices

### Code Style

- Use TypeScript for type safety
- Prefer server components when possible
- Use client components only when needed (interactivity, hooks)
- Keep components small and focused
- Extract reusable logic to hooks

### Database Queries

- Always use RLS - never bypass it unless absolutely necessary
- Use SECURITY DEFINER functions for controlled privilege escalation
- Index frequently queried columns
- Use `select('*')` sparingly - specify columns

### Security

- Never expose service role key in client code
- Always validate user input
- Use parameterized queries
- Keep dependencies updated
- Review RLS policies regularly

### Performance

- Minimize client-side JavaScript
- Use Next.js Image component for images
- Implement proper caching headers
- Monitor OpenAI API usage
- Optimize vector search queries

## Resources

- **Internal Wiki**: https://wiki.werkly.io
- **Figma Designs**: https://figma.com/werkly
- **API Documentation**: https://docs.werkly.io
- **Supabase Project**: https://app.supabase.com/project/werkly

---

**Last Updated**: December 2025
**Maintained by**: Engineering Team
