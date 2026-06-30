# CLAUDE.md — Project Brain
## Techcombank Mobile · AI-First Redesign · Design Challenge Round 3

> Claude Code reads this file first on every session.
> This is the single source of truth for project context, conventions, and workflow.

---

## Project Overview

**What:** Redesign of Techcombank Mobile app with an AI-first approach.
**Who:** Design challenge submission for Techcombank Product Designer role.
**Deliverable:** Case study website showcasing redesigned flows.
**Timeline:** 3–5 days.

### Three screens in scope
1. **Home** — proactive AI narrator, surfaces what matters today
2. **Search** — intent-driven, natural language → direct action
3. **Wealth/Investment** — AI advisor, numbers → guidance → next action

### Design principles
1. Proactive over reactive
2. Context-aware, not feature-complete
3. Guidance over information

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 16 (App Router) | File-based routing, Vercel deploy |
| Styling | Tailwind CSS v4.3 | Design system via `@theme` in globals.css |
| Animation | Framer Motion | Screen transitions, scroll reveals |
| Icons | Material Symbols Outlined | Confirmed from TCB site extraction |
| Font | next/font (Google) | Be Vietnam Pro — SF Pro Display is system font |
| Mock data | Static JS/JSON | In `src/data/` — no backend needed |
| Deployment | Vercel | Free, one-click from GitHub |
| Version control | GitHub | Push from VS Code |

### Not used
- No TypeScript — adds time, zero benefit for a case study
- No state management — static showcase, no global state
- No backend/API — all mock data

### Init commands
```bash
npx create-next-app@latest techcombank-challenge --no-typescript --tailwind --app --eslint
cd techcombank-challenge
npm install framer-motion
```

> `create-next-app@latest` will install Next.js 16 (current stable as of June 2026).
> Requires Node.js 20+.

---

## File Map

```
techcombank-challenge/
├── CLAUDE.md                          ← YOU ARE HERE
├── README.md
├── .claude/
│   ├── component-brief.md             ← Rules for building components
│   └── screen-spec.md                 ← Rules for building screens
├── docs/
│   ├── DESIGN-SYSTEM.md               ← Brand tokens (source of truth)
│   ├── AI-MOMENTS.md                  ← AI touchpoints per screen
│   ├── BRAND-EXTRACTION.md            ← DevTools extraction scripts
│   └── STRATEGY.md                    ← Challenge framing & POV
├── src/
│   ├── app/                           ← Next.js App Router
│   │   ├── layout.jsx                 ← Root layout, fonts, metadata
│   │   ├── page.jsx                   ← Case study landing page
│   │   ├── globals.css                ← Tailwind @import + @theme block
│   │   └── screens/
│   │       ├── home/page.jsx
│   │       ├── search/page.jsx
│   │       └── wealth/page.jsx
│   ├── components/
│   │   ├── ui/                        ← Base: Button, Card, Input, Badge
│   │   ├── ai/                        ← AI: InsightStrip, SuggestionChip
│   │   └── screens/                   ← Screen-level compositions
│   └── data/                          ← Static mock data (JS/JSON)
└── public/
    └── assets/                        ← Images, icons
```

---

## Design System Quick Reference

> Full reference in `docs/DESIGN-SYSTEM.md` — Section 2 is the color utilities cheatsheet.
> **Always use semantic classes. Never use raw palette classes like `bg-gray-50` or `text-gray-900`.**

### Surfaces
```html
bg-surface            bg-surface-raised     bg-surface-sunken     bg-surface-overlay
```

### Text
```html
text-content-primary  text-content-secondary  text-content-muted  text-content-inverse
```

### Borders
```html
border-border-default  border-border-strong  border-border-focus
```

### Brand
```html
bg-brand  bg-brand-hover  bg-brand-subtle  text-brand  border-brand
```

### AI
```html
bg-ai-subtle  border-ai-border  text-ai  bg-ai
```

### Feedback
```html
text-success  bg-success-subtle  text-warning  bg-warning-subtle
text-info     bg-info-subtle     text-danger   bg-danger-subtle
```

### Font
```
font-sans → 'Be Vietnam Pro' / SF Pro Display (system)
font-mono + tabular-nums → all financial numbers
```

### Typography — always use semantic classes, never compose manually
```jsx
t-display   // hero numbers, biggest display text (80px)
t-h1        // page-level heading (32px)
t-h2        // section headings
t-h3        // card titles
t-body-lg   // descriptive text
t-body      // default body
t-caption   // timestamps, metadata
t-label     // tags, nav items
t-cta       // button text
t-number    // all financial figures (mono + tabular-nums)
t-link      // text links
```
Override color only when needed: `<span className="t-number text-success">+12%</span>`

---

## Coding Conventions

### Tailwind v4.3 — color rules
- **`cinnabar` is the only custom palette color** — defined in `@theme` in `globals.css`
- **All other colors come from Tailwind's default palette** (gray, violet, green, amber, blue, red)
- **Semantic aliases are defined in `@theme`** — map intent to palette (e.g. `--color-brand` → cinnabar-600)
- **Always use semantic classes in HTML/JSX** — `bg-brand`, `text-content-primary`, `bg-surface-raised`
- **Never use raw palette classes** — no `bg-gray-50`, no `text-gray-900`, no `bg-violet-500` directly
- Full utilities list in `docs/DESIGN-SYSTEM.md` Section 2

### Component conventions
- All components are `.jsx` functional components
- No default export for UI primitives — named exports only
- Props use plain JS objects — no TypeScript interfaces
- Framer Motion for any animated element — no CSS transitions
- File naming: `PascalCase.jsx` for components, `kebab-case/page.jsx` for routes

### Mobile viewport
```jsx
// In src/app/layout.jsx
export const viewport = {
  width: 390,
  initialScale: 1,
}
```
Reference device: iPhone 14 (390×844px)

### Financial numbers — always
```jsx
<span className="font-mono tabular-nums">4,250,000 ₫</span>
```

---

## AI Component Rules

1. **AI accent = violet only** — `text-ai`, `bg-ai-subtle`, `border-ai-border`
2. **One AI moment visible at a time** per screen — no stacking
3. **Always dismissible** — every AI card needs an ✕ button
4. **Show reasoning** — "Vì sao?" tap target on every AI suggestion
5. **Confidence > 70%** before surfacing any AI nudge
6. Full AI touchpoints in `docs/AI-MOMENTS.md`

---

## Workflow

### When building a new component:
1. Read `.claude/component-brief.md`
2. Check `docs/DESIGN-SYSTEM.md` Section 2 for color utilities
3. Build in `src/components/ui/` or `src/components/ai/`
4. Use Framer Motion for any interactive/animated behaviour

### When building a screen:
1. Read `.claude/screen-spec.md`
2. Read `docs/AI-MOMENTS.md` for that screen's AI touchpoints
3. Build in `src/app/screens/[screen]/page.jsx`
4. Always include: status bar + bottom tab bar + correct bg-surface

### When updating the design system:
1. Edit `docs/DESIGN-SYSTEM.md`
2. Update `globals.css` @theme block
3. Update Quick Reference in THIS file if semantic aliases changed

---

## Current Status

- [x] Project structure defined
- [x] Design system tokens — extracted + finalized
- [x] AI moments defined
- [x] CLAUDE.md written
- [x] Brand extraction complete
- [ ] GitHub repo init
- [ ] Next.js project init + Tailwind v4 setup
- [ ] globals.css — @theme block added
- [ ] Figma design system pushed
- [ ] Home screen
- [ ] Search screen
- [ ] Wealth screen
- [ ] Case study landing page
- [ ] Deploy to Vercel