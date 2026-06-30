# ux-audit — Claude.ai prompt template

Paste this into Claude.ai. Works at 3 stages:
A) before design — audit inspiration/competitor screens
B) mid-design — audit your own Figma screens
C) after build — audit your live site

---

```
# UX audit — [choose: inspiration / my Figma design / my live site]

## Context
Site: quang-studio — product designer portfolio
URL (if live): [https://your-url.com OR "not live yet"]
Section being audited: [e.g. Hero / Work page / Contact / whole site]
Stage: [before design / mid-design / post-build]

## What to audit

### 1. First impression (0–5 seconds)
- What is the single clearest message?
- What is the first thing the eye goes to?
- Is the value proposition (who I am + what I do) clear without scrolling?
- Does the visual hierarchy match the intended priority?

### 2. Heuristic review (Nielsen's 10)
Check each — pass ✓ / fail ✗ / n/a:
- Visibility of system status (loading states, active states)
- Match between system and real world (language, metaphors)
- User control and freedom (can I go back? undo?)
- Consistency and standards (same patterns used throughout)
- Error prevention (form validation, destructive action warnings)
- Recognition rather than recall (labels visible, no memory required)
- Flexibility and efficiency (shortcuts for experienced users)
- Aesthetic and minimalist design (no irrelevant info)
- Help users recognize/recover from errors
- Help and documentation

### 3. Portfolio-specific checks
- Is the work easy to find within 2 clicks from homepage?
- Do case studies show problem → process → outcome?
- Is there a clear CTA to contact or download CV?
- Does the about section tell a story or just list facts?
- Is the personality of the designer visible?

### 4. Motion and interaction
- Do animations add meaning or just noise?
- Are transitions consistent across the site?
- Does motion feel appropriate for a designer's portfolio (not a game)?

## Output format
1. Top 3 things working well — keep these
2. Top 3 critical issues — fix before launch
3. Top 3 nice-to-have improvements — do if time allows
4. One specific recommendation for the [section] being audited
```

---

## When to use
- Any time you make a big change to a section
- Before sharing the site with a recruiter
- Mid-Figma when something feels off but you can't name why

## Tip
Paste screenshots of your Figma file or live site into the chat
alongside this prompt for more specific feedback.
