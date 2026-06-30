# Stress test UI — edge case checker

Tests a built component in the Techcombank Mobile AI-First Redesign for
edge cases before shipping. Read this before running a stress test on any
component.

---

## Test checklist

Run ALL of these on the target component. Report pass ✓ / fail ✗ / n/a for each.

### Content edge cases
- [ ] Empty string — what renders when text prop is ""?
- [ ] Very short content — single character or single word
- [ ] Very long content — title > 80 chars, paragraph > 400 chars
- [ ] Special characters — Vietnamese characters (ă, ê, ơ, ư, đ — this app's
      primary content language), emoji, & < > " '
- [ ] Numbers only — "12345" as a title; financial figures use t-number
      (font-mono tabular-nums) — confirm digits stay aligned
- [ ] All caps — "THIS IS A TITLE"
- [ ] Null / undefined props — what happens if optional props are missing?

### Layout edge cases
- [ ] Fixed mobile viewport (390px, iPhone 14 reference) — the primary target
- [ ] Narrower device (375px, iPhone SE) — does it still fit without overflow?
- [ ] Taller/shorter device — safe-area tokens (--spacing-safe-top,
      --spacing-safe-bottom) sized correctly so content isn't clipped by
      the notch or home indicator
- [ ] Very tall content — does it push layout or overflow?
- [ ] No content / zero items — empty list, empty grid

### Visual edge cases
- [ ] All tokens resolve correctly (this project has a single theme — no
      dark mode to check)
- [ ] Border visible — border-border-default / border-border-strong appear correctly
- [ ] Brand/AI color contrast — text-brand and text-ai are borderline at
      small sizes (≈4.4:1 / ≈4.1:1) — verify against .claude/accessibility.md
      before using them on small body text
- [ ] Image missing — what shows when src is broken or undefined?

### Interaction edge cases
- [ ] Keyboard navigation — Tab reaches interactive elements in logical order
- [ ] Hover on touch device — hover states don't get stuck on mobile
- [ ] Rapid clicking — button/link clicked multiple times fast
- [ ] Animation on slow device — does the reduced-motion fallback work?

### Integration edge cases
- [ ] Sits correctly inside the screen's bg-surface wrapper at 390px
- [ ] Coexists with the status bar + bottom tab bar required on every
      screen (see .claude/screen-spec.md)
- [ ] If it's an AI component: only one AI moment visible at a time, always
      dismissible, doesn't stack with other AI cards (AI Component Rules
      in CLAUDE.md)

---

## How to run in Claude Code

```
Read @.claude/stress-test-ui.md — stress test this component:
/src/components/[ui|ai|screens]/[Component].jsx

Run the full checklist. For each failure:
1. Show the exact problem
2. Show the fix
3. Apply the fix directly to the file
```

---

## Common failures in this project and their fixes

### Long Vietnamese names/labels overflow
Fix: `truncate` or `line-clamp-2` class

### Hover state stuck on mobile
Fix: Use `@media (hover: hover)` — wrap hover styles:
```jsx
// In Framer Motion:
whileHover={typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
  ? { y: -2 } : {}}
```

### text-content-muted used for readable text
Fix: see .claude/accessibility.md — gray-400 on bg-surface fails contrast
even for large text. Swap to `text-content-secondary` for anything the
user needs to actually read.

(No other project-specific layout fixes yet — add findings here as more
screens are built.)
