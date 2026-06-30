# analytics — Claude.ai prompt template

Use when analysing Google Analytics data for quang-studio.
Paste this into Claude.ai with a screenshot or CSV export from GA.

---

```
# Google Analytics analysis — quang-studio

## My context
Site: quang-studio — product designer portfolio
URL: [your live URL]
Audience: recruiters, design leads, potential clients
Primary goal: get visitors to view work → contact me

## Data I'm sharing
[paste screenshot OR describe: "GA Pages report, date range X–Y, N sessions total"]

## Pages in my site
/ (home) → Hero, work preview, about teaser, footer
/work → full project list
/work/[slug] → individual case studies:
  /work/minswap
  /work/noodles-fi
  /work/ada-fun
  /work/fruit-map
  /work/my-gu
  /work/reviewnha
/about → full about + experience
/contact → contact form

## What I want

### 1. Traffic interpretation
- What is the overall health of this site based on the data?
- Which pages are performing well vs underperforming?
- What does the drop-off pattern tell me about user behaviour?

### 2. Funnel analysis
Ideal recruiter funnel: / → /work → /work/[slug] → /contact
- Are visitors following this funnel?
- Where are they dropping off?
- What percentage reach a case study?
- What percentage reach /contact?

### 3. Page-level insights
For each page with significant traffic, analyse:
- Views vs active users ratio (are people actually engaging?)
- Time on page (are they reading or bouncing?)
- Events per session (are they interacting?)
- What the data suggests about that page's UX

### 4. UX improvement priorities
Based on the data, rank the top 3 pages that need UX work.
For each: what metric is the signal, what UX problem it likely indicates,
and one specific design change to test.

### 5. Recruiter report
Write a 3-paragraph narrative I can include in my portfolio or share
with a recruiter that tells the story of this site's performance:
- What the traffic shows about audience behaviour
- What's working well
- What I'm actively improving based on data

### 6. Comparison (if I share two time periods)
- What changed between period A and period B?
- Which pages improved, which declined?
- What likely caused the change?
- What should I do next based on the trend?

## Key metrics to focus on
- Số lượt xem = Page views
- Số người dùng đang hoạt động = Active users
- Thời gian tương tác trung bình = Average engagement time
- Số lượng sự kiện = Event count

## Output format
1. One-paragraph health summary (traffic, engagement, funnel)
2. Page performance table: Page | Views | Avg time | Signal | Assessment
3. Top 3 UX problems with recommended fixes
4. Recruiter-ready narrative (3 paragraphs)
5. Top 3 next actions ranked by impact
```

---

## How to use

**For a single snapshot:**
1. Go to GA → Pages and screens report
2. Screenshot the full table
3. Open Claude.ai, paste this template
4. Attach the screenshot
5. Send

**For time comparison:**
1. Take two screenshots — current period vs previous period
2. Paste both into Claude.ai with this template
3. Fill in both date ranges in the "Data I'm sharing" field

**For deeper analysis:**
Export CSV from GA (Download button → CSV) and paste the raw
data instead of a screenshot for more precise numbers.

---

## Insights from first read (2026-06-23 to 2026-06-24)
- Total views: 216 / Active users: 68
- Homepage (/) dominates at 49% of views — normal for a portfolio
- /work at 19% — good, recruiters are finding the work section
- /about engagement time (1m20s) beats homepage (28s) — about page resonates
- /contact at only 1.85% — conversion funnel has a gap
- /work/minswap most visited case study (9.72%) — lead with this one
- Average events/session: 3.18 — moderate interaction, room to improve
```
