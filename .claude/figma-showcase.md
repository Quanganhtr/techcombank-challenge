# Figma showcase — create visual reference frames

Creates visual showcase frames in Figma for any token category.
These frames serve two purposes:
1. Visual reference — designers can see all tokens at a glance
2. MCP read anchor — Direction A uses these frames to read token values
   via get_variable_defs without needing manual canvas selection

---

## How to use

```
Read @.claude/figma-showcase.md — create a [type] showcase.
Figma file: [URL]
Page: [page name]
Type: [color / typography / spacing / radius / all]
```

---

## Showcase types

### Color showcase
Frame name: "Color Showcase"
Layout: vertical stack of sections, one per collection

Section 1 — Cinnabar Palette
- 11 rectangles in a row, each 80×80px
- Each rectangle filled with its Cinnabar Palette variable
- Label below each: variable name + OKLCH value
- Section title: "Cinnabar Palette" using the t-h3 text style

Section 2 — Semantic
- One rectangle per Semantic variable, 80×80px
- Each filled with its Semantic variable (single theme — no Light/Dark split)
- Label below: variable name
- Section title: "Semantic" using the t-h3 text style

---

### Typography showcase
Frame name: "Typography Showcase"
Layout: vertical list, one row per text style — no breakpoint columns
(this project has a single fixed 390px mobile viewport, not a responsive site)

For each of the 10 styles (t-display, t-h2, t-h3, t-body-lg, t-body,
t-caption, t-label, t-cta, t-number, t-link):
- One text node: "Ag 123 — The quick brown fox" with that style applied
- Label to the left: style name
- Section divider between the Display group (t-display, t-h2, t-h3) and
  the Body group (t-body-lg, t-body, t-caption, t-label, t-cta, t-number, t-link)

---

### Spacing showcase
Frame name: "Spacing Showcase"
Layout: vertical list

For each Space/* variable (px, 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 16, 20):
- A horizontal rectangle with width = that spacing value
- Height fixed at 24px
- Filled with the Brand semantic variable
- Label to the right: "Space/[n] — [px value]"

For the mobile layout tokens (no Tailwind alias — hardcoded):
- Separate section at bottom, shown as a labeled list rather than rectangles
  (some are taller than the showcase frame)
- Labels: "Safe-top — 59px", "Safe-bottom — 34px", "Nav — 56px", "Tab-bar — 83px"

---

### Radius showcase
Frame name: "Radius Showcase"
Layout: row of 4 shapes

No custom Radius collection exists for this project (Tailwind v4 defaults
are used directly) — this showcase is for visual reference only, not bound
to variables:

For rounded, rounded-xl, rounded-2xl, rounded-full:
- Rectangle 120×120px (use a 40×40px circle for rounded-full)
- Corner radius 8px / 12px / 16px / full respectively
- Filled with the Brand semantic variable
- Label below: "[class] — [px]"

---

### All showcase (Token Showcase)
Frame name: "Token Showcase"
Page name: "Token Showcase"
Layout: vertical stack of all sections above in this order:
1. Color Showcase (Cinnabar Palette + Semantic)
2. Typography Showcase
3. Spacing Showcase
4. Radius Showcase

Add a title at the top:
- "Techcombank Mobile — AI-First Redesign" using the t-display text style
- Subtitle: "Token Showcase — auto-generated from globals.css" using the t-body text style

---

## Rules
- Apply actual variables to every element — never hardcode hex values
- This is a documentation frame, not bound to the app's fixed 390px mobile
  viewport — use a wide reference frame (e.g. 960px) so all sections fit
  comfortably side by side
- Leave 48px padding inside each section
- Leave 80px gap between sections
- All labels use the t-caption text style
- All section titles use the t-h3 text style
- After creation, report: frame name, node ID, total elements created
  The node ID is needed for Direction A in token-sync.md
