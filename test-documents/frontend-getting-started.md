# Frontend Development Guide - Getting Started

## Welcome Frontend Engineers!

This guide will help you get up and running with Werkly's frontend codebase.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: React hooks + Context API
- **Authentication**: Supabase Auth

## Repository Setup

### Clone and Install

```bash
git clone git@github.com:werkly/werkly.git
cd werkly
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

### Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Project Structure

```
app/
├── (auth)/
│   ├── login/
│   └── signup/
├── dashboard/
│   ├── page.tsx (Main chat interface)
│   ├── documents/ (Employer only)
│   ├── employees/ (Employer only)
│   └── settings/
├── api/
│   ├── chat/ (RAG endpoints)
│   ├── conversations/
│   └── documents/
└── globals.css

components/
├── dashboard/
│   ├── sidebar.tsx
│   ├── user-menu.tsx
│   └── dashboard-layout.tsx
├── documents/
└── ui/ (Shadcn components)

lib/
├── supabase/ (Client helpers)
├── openai/ (AI integration)
└── types/ (TypeScript definitions)
```

## Key Concepts

### App Router

We use Next.js 14's App Router with Server Components by default.

- **Server Components**: Default, can access DB directly
- **Client Components**: Use `"use client"` directive, for interactivity

### Authentication Flow

1. User logs in via Supabase Auth
2. Middleware (`proxy.ts`) validates session
3. Protected routes check `auth.getUser()`
4. User metadata includes `is_employer` flag

## Common Tasks

### Adding a New Page

```bash
# Create new route
mkdir -p app/dashboard/my-page
touch app/dashboard/my-page/page.tsx
```

```typescript
// app/dashboard/my-page/page.tsx
export default function MyPage() {
  return <div>My Page</div>
}
```

### Adding a New Component

```bash
# Create component
touch components/my-component.tsx
```

```typescript
"use client" // If using hooks/interactivity

export function MyComponent() {
  return <div>Component</div>
}
```

### Styling Best Practices

1. Use Tailwind utility classes
2. Follow mobile-first approach
3. Use consistent spacing (p-4, p-6, p-8)
4. Orange accent color: `bg-orange-600`, `text-orange-600`

## Development Workflow

1. **Create branch**: `git checkout -b feat/feature-name`
2. **Make changes**: Small, focused commits
3. **Test locally**: `npm run dev`
4. **Build check**: `npm run build`
5. **Push**: `git push origin feat/feature-name`
6. **Create PR**: Review → Merge to main

## Debugging Tips

### Hot Reload Not Working

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Type Errors

- Check `lib/types/database.ts` for Supabase types
- Use `@ts-ignore` for known Supabase type inference issues
- Run `npm run build` to catch type errors

### Styling Issues

- Verify Tailwind classes in browser dev tools
- Check if custom CSS conflicts
- Use Tailwind IntelliSense VSCode extension

## Need Help?

- Ask in #frontend-help Slack channel
- Review existing components in `components/`
- Check Next.js docs: https://nextjs.org/docs
- Ask Werkly AI! (Use the chat interface)

---

**Last Updated**: December 2024
**Maintainer**: Frontend Team
