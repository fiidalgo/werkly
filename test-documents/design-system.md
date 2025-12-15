# Werkly Design System

## Overview

Our design system ensures consistency across all Werkly products. This guide covers colors, typography, components, and design principles.

## Brand Colors

### Primary Palette

**Orange** (Brand color):
- `orange-50`: #fff7ed - Backgrounds
- `orange-100`: #ffedd5 - Hover backgrounds
- `orange-600`: #ea580c - Primary actions
- `orange-700`: #c2410c - Primary hover

**Slate** (Neutral):
- `slate-50`: #f8fafc - Light backgrounds
- `slate-100`: #f1f5f9 - Subtle backgrounds
- `slate-200`: #e2e8f0 - Borders
- `slate-500`: #64748b - Muted text
- `slate-700`: #334155 - Body text
- `slate-900`: #0f172a - Headings

### Semantic Colors

**Success**: Green
- `green-100`: #dcfce7 - Background
- `green-700`: #15803d - Text

**Error**: Red
- `red-100`: #fee2e2 - Background
- `red-700`: #b91c1c - Text

**Warning**: Yellow
- `yellow-100`: #fef9c3 - Background
- `yellow-700`: #a16207 - Text

**Info**: Blue
- `blue-100`: #dbeafe - Background
- `blue-700`: #1d4ed8 - Text

## Typography

### Fonts

**Primary**: System font stack
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...
```

We use the system font for:
- Fast loading
- Native feel
- Accessibility

### Scale

- `text-xs`: 12px - Captions, labels
- `text-sm`: 14px - Body (secondary)
- `text-base`: 16px - Body (primary)
- `text-lg`: 18px - Emphasis
- `text-xl`: 20px - H3
- `text-2xl`: 24px - H2
- `text-3xl`: 30px - H1
- `text-4xl`: 36px - Hero

### Weights

- `font-normal`: 400 - Body text
- `font-medium`: 500 - Emphasis
- `font-semibold`: 600 - Headings
- `font-bold`: 700 - Strong emphasis

### Line Height

- **Tight**: 1.25 - Headings
- **Normal**: 1.5 - Body text
- **Relaxed**: 1.75 - Long-form content

## Spacing

### Scale

Use consistent spacing (4px base unit):

- `0`: 0px
- `1`: 4px
- `2`: 8px
- `3`: 12px
- `4`: 16px
- `6`: 24px
- `8`: 32px
- `12`: 48px
- `16`: 64px

### Common Patterns

**Card padding**: `p-6` (24px)
**Button padding**: `px-4 py-2` (16px × 8px)
**Section spacing**: `space-y-8` (32px)
**Input spacing**: `gap-2` (8px)

## Components

### Buttons

**Primary**:
```typescript
<Button className="bg-orange-600 hover:bg-orange-700">
  Primary Action
</Button>
```

**Secondary**:
```typescript
<Button variant="outline">
  Secondary Action
</Button>
```

**Ghost**:
```typescript
<Button variant="ghost">
  Subtle Action
</Button>
```

### Inputs

**Standard**:
```typescript
<Input
  type="text"
  placeholder="Enter text..."
  className="w-full"
/>
```

**With label**:
```typescript
<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
</div>
```

### Cards

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    Content
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Status Badges

```typescript
// Success
<span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
  Completed
</span>

// Error
<span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
  Failed
</span>

// Warning
<span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
  Pending
</span>

// Info
<span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
  Processing
</span>
```

## Layout Patterns

### Centered Content

```typescript
<div className="max-w-3xl mx-auto p-6">
  {/* Content */}
</div>
```

**Use for**: Forms, chat interface, article content

### Full Width with Max Width

```typescript
<div className="max-w-6xl mx-auto p-6">
  {/* Content */}
</div>
```

**Use for**: Dashboards, tables, document lists

### Two Column

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div>Column 1</div>
  <div>Column 2</div>
</div>
```

## Icons

### Icon Library

We use **Heroicons** (https://heroicons.com):
- Consistent style
- Available as SVG
- Free and open source

### Icon Sizes

- Small: `w-4 h-4` (16px) - In text
- Medium: `w-5 h-5` (20px) - Buttons, nav
- Large: `w-6 h-6` (24px) - Headers
- XL: `w-8 h-8` (32px) - Empty states

### Usage

```typescript
<svg 
  xmlns="http://www.w3.org/2000/svg" 
  fill="none" 
  viewBox="0 0 24 24" 
  strokeWidth={1.5} 
  stroke="currentColor" 
  className="w-5 h-5"
>
  <path strokeLinecap="round" strokeLinejoin="round" d="..." />
</svg>
```

## Interaction States

### Hover

All interactive elements should have hover feedback:

```typescript
className="hover:bg-slate-100 transition-colors"
className="hover:text-orange-600 transition-colors"
className="hover:scale-105 transition-transform"
```

### Focus

Keyboard navigation support:

```typescript
className="focus-visible:ring-2 focus-visible:ring-orange-500"
className="focus-visible:outline-none focus-visible:ring-offset-2"
```

### Active

Button press state:

```typescript
className="active:scale-95 transition-transform"
```

### Disabled

```typescript
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

## Animation

### Timing

- **Fast**: 150ms - Micro-interactions (hover)
- **Normal**: 200-300ms - State changes (collapse)
- **Slow**: 500ms - Page transitions

### Easing

- **Default**: `ease-in-out` - Most animations
- **Ease-out**: Entering the screen
- **Ease-in**: Leaving the screen

### Common Animations

```typescript
// Fade in
className="opacity-0 animate-fade-in"

// Slide in from right
className="translate-x-full animate-slide-in"

// Bounce (for loading)
className="animate-bounce"
```

## Responsive Design

### Breakpoints

- **Mobile**: < 768px (default)
- **Tablet**: 768px - 1024px (`md:`)
- **Desktop**: > 1024px (`lg:`)

### Mobile-First

Always design for mobile first, then enhance:

```typescript
className="text-sm md:text-base lg:text-lg"
className="p-4 md:p-6 lg:p-8"
className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

## Accessibility

### Color Contrast

All text must meet WCAG AA standards:
- **Normal text**: 4.5:1 contrast ratio
- **Large text**: 3:1 contrast ratio

Our color combinations are pre-tested for accessibility.

### Keyboard Navigation

- All interactive elements focusable
- Logical tab order
- Visible focus states
- Escape key closes modals

### Screen Readers

- Semantic HTML (`<button>`, not `<div onClick>`)
- Alt text for images
- ARIA labels where needed
- Proper heading hierarchy

## Design Tools

### Figma

- **Workspace**: Werkly Design
- **Access**: Design team + Engineering leads
- **Components**: Match code exactly

### Workflow

1. **Design in Figma**
2. **Share link in Slack**
3. **Engineering estimates**
4. **Build in code**
5. **QA review**

## Design Principles

### 1. Clarity Over Cleverness

Users should understand instantly what to do.

❌ Hidden gestures, obscure icons
✅ Clear labels, obvious actions

### 2. Consistent Over Novel

Follow patterns users already know.

❌ Reinventing common UI patterns
✅ Using familiar interactions

### 3. Fast Over Feature-Rich

Speed is a feature.

❌ Heavy animations, large images
✅ Instant feedback, optimized assets

### 4. Accessible to Everyone

Design for all abilities.

❌ Color-only information
✅ Multiple indicators (color + text)

## Component Examples

### Chat Message

```typescript
<div className="flex justify-start">
  <div className="max-w-[85%] rounded-2xl px-4 py-3 bg-slate-100 text-slate-900">
    <div className="text-sm">Message content</div>
  </div>
</div>
```

### Status Badge

```typescript
<span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
  Completed
</span>
```

### Empty State

```typescript
<div className="text-center py-12">
  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
    <Icon className="w-8 h-8 text-orange-600" />
  </div>
  <h3 className="text-lg font-semibold text-slate-900 mb-2">No items yet</h3>
  <p className="text-slate-600 mb-4">Get started by creating your first item</p>
  <Button>Create Item</Button>
</div>
```

## Dark Mode (Future)

Planning dark mode support in Q2 2025:
- Toggle in settings
- Saved to localStorage
- Tailwind dark: classes
- Separate color palette

## Questions?

- Design team: #design Slack
- Figma access: Request from design lead
- Component requests: #design-system
- Ask Werkly AI!

---

**Last Updated**: December 2024
**Maintainer**: Design Team
