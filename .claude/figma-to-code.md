# Figma to code — handoff skill

Translates a Figma component into a production Next.js + Tailwind v4 component
for the Techcombank Mobile AI-First Redesign. Read this file before writing
any code from Figma.

---

## Process

1. Read the Figma component via MCP (get_design_context or get_screenshot)
2. Identify every visual property: color, typography, spacing, radius, border
3. Map each property to the closest token from the table below
4. Write the component following the output rules
5. Never invent new classes — if a token doesn't exist, use the closest one and note it

---

## Token mapping — Figma style → Tailwind class

### Colors
| Figma style            | Tailwind class                            |
|-------------------------|--------------------------------------------|
| Cinnabar/600 (#ed1c24)  | bg-brand / text-brand                      |
| Cinnabar/50             | bg-brand-subtle                            |
| Cinnabar/200            | bg-brand-muted                             |
| White                   | bg-surface-raised / text-content-inverse  |
| Gray/50                 | bg-surface                                 |
| Gray/100                | bg-surface-sunken                          |
| Gray/900 (as bg)        | bg-surface-overlay                         |
| Gray/900 (as text)      | text-content-primary                       |
| Gray/600                | text-content-secondary                     |
| Gray/400                | text-content-muted                         |
| Gray/200 border         | border-border-default                      |
| Gray/300 border         | border-border-strong                       |
| Violet/500              | text-ai / bg-ai                            |
| Violet/50               | bg-ai-subtle                               |
| Violet/200              | border-ai-border                           |
| Green/600                | text-success                              |
| Red/600                  | text-danger                                |

### Typography
This project has no responsive breakpoints — one Figma text style maps to
one semantic class (fixed 390px mobile viewport):

| Figma text style | Tailwind utility                    |
|--------------------|---------------------------------------|
| t-display           | t-display                            |
| t-h2                 | t-h2                                  |
| t-h3                 | t-h3                                  |
| t-body-lg            | t-body-lg                             |
| t-body               | t-body                                |
| t-caption            | t-caption                             |
| t-label              | t-label                               |
| t-cta                | t-cta                                 |
| t-number             | t-number (font-mono + tabular-nums)  |
| t-link               | t-link                                |

### Spacing → Tailwind scale
| Figma spacing | Tailwind                    |
|-----------------|-------------------------------|
| 4px             | gap-1 / p-1                  |
| 8px             | gap-2 / p-2                  |
| 12px            | gap-3 / p-3                  |
| 16px            | gap-4 / p-4                  |
| 24px            | gap-6 / p-6                  |
| 32px            | gap-8 / p-8                  |
| 40px            | gap-10                        |
| 48px            | gap-12                        |
| 64px            | gap-16                        |
| 80px            | gap-20                        |
| 59px            | pt-(--spacing-safe-top)      |
| 34px            | pb-(--spacing-safe-bottom)   |
| 56px            | h-(--spacing-nav)             |
| 83px            | h-(--spacing-tab-bar)         |

### Radius
No custom Radius collection exists in Figma for this project — these map
straight to Tailwind v4 defaults:

| Figma radius   | Token class  |
|------------------|--------------|
| 8px              | rounded      |
| 12px             | rounded-xl   |
| 16px             | rounded-2xl  |
| pill / circle    | rounded-full |

### Layout
No custom layout utilities are defined yet for this project. Build directly
with Tailwind flex/grid utilities inside the fixed 390px mobile viewport.
If a recurring layout pattern emerges across screens, propose a utility and
document it here.

---

## Output rules

- One `.jsx` file per component — no TypeScript (this project is JS-only)
- Props are plain JS objects — no prop-types or interfaces
- Use Material Symbols Outlined for icons: `<span className="material-symbols-outlined">[name]</span>`
- Framer Motion for all animations — no CSS transitions/keyframes
- No inline styles
- No hardcoded hex values — semantic tokens only
- Named export only — no default export for components in `src/components/`

## Output format

```jsx
import { motion } from 'framer-motion'

export function [Name]({ className, ...props }) {
  return (
    // component here
  )
}
```

---

## How to use in Claude Code

```
Read @.claude/figma-to-code.md — then read this Figma component:
[Figma URL or: "the [ComponentName] component in my Figma file"]

Build it as a Next.js component using my token system.
Save to /src/components/[ui|ai|screens]/[Name].jsx
```
