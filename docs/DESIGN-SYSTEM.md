# DESIGN SYSTEM — Techcombank Mobile AI-First Redesign

> Color system follows Tailwind v4.3:
> - `cinnabar` = only custom brand color in `@theme`
> - All other palette colors = Tailwind defaults (gray, violet, etc.)
> - Semantic aliases = what you actually use in HTML — never raw palette classes

---

## 1. globals.css — full @theme block

```css
@import "tailwindcss";

@theme {

  /* ── Brand: Cinnabar (Techcombank Red) ── */
  --color-cinnabar-50:  oklch(0.9694 0.0152 12.42);
  --color-cinnabar-100: oklch(0.9303 0.0355 15.66);
  --color-cinnabar-200: oklch(0.8756 0.0665 16.20);
  --color-cinnabar-300: oklch(0.7968 0.1172 17.40);
  --color-cinnabar-400: oklch(0.7041 0.1878 21.02);
  --color-cinnabar-500: oklch(0.6495 0.2338 25.07);
  --color-cinnabar-600: oklch(0.6030 0.2347 26.99); /* #ed1c24 — primary brand */
  --color-cinnabar-700: oklch(0.5255 0.2091 27.68);
  --color-cinnabar-800: oklch(0.4582 0.1781 26.88);
  --color-cinnabar-900: oklch(0.4053 0.1498 25.85);
  --color-cinnabar-950: oklch(0.2631 0.0992 25.47);

  /* ── Semantic: Surface ── */
  --color-surface:          var(--color-gray-50);   /* page background */
  --color-surface-raised:   var(--color-white);     /* cards, modals */
  --color-surface-sunken:   var(--color-gray-100);  /* section backgrounds, inputs */
  --color-surface-overlay:  var(--color-gray-900);  /* footer, dark overlays */

  /* ── Semantic: Content (text) ── */
  --color-content-primary:   var(--color-gray-900); /* headings, body */
  --color-content-secondary: var(--color-gray-600); /* subtitles, labels */
  --color-content-muted:     var(--color-gray-400); /* placeholder, disabled */
  --color-content-inverse:   var(--color-white);    /* text on dark bg */

  /* ── Semantic: Border ── */
  --color-border-default: var(--color-gray-200);    /* default dividers */
  --color-border-strong:  var(--color-gray-300);    /* emphasized borders */
  --color-border-focus:   var(--color-cinnabar-600);/* input focus ring */

  /* ── Semantic: Brand ── */
  --color-brand:          var(--color-cinnabar-600);/* primary CTA, active nav */
  --color-brand-hover:    var(--color-cinnabar-700);/* hover state */
  --color-brand-subtle:   var(--color-cinnabar-50); /* tint backgrounds */
  --color-brand-muted:    var(--color-cinnabar-200);/* disabled brand */

  /* ── Semantic: AI ── */
  --color-ai:             var(--color-violet-500);  /* AI icons, accents */
  --color-ai-hover:       var(--color-violet-600);  /* AI hover */
  --color-ai-subtle:      var(--color-violet-50);   /* AI card background */
  --color-ai-border:      var(--color-violet-200);  /* AI card border */

  /* ── Semantic: Feedback ── */
  --color-success:        var(--color-green-600);
  --color-success-subtle: var(--color-green-50);
  --color-warning:        var(--color-amber-500);
  --color-warning-subtle: var(--color-amber-50);
  --color-info:           var(--color-blue-500);
  --color-info-subtle:    var(--color-blue-50);
  --color-danger:         var(--color-red-600);
  --color-danger-subtle:  var(--color-red-50);

  /* ── Typography ── */
  --font-sans: 'SF Pro Display', 'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* ── Font Size ── */
  --text-xs:   0.75rem;    /* 12px — captions, labels */
  --text-sm:   0.8125rem;  /* 13px — metadata, secondary */
  --text-base: 0.875rem;   /* 14px — body small */
  --text-md:   1rem;       /* 16px — body default ✓ extracted */
  --text-lg:   1.25rem;    /* 20px — body large ✓ extracted */
  --text-xl:   1.5rem;     /* 24px — h3 ✓ extracted */
  --text-2xl:  1.75rem;    /* 28px — h2 ✓ extracted */
  --text-3xl:  2rem;       /* 32px — h1, balance display ✓ extracted */
  --text-4xl:  5rem;       /* 80px — t-display hero (Figma sync) */

  /* ── Font Weight ── */
  --font-weight-light:    300;    /* ✓ extracted — headings */
  --font-weight-normal:   400;    /* ✓ extracted — body */
  --font-weight-medium:   500;    /* ✓ extracted — nav links */
  --font-weight-semibold: 600;    /* ✓ extracted — CTAs, card titles */
  --font-weight-bold:     700;    /* ✓ extracted — h3 variants */

  /* ── Line Height ── */
  --leading-tighter:    1.2;     /* 80px → 96px — t-display hero (Figma sync) */
  --leading-tight:      1.25;    /* headings */
  --leading-snug:       1.3333;  /* 24px→32px / 12px→16px — t-h3, t-caption (Figma sync) */
  --leading-comfortable:1.4;     /* 20px→28px / 14px→20px — t-body-lg, t-label, t-link (Figma sync) */
  --leading-normal:     1.5;     /* body */
  --leading-relaxed:    1.625;   /* long-form text */

  /* ── Spacing ── */
  --spacing-px: 1px;
  --spacing-0:  0px;
  --spacing-1:  0.25rem;   /* 4px */
  --spacing-2:  0.5rem;    /* 8px */
  --spacing-3:  0.75rem;   /* 12px ✓ extracted — card-label padding */
  --spacing-4:  1rem;      /* 16px ✓ extracted — content padding */
  --spacing-5:  1.25rem;   /* 20px */
  --spacing-6:  1.5rem;    /* 24px ✓ extracted — button padding, card */
  --spacing-7:  1.75rem;   /* 28px */
  --spacing-8:  2rem;      /* 32px ✓ extracted — footer padding */
  --spacing-10: 2.5rem;    /* 40px */
  --spacing-12: 3rem;      /* 48px */
  --spacing-16: 4rem;      /* 64px */
  --spacing-20: 5rem;      /* 80px */
  --spacing-24: 6rem;      /* 96px  (Figma sync) */
  --spacing-28: 7rem;      /* 112px (Figma sync) */
  --spacing-32: 8rem;      /* 128px (Figma sync) */
  --spacing-36: 9rem;      /* 144px (Figma sync) */
  --spacing-40: 10rem;     /* 160px (Figma sync) */
  --spacing-44: 11rem;     /* 176px (Figma sync) */
  --spacing-48: 12rem;     /* 192px (Figma sync) */
  --spacing-52: 13rem;     /* 208px (Figma sync) */
  --spacing-56: 14rem;     /* 224px (Figma sync) */
  --spacing-60: 15rem;     /* 240px (Figma sync) */
  --spacing-64: 16rem;     /* 256px (Figma sync) */

  /* ── Mobile Layout ── */
  --spacing-safe-top:    3.6875rem; /* 59px — status bar + notch */
  --spacing-safe-bottom: 2.125rem;  /* 34px — home indicator */
  --spacing-nav:         3.5rem;    /* 56px — nav bar ✓ extracted */
  --spacing-tab-bar:     5.1875rem; /* 83px — tab bar */

  /* ── Desktop / Landing Page ── */
  --spacing-max-width: 80rem; /* 1280px — case study landing page container (Figma sync, no Tailwind alias) */

}
```

---

## 2. Color Utilities — use these in HTML, nothing else

> This is the only reference needed when writing markup.
> Never use raw palette classes like `bg-gray-50` or `text-gray-900` directly.

### Surfaces
```html
bg-surface            <!-- page background -->
bg-surface-raised     <!-- card, modal, sheet -->
bg-surface-sunken     <!-- input, section bg, skeleton -->
bg-surface-overlay    <!-- footer, dark nav -->
```

### Text
```html
text-content-primary    <!-- headings, body copy -->
text-content-secondary  <!-- subtitles, metadata -->
text-content-muted      <!-- placeholder, disabled, captions -->
text-content-inverse    <!-- text on dark/brand bg -->
```

### Borders
```html
border-border-default   <!-- default card/list borders -->
border-border-strong    <!-- dividers, emphasized -->
border-border-focus     <!-- input focus ring -->
```

### Brand
```html
bg-brand                <!-- primary button, active tab -->
bg-brand-hover          <!-- button hover state -->
bg-brand-subtle         <!-- red tint chip, badge bg -->
text-brand              <!-- brand text, active link -->
border-brand            <!-- brand outlined button -->
```

### AI
```html
bg-ai-subtle            <!-- AI insight card background -->
border-ai-border        <!-- AI card border -->
text-ai                 <!-- AI icon, label -->
bg-ai                   <!-- AI filled button -->
```

### Feedback
```html
text-success  bg-success-subtle   <!-- positive returns, completed -->
text-warning  bg-warning-subtle   <!-- alerts, pending -->
text-info     bg-info-subtle      <!-- informational -->
text-danger   bg-danger-subtle    <!-- errors, negative -->
```

### Opacity modifier (when needed)
```html
bg-surface-overlay/80   <!-- semi-transparent overlay -->
bg-brand/10             <!-- very light brand tint -->
text-content-primary/60 <!-- dimmed text -->
```

---

## 3. Component color patterns

Consistent patterns for recurring components — always use these, never improvise:

### Card
```html
<div class="bg-surface-raised border border-border-default rounded-xl shadow-sm">
```

### AI Card
```html
<div class="bg-ai-subtle border border-ai-border border-l-4 border-l-ai rounded-xl">
```

### Primary Button
```html
<button class="bg-brand hover:bg-brand-hover text-content-inverse rounded px-6 py-3">
```

### Secondary Button
```html
<button class="bg-surface-raised border border-brand text-brand rounded px-6 py-3">
```

### Input
```html
<input class="bg-surface-sunken border border-border-default focus:border-border-focus rounded text-content-primary placeholder:text-content-muted">
```

### Page wrapper
```html
<div class="bg-surface text-content-primary">
```

### Section with contrast
```html
<section class="bg-surface-sunken">
```

### Footer
```html
<footer class="bg-surface-overlay text-content-inverse">
```

### Success state
```html
<span class="text-success bg-success-subtle rounded px-2 py-1">+12.4%</span>
```

### Warning chip
```html
<span class="text-warning bg-warning-subtle rounded-full px-3 py-1">Pending</span>
```

---

## 4. Typography (✓ extracted)

Font confirmed: **SF Pro Display** on Apple devices → falls back to **Be Vietnam Pro** loaded via `next/font`.

### Semantic text classes — always use these in JSX

Defined in `globals.css` via `@layer components`. One class per text style, never compose manually.

```jsx
<h1 className="t-display">Số dư tài khoản</h1>
<h1 className="t-h1">Tiêu đề trang</h1>
<h2 className="t-h2">Tính năng nổi bật</h2>
<h3 className="t-h3">Thẻ tín dụng</h3>
<p  className="t-body-lg">Mô tả sản phẩm</p>
<p  className="t-body">Giao dịch gần đây</p>
<span className="t-caption">29 tháng 6, 2026</span>
<span className="t-label">Danh mục</span>
<button className="t-cta">Khám phá ngay</button>
<span className="t-number">4,250,000 ₫</span>
<a className="t-link">Xem tất cả</a>
```

| Class | Size | Weight | Leading | Color |
|-------|------|--------|---------|-------|
| `t-display` | text-4xl (80px) | bold (700) | tighter | content-primary |
| `t-h1` | text-3xl (32px) | semibold (600) | tight | content-primary |
| `t-h2` | text-2xl (28px) | light (300) | tight | content-primary |
| `t-h3` | text-xl (24px) | semibold (600) | snug | content-primary |
| `t-body-lg` | text-lg (20px) | medium (500) | comfortable | content-secondary |
| `t-body` | text-md (16px) | normal (400) | normal | content-primary |
| `t-caption` | text-xs (12px) | normal (400) | snug | content-muted |
| `t-label` | text-base (14px) | medium (500) | comfortable | content-secondary |
| `t-cta` | text-md (16px) | semibold (600) | normal | content-inverse |
| `t-number` | text-md (16px), font-mono | normal (400) | normal | content-primary, tabular-nums |
| `t-link` | text-base (14px) | semibold (600) | comfortable | brand |

### globals.css — @layer components block

Add this below the `@theme` block:

```css
@layer components {
  .t-display  { @apply text-4xl  font-bold     leading-tighter     text-content-primary; }
  .t-h1       { @apply text-3xl  font-semibold leading-tight       text-content-primary; }
  .t-h2       { @apply text-2xl  font-light    leading-tight       text-content-primary; }
  .t-h3       { @apply text-xl   font-semibold leading-snug        text-content-primary; }
  .t-body-lg  { @apply text-lg   font-medium   leading-comfortable text-content-secondary; }
  .t-body     { @apply text-md   font-normal   leading-normal      text-content-primary; }
  .t-caption  { @apply text-xs   font-normal   leading-snug        text-content-muted; }
  .t-label    { @apply text-base font-medium   leading-comfortable text-content-secondary; }
  .t-cta      { @apply text-md   font-semibold leading-normal      text-content-inverse; }
  .t-number   { @apply text-md   font-mono     leading-normal tabular-nums text-content-primary; }
  .t-link     { @apply text-base font-semibold leading-comfortable text-brand; }
}
```

### Overriding color only
When you need a different color but same size/weight, add a color class alongside:
```jsx
<p className="t-body text-content-secondary">Muted body text</p>
<span className="t-number text-success">+12.4%</span>
<span className="t-number text-danger">-3.2%</span>
<a className="t-link text-ai">AI suggestion</a>
```

---

## 5. Other tokens (✓ extracted)

### Border Radius
```html
rounded      <!-- 8px  — buttons, inputs -->
rounded-xl   <!-- 12px — cards, popups -->
rounded-2xl  <!-- 16px — search, feature cards -->
rounded-full <!-- pills, avatars -->
```

### Shadows
```html
shadow-sm   <!-- cards -->
shadow-md   <!-- nav bar, dropdowns -->
shadow-lg   <!-- bottom sheets, modals -->
```

### Icons — Material Symbols Outlined
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet">

<span class="material-symbols-outlined text-brand">arrow_forward</span>
<span class="material-symbols-outlined text-ai">auto_awesome</span>
<span class="material-symbols-outlined text-content-secondary">search</span>
```