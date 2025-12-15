# Component Library Guide

## Overview

Werkly uses Shadcn/ui for our component library. These are customizable, accessible components built on Radix UI.

## Installation

Components are installed individually:

```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add textarea
```

This copies the component source to `components/ui/` where you can customize it.

## Available Components

### Button

```typescript
import { Button } from "@/components/ui/button"

<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="icon">🔥</Button>
<Button disabled>Disabled</Button>
```

**Variants**:
- `default` - Solid orange background
- `outline` - Border only
- `ghost` - Transparent until hover
- `destructive` - Red (for delete actions)

**Sizes**:
- `default` - Standard size
- `sm` - Small
- `lg` - Large
- `icon` - Square icon button

### Input

```typescript
import { Input } from "@/components/ui/input"

<Input 
  type="email" 
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Textarea

```typescript
import { Textarea } from "@/components/ui/textarea"

<Textarea
  placeholder="Type here..."
  rows={4}
  value={text}
  onChange={(e) => setText(e.target.value)}
/>
```

### Card

```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Dialog (Modal)

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
    </DialogHeader>
    <div>Modal content</div>
  </DialogContent>
</Dialog>
```

## Custom Components

### Sidebar

Located in `components/dashboard/sidebar.tsx`

**Features**:
- Collapsible
- Persists state to localStorage
- Role-based navigation (employer vs employee)
- Smooth animations

**Usage**: Already integrated in dashboard layout

### User Menu

Located in `components/dashboard/user-menu.tsx`

**Features**:
- Profile dropdown
- Logout functionality
- Email display
- Adapts to sidebar collapse state

## Styling Conventions

### Colors

- **Primary**: Orange (`orange-600`)
- **Text**: Slate (`slate-900`, `slate-700`, `slate-500`)
- **Borders**: Light slate (`slate-200`)
- **Backgrounds**: White with slate accents

### Spacing

- **Padding**: `p-4` (16px), `p-6` (24px), `p-8` (32px)
- **Gap**: `gap-2`, `gap-4`, `gap-6`
- **Margin**: `mb-2`, `mb-4`, `mb-8`

### Typography

- **Headings**: `text-3xl font-bold` (H1), `text-xl font-semibold` (H2)
- **Body**: `text-base` or `text-sm`
- **Muted**: `text-slate-500` or `text-slate-600`

## Animation Best Practices

### Transitions

```typescript
// Smooth color transitions
className="transition-colors hover:bg-slate-100"

// Multi-property transitions
className="transition-all duration-200"

// Custom timing
className="transition-transform duration-300 ease-in-out"
```

### Common Patterns

```typescript
// Hover grow
className="hover:scale-105 transition-transform"

// Fade in/out
className="opacity-0 hover:opacity-100 transition-opacity"

// Slide in
className="translate-x-full transition-transform"
```

## Responsive Design

### Mobile-First Approach

```typescript
// Default is mobile, then add larger breakpoints
className="text-sm md:text-base lg:text-lg"
className="p-4 md:p-6 lg:p-8"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

### Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Accessibility

### Keyboard Navigation

```typescript
// Always support keyboard
<button onKeyDown={handleKeyDown} />

// Focus states
className="focus-visible:ring-2 focus-visible:ring-orange-500"
```

### Screen Readers

```typescript
// Use semantic HTML
<button aria-label="Close menu">×</button>

// Hide decorative elements
<div aria-hidden="true">🎉</div>
```

## Common Patterns

### Loading States

```typescript
{isLoading ? (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </div>
) : (
  <Button>Submit</Button>
)}
```

### Empty States

```typescript
{items.length === 0 ? (
  <div className="text-center py-12 text-slate-500">
    <div className="text-4xl mb-4">📭</div>
    <p>No items found</p>
  </div>
) : (
  <ItemList items={items} />
)}
```

### Error States

```typescript
{error && (
  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
    {error}
  </div>
)}
```

## Component Composition

### Building Complex UIs

Break down into smaller components:

```
Dashboard
├── Sidebar
│   ├── Navigation
│   ├── ConversationList
│   └── UserMenu
└── MainContent
    ├── MessageList
    │   ├── UserMessage
    │   └── AssistantMessage
    └── InputArea
        ├── Textarea
        └── SubmitButton
```

Each component should:
- Have a single responsibility
- Accept props for configuration
- Be reusable across pages
- Have TypeScript types

## Testing Components

### In Browser

1. Open React DevTools
2. Inspect component tree
3. Check props and state
4. Use "Pick an element" to identify components

### Console Logging

```typescript
useEffect(() => {
  console.log('Component mounted', props)
  return () => console.log('Component unmounted')
}, [])
```

## Need Help?

- Shadcn docs: https://ui.shadcn.com
- Check existing components in `components/ui/`
- Ask in #frontend-help
- Ask Werkly AI!

---

**Last Updated**: December 2024
**Maintainer**: Frontend Team
