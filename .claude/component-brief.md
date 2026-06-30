# Component brief — fill before every prompt

Always fill this brief before asking Claude to build or edit a component.
Include the filled brief at the start of your prompt.

---

## Brief template

```
Component name:
File path: /src/components/[ui|ai|screens]/[Name].jsx

Section it lives in:
  (home / search / wealth / shared)

What it does (1 sentence):
Who sees it:
Key interaction: (hover / click / scroll / drag / none)

Visual intention
  Feel: (e.g. sharp, playful, quiet, confident, raw)
  Motion: (e.g. fade-in on scroll, hover lift, none)
  Key tokens: (e.g. bg-brand, t-h3, border-border-default, text-content-muted)

Viewport
  Fixed 390px mobile (iPhone 14 reference) — no tablet/desktop variants.
  Note any edge-case device width to also check (e.g. 375px iPhone SE,
  safe-area insets via --spacing-safe-top/bottom).

Edge cases
  Empty state:
  Long text: (e.g. title > 60 chars, long Vietnamese labels)
  Loading state:
  Error state:

Constraints
  - No inline styles
  - No hardcoded hex — token classes only
  - No new fonts — use existing font utilities (font-sans / font-mono)
  - No TypeScript — plain JS, named export only (no default export)
  - Framer Motion only for animation — no CSS transitions/keyframes
  - [add any screen-specific constraints]
```

---

## How to use in Claude Code

Paste this at the start of your prompt:

```
Read @.claude/component-brief.md — here is my brief:

Component name: [Name]
File path: /src/components/ui/[Name].jsx
...
[rest of filled brief]

Now build the component.
```

---

## Real examples from this project

(No filled examples yet — this project has no built components. Add a real
filled brief here once the first component is built, so future prompts have
a concrete reference.)
