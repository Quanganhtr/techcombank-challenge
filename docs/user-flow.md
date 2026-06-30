# user-flow — Claude.ai prompt template

Paste this into Claude.ai before designing a new section or page.
Maps screens, decisions, and entry/exit points.

---

```
# User flow mapping — quang-studio

## Context
Site: quang-studio — product designer portfolio
Visitor type: [e.g. recruiter at a product company / design lead / freelance client]
Goal of this visitor: [e.g. evaluate my skills / check my experience / contact me]
Section I'm planning: [e.g. Work page / Case study / Contact flow]

## Current pages
- / (home) → Hero, MyWork preview, Ability, Studio, Footer
- /about → AboutMe, MyExperiences
- /work → MyWork full list
- /work/[slug] → individual case study
- /contact → contact form (Resend)

## What I need

### 1. Map the primary flow
For the visitor type above:
- Where do they land? (likely home)
- What is the critical path to their goal?
- Where are the drop-off risks?
- What is the ideal exit action? (contact / download CV / share)

### 2. Map secondary flows
- Direct link to /work from LinkedIn/job application
- Direct link to a specific case study
- Mobile user scanning quickly

### 3. Identify gaps
- What screens or states are missing?
- Where might the visitor get stuck or confused?
- What micro-interactions would reduce friction?

### 4. Prioritise
Given I have limited time, which flow improvements give the most value?
Rank the top 3 changes.

## Output format
1. Primary flow as a step list (not a diagram — prose is fine)
2. Two secondary flows
3. Gap list with severity (critical / moderate / minor)
4. Top 3 prioritised recommendations
```

---

## When to use
- Before adding a new page or section
- When a recruiter says "I couldn't find your work"
- Before a job application — map the recruiter's specific flow

## Tip
After getting the flow, use the output to fill in your component-brief.md
for any new components the flow reveals are needed.
