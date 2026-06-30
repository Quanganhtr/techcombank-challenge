# stress-test-design — Claude.ai prompt template

Paste this into Claude.ai after designing in Figma, before handoff to code.
Catches edge cases at design stage — cheaper to fix in Figma than in code.

---

```
# Stress test design — pre-handoff check

## Context
Site: quang-studio — product designer portfolio
Component / section being tested: [name]
Figma file: [URL or paste screenshot]
Stack it will be built in: Next.js 16, Tailwind CSS v4, Framer Motion v12

## Content edge cases — does the design hold up when?

### Text variations
- Title is 3 words vs 12 words
- Name "Quang Anh Trần" vs a very long name
- Vietnamese characters (ă ê ơ ư đ) in headings
- All caps title
- Single-word body text vs 5-line paragraph
- Missing optional content (no subtitle, no description)

### Data variations (for Work / Projects sections)
- 1 project vs 10 projects
- Project with no thumbnail image
- Project title > 60 characters
- Tag labels that are very long (e.g. "Product Strategy & Research")
- Project with no tags

### Layout stress
- What breaks at 375px (iPhone SE)?
- What breaks at 768px (iPad)?
- What if the browser font size is set to 20px (accessibility setting)?
- What if text is 150% zoom?

## Interaction edge cases
- What happens on hover on a touch device?
- What if the animation doesn't load (JS disabled)?
- What if the user has prefers-reduced-motion on?

## Visual edge cases
- Does it work in dark mode?
- Does the Honeysuckle yellow (#e6fe7f) have enough contrast in context?
- Does the dashed border style still read at 0.5px on retina?

## Output format
For each failure found:
1. Describe the problem
2. Show what the design should do instead
3. Rate severity: critical (breaks) / moderate (degrades) / minor (nitpick)

Then: list the top 3 fixes to make in Figma before handoff.
```

---

## When to use
- After completing a Figma design, before opening Claude Code
- Any time a design feels "done" — this is the final check
- After getting feedback that something broke in code — trace it back to design

## Tip
Paste your Figma screenshot directly into Claude alongside this prompt.
The more specific the screenshot, the more specific the feedback.
