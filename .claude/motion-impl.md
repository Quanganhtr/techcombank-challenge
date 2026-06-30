# Motion implementation — Framer Motion skill

Implements animations in the Techcombank Mobile AI-First Redesign using
Framer Motion v12. Read this before adding any animation to a component.

---

## Rules

- Framer Motion only — never CSS keyframes or CSS transitions
- Always wrap animated elements in `<motion.div>` (or motion.span, motion.section etc.)
- Always respect reduced motion: check `useReducedMotion()` from framer-motion
- Import: `import { motion, useReducedMotion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion'`
- Variants pattern preferred over inline animate props for reusable animations

---

## Standard variants library — use these before inventing new ones

### Fade in on scroll
```jsx
const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
}
// Usage: whileInView="visible" initial="hidden" viewport={{ once: true }}
```

### Stagger children
```jsx
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}
// Pair with fadeInUp on children
```

### Word reveal (stagger by word)
```jsx
const wordVariant = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
}
// Wrap each word in an overflow-hidden span
```

### Hover lift (any tappable card/button)
```jsx
whileHover={{ y: -2, transition: { duration: 0.15 } }}
whileTap={{ y: 0, scale: 0.98 }}
```

### Gentle pulse (decorative icons — e.g. the AI sparkle icon)
```jsx
<motion.span animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
  <span className="material-symbols-outlined text-ai">auto_awesome</span>
</motion.span>
```

### AI card enter/exit
AI moments must always be dismissible and never stack (see AI Component
Rules in CLAUDE.md) — wrap in AnimatePresence so the exit animation runs
on dismiss:
```jsx
<AnimatePresence>
  {showAiCard && (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      {/* AI card content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Screen transition
If multiple screens need the same enter/exit transition, build one reusable
wrapper component and reuse it across `src/app/screens/*` — don't recreate
per screen.

(Add more reusable variants here as components are built.)

---

## Scroll-linked animations

For parallax / scroll-driven animations use useScroll + useTransform:

```jsx
const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
const y = useTransform(scrollYProgress, [0, 1], [0, -80])
// Apply: <motion.div style={{ y }}>
```

---

## Reduced motion pattern — always include

```jsx
export function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion()

  const variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 }
  }
  // ...
}
```

---

## Performance rules
- Never animate width/height — use scaleX/scaleY instead
- Never animate top/left — use x/y (transform-based)
- Use `will-change: transform` sparingly — only on elements with continuous animation
- Exit animations: use AnimatePresence for any mount/unmount transition (modals, AI cards, toasts)

---

## How to use in Claude Code

After filling a motion-direction brief in Claude.ai:

```
Read @.claude/motion-impl.md — implement the animation described below
in /src/components/[ui|ai|screens]/[Component].jsx

Motion direction brief:
  Component: [name]
  Animation: [description from motion-direction prompt]
  Trigger: [scroll / hover / click / mount / page transition]
  Feel: [e.g. sharp, elastic, gentle]
  Duration: [e.g. fast 200ms / medium 400ms / slow 600ms]
  Reduced motion fallback: [e.g. instant / fade only / none]
```
