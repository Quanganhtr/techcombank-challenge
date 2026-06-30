# motion-direction — Claude.ai prompt template

Paste this into Claude.ai to define animation intent before coding.
Output from this prompt feeds directly into .claude/motion-impl.md in Claude Code.

---

```
# Motion direction — define before coding

## Context
Site: quang-studio — product designer portfolio
Stack: Framer Motion v12, Next.js 16
Component / section: [name]
File: /src/components/[path]/[Component].tsx

## Current behaviour
[describe what happens now — e.g. "elements appear instantly, no animation"]

## Desired feel
Overall character: [e.g. sharp and confident / gentle and editorial / playful / invisible]
Energy level: [1–5 where 1=barely moves, 5=expressive]
Reference: [e.g. "like Linear's website" / "like a printed page coming to life" / no reference]

## Animations needed

For each element, describe:

### [Element name — e.g. Hero headline]
- Trigger: [scroll-enter / page-load / hover / click / none]
- What it does: [e.g. slides up + fades in]
- Duration feel: [instant <150ms / fast 150–300ms / medium 300–500ms / slow 500ms+]
- Easing: [sharp (ease-out) / elastic / linear / gentle (ease-in-out)]
- Delay: [none / staggered with other elements]
- Exit: [none / reverses / fades out]

### [Next element]
...

## Constraints
- Must use Framer Motion (no CSS keyframes except floatUpDown)
- Must have prefers-reduced-motion fallback
- No animation should loop indefinitely unless it's decorative and subtle
- Page transitions use existing PixelTransition component — do not replace

## Output format
For each animation:
1. Motion spec (trigger / property / from → to / duration / easing)
2. Framer Motion variant name to use (from the standard library or a new named variant)
3. Any interaction between elements (stagger, sequence, shared layout)
4. Reduced motion fallback behaviour

Then: flag any animations that feel excessive or inconsistent with the overall feel.
```

---

## When to use
- Before touching any Framer Motion code
- When a section feels "flat" and needs life
- When animations feel inconsistent across sections

## How it connects to code
Take Claude's output from this prompt and paste it into your Claude Code prompt:

```
Read @.claude/motion-impl.md — implement this motion direction:
[paste output here]
```

## Tip
Less is more for a portfolio. Aim for 1–2 signature animations
(WordReveal, scroll fade-in) used consistently — not a different
animation on every element.
