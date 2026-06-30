# Accessibility audit — a11y skill

Audits a component or page in the Techcombank Mobile AI-First Redesign for
accessibility issues. Read this before running any a11y check.

---

## Audit checklist

### Semantic HTML
- [ ] Headings in logical order (h1 → h2 → h3, no skips)
- [ ] One h1 per page
- [ ] Buttons are `<button>`, links are `<a href>` — not divs with onClick
- [ ] Lists use `<ul>/<ol>/<li>` not div stacks
- [ ] Main landmark exists (`<main>`)
- [ ] Nav landmark: `<nav aria-label="main navigation">`

### Keyboard navigation
- [ ] All interactive elements reachable by Tab
- [ ] Tab order matches visual order
- [ ] Focus visible on every interactive element — e.g.
      `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`,
      or `border-border-focus` for inputs
- [ ] Escape closes any open modal, sheet, or AI card overlay
- [ ] Enter/Space activates buttons

### Color contrast (WCAG AA minimum)
- [ ] Normal text (< 18px): ratio ≥ 4.5:1
- [ ] Large text (≥ 18px or bold ≥ 14px): ratio ≥ 3:1
- [ ] Specific checks for this project (computed from the actual compiled
      `--color-*` values in globals.css):
  - text-brand / cinnabar-600 (#ed1c24) on bg-surface (#f9fafb) → ratio ≈ 4.4:1
    Borderline — fails AA for normal text just under 4.5:1. OK for large/bold
    text (t-cta at 16px semibold, t-link is only 13px semibold so check it
    specifically). For small body text, don't use text-brand directly.
  - text-content-inverse (white) on bg-brand (cinnabar-600) → same ≈4.4:1,
    same caveat — fine for t-cta, verify anywhere else white-on-brand is used at small sizes.
  - text-ai / violet-500 (#8d54ff) on bg-surface → ratio ≈ 4.1:1 — borderline,
    same rule as text-brand: avoid for small normal-weight text.
  - text-content-muted / gray-400 (#99a1af) on bg-surface → ratio ≈ 2.5:1 —
    FAILS even the large-text 3:1 threshold. t-caption (13px) currently uses
    this color — that combination does not meet AA. Consider darkening
    captions to text-content-secondary (gray-600, ≈7.2:1, passes comfortably)
    or only use content-muted for truly disabled/placeholder content, never
    for text the user is meant to read.
  - text-content-secondary / gray-600 (#4a5565) on bg-surface → ratio ≈ 7.2:1 ✓ PASS
  - Same method applies to success/warning/info/danger — they're saturated
    mid-tones, verify before using as small text on bg-surface rather than
    assuming they pass.

### Images and media
- [ ] All `<img>` have descriptive alt text
- [ ] Decorative images have alt=""
- [ ] Videos have controls or are muted + no autoplay audio

### Motion and animation
- [ ] `useReducedMotion()` from Framer Motion used in animated components
- [ ] No animation plays indefinitely without a reduced-motion fallback

### ARIA
- [ ] Custom interactive elements have role + aria-label
- [ ] Dialogs/sheets/AI card overlays: `aria-modal="true" role="dialog"`
      with an `aria-label` describing their purpose
- [ ] Loading states: `aria-busy="true"` on the loading wrapper
- [ ] Icon-only buttons: `aria-label` required
- [ ] Material Symbols icons: add `aria-hidden="true"` when decorative

---

## How to use in Claude Code

### Audit a single component
```
Read @.claude/accessibility.md — audit this component:
/src/components/[ui|ai|screens]/[Component].jsx

Run the full checklist. Report pass ✓ / fail ✗ / n/a.
For each failure: show the problem, show the fix, apply it.
```

### Audit a full page
```
Read @.claude/accessibility.md — audit this screen:
/src/app/screens/[screen]/page.jsx
Include all components it imports.
```

---

## Quick fixes for known issues in this project

### Icon-only buttons missing aria-label
```jsx
<button aria-label="[describe the action]">
  <span className="material-symbols-outlined" aria-hidden="true">[icon]</span>
</button>
```
(Add a real example here once the first icon-only button is built.)

### Material Symbols decorative icons
```jsx
<span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
```

### Material Symbols in interactive context
```jsx
<button aria-label="Go to next item">
  <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
</button>
```

### Focus ring — apply consistently
```jsx
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
```

### text-content-muted at small sizes — borderline/fails contrast
```jsx
// ✗ AVOID — gray-400 on bg-surface is ≈2.5:1, fails AA even for large text
<p className="t-caption">29 tháng 6, 2026</p>  {/* t-caption currently uses content-muted */}

// ✓ BETTER for text that must be read — use the darker secondary tone
<p className="t-caption text-content-secondary">29 tháng 6, 2026</p>
```
