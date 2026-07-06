# Token sync — Figma ↔ globals.css

Keeps design tokens in sync between Figma variables/text styles and the
@theme + @layer components blocks in src/app/globals.css.
Read this before any token sync operation.

---

## Source of truth hierarchy
Code:
  globals.css @theme            → Tailwind v4 built-ins
                                 → Cinnabar palette (custom)
                                 → Semantic tokens (surface, content, border, brand, ai, feedback)
                                 → Typography scale (font size, weight, line-height)
                                 → Spacing scale (incl. mobile safe-area tokens)
  globals.css @layer components → t-* typography classes

Figma:
  TailwindCSS file (library) → Cinnabar Palette collection
                              → Semantic collection (aliases both)
                              → Spacing / Typography / Radius collections

Tailwind Figma library: https://www.figma.com/design/GKh419EgaedMrupXqJ63Ol/TailwindCSS-v4.2.4-Design-System--Community---Copy-
Design System file: https://www.figma.com/design/YI7OSQaMjHEvf7KkU3OBsJ/Techcombank-Quang-Anh?node-id=0-1&t=QFyngNovcg5uWs4G-1

Note: this project has a single theme — no Light/Dark modes. Every
collection below uses Mode: (none), unlike multi-mode setups elsewhere.

---

## Direction A — Figma → Code
Use when: you changed a color, size, or text style in Figma and want code to match.

No showcase frame or canvas selection needed — read Figma's variables and
text styles directly via use_figma, the same way Direction B created them.
This is more reliable than reading off a showcase node's applied
properties (no risk of a swatch being mis-applied or stale) and needs no
manual setup in Figma desktop first.

Steps:

1. Read all variable collections via use_figma:
   `figma.variables.getLocalVariableCollectionsAsync()`, then for each
   variable `figma.variables.getVariableByIdAsync(id)` to read
   `valuesByMode`. Resolve one level of `VARIABLE_ALIAS` to get the actual
   color/number (convert COLOR values from 0–1 RGB back to hex for
   comparison against globals.css).

2. Read all text styles via `figma.getLocalTextStyles()`, filtered to
   names starting with `t-` — gives fontName, fontSize, and lineHeight
   directly, no node selection required.

3. Read src/app/globals.css — specifically:
   - @theme block: Cinnabar palette values
   - @theme block: semantic mappings (surface-*, content-*, border-*,
     brand-*, ai-*, success/warning/info/danger)
   - @theme block: font size / font-weight / line-height tokens
   - @theme block: spacing + mobile layout tokens (safe-top, safe-bottom,
     nav, tab-bar)
   - @layer components block: t-* typography classes

4. Compare Figma variables against globals.css:
   - Cinnabar Palette → compare against @theme cinnabar-* values
   - Semantic         → compare against @theme surface/content/border/brand/ai/feedback values
   - Spacing          → compare against @theme spacing-* values (incl. mobile layout)
   - Typography       → compare against @theme text-*/font-weight-*/leading-* values
   - Radius           → no @theme override exists; compare against Tailwind v4
                         defaults only (rounded=8px, rounded-xl=12px, rounded-2xl=16px,
                         rounded-full). Drift here usually means the Tailwind library
                         version drifted from the installed npm package, not a real bug.

5. Compare Figma text styles against globals.css @layer components block:
   Check all 10 styles — there are no responsive breakpoint variants in
   this project (fixed 390px mobile viewport, no Mobile/Tablet/Desktop split):
     t-display, t-h2, t-h3, t-body-lg, t-body,
     t-caption, t-label, t-cta, t-number, t-link
   Properties to check:
     fontFamily → Figma stores one literal font name (no fallback stack);
                  compare it against the FIRST entry in code's --font-sans
                  / --font-mono stack, not the whole stack. Currently:
                  Font/Sans + all non-mono styles → "SF Pro Display"
                  (matches --font-sans's first entry; Be Vietnam Pro is the
                  intentional next/font-loaded fallback for non-Apple
                  visitors, not expected to appear in Figma).
                  Font/Mono + t-number → "JetBrains Mono"
     fontWeight → matches font-weight in the class
     fontSize   → matches font-size token
     lineHeight → matches leading token (convert unitless multiplier ×
                  font-size to px when comparing — Figma stores px/%)

6. Output two diff tables:

   Table 1 — Variables:
   Collection | Variable | Figma value | Code value | Status (✓ / ✗ drift)
   Show ONLY drifted tokens — report "zero drift" if everything matches.

   Table 2 — Text styles:
   Style name | Property | Figma value | Code value | Status (✓ / ✗ drift)
   Show ONLY drifted styles — report "zero drift" if everything matches.

7. For each drift found — ask before patching:
   "Figma shows X, code shows Y — which is correct?"
   Wait for confirmation before changing anything.

8. After confirmation — patch in the correct direction:

   If code is wrong:
   - Color/spacing → patch globals.css @theme block, changed lines only,
     no reformatting, no reordering
   - Text style → patch the @layer components block for that class,
     changed values only

   If Figma is wrong:
   - Variable → fix via set_variable MCP tool
   - Text style → fix via use_figma tool, load font first

9. Re-run steps 1 and 2 to verify zero drift after all fixes.
   Report: "Fixed X variables, Y text styles. Zero drift confirmed."

---

## Direction B — Code → Figma
Use when: setting up Figma for the first time from existing code (retrofit).

Prerequisites:
- TailwindCSS library file must be enabled in the Design System file
  (Main menu → Libraries → enable TailwindCSS v4 file)
- All aliases below reference variables from that library

Steps — complete ALL steps in order, do not stop after variables:

1. Read @theme block from src/app/globals.css
2. Read @layer components block for the t-* typography classes

3. Create Collection 1 "Cinnabar Palette" via set_variable MCP tool
   Mode: (none — raw values, single theme, no Light/Dark)
   Do NOT alias from Tailwind — these are custom brand colors not in Tailwind.
   Enter as OKLCH (Figma supports OKLCH input) to match source exactly —
   do not convert to hex, that introduces rounding drift on re-sync:
     50  → oklch(0.9694 0.0152 12.42)
     100 → oklch(0.9303 0.0355 15.66)
     200 → oklch(0.8756 0.0665 16.20)
     300 → oklch(0.7968 0.1172 17.40)
     400 → oklch(0.7041 0.1878 21.02)
     500 → oklch(0.6495 0.2338 25.07)
     600 → oklch(0.6030 0.2347 26.99)  ← #ed1c24, primary brand
     700 → oklch(0.5255 0.2091 27.68)
     800 → oklch(0.4582 0.1781 26.88)
     900 → oklch(0.4053 0.1498 25.85)
     950 → oklch(0.2631 0.0992 25.47)

4. Create Collection 2 "Semantic" via set_variable MCP tool
   Mode: (none — single theme, no Light/Dark)
   Use variable aliases wherever possible — alias from:
     - Cinnabar Palette collection (for cinnabar-* references)
     - TailwindCSS library (for gray-*, violet-*, green-*, amber-*, blue-*,
       red-*, white references)

   Variables:
     Surface            alias gray/50
     Surface-raised      alias white
     Surface-sunken      alias gray/100
     Surface-overlay     alias gray/900

     Content-primary     alias gray/900
     Content-secondary   alias gray/600
     Content-muted       alias gray/400
     Content-inverse     alias white

     Border-default      alias gray/200
     Border-strong       alias gray/300
     Border-focus        alias Cinnabar Palette/600

     Brand               alias Cinnabar Palette/600
     Brand-hover         alias Cinnabar Palette/700
     Brand-subtle        alias Cinnabar Palette/50
     Brand-muted         alias Cinnabar Palette/200

     AI                  alias violet/500
     AI-hover            alias violet/600
     AI-subtle           alias violet/50
     AI-border           alias violet/200

     Success             alias green/600
     Success-subtle      alias green/50
     Warning             alias amber/500
     Warning-subtle      alias amber/50
     Info                alias blue/500
     Info-subtle         alias blue/50
     Danger              alias red/600
     Danger-subtle       alias red/50

5. Create Collection 3 "Typography" via set_variable MCP tool
   Mode: (none — single values)
   Neither font is in the Tailwind library — both are hardcoded,
   loaded via next/font/google in src/app/layout.jsx:
     Font/Sans → "Be Vietnam Pro" (hardcode)
     Font/Mono → "JetBrains Mono" (hardcode)

6. Create Collection 5 "Radius" via set_variable MCP tool
   Mode: (none — single values)
   Techcombank has no @theme radius override — these are Tailwind v4's
   default radius scale, aliased straight from the TailwindCSS library so
   Figma components reference variables instead of hardcoded corner radius.
   The library caps at 4xl — there is no 5xl/6xl to alias.
     rounded-none → alias radius/none  (0px)
     rounded-xs   → alias radius/xs    (2px)
     rounded-sm   → alias radius/sm    (4px)
     rounded-md   → alias radius/md    (6px)
     rounded      → alias radius/lg    (8px  — buttons, inputs ✓ extracted)
     rounded-xl   → alias radius/xl    (12px — cards, popups)
     rounded-2xl  → alias radius/2xl   (16px — search, feature cards)
     rounded-3xl  → alias radius/3xl   (24px)
     rounded-4xl  → alias radius/4xl   (32px)
     rounded-full → alias radius/full  (pills, avatars)

7. Create Collection 4 "Spacing" via set_variable MCP tool
   Mode: (none — single values)
   Alias from TailwindCSS library (naming: spacing/1, spacing/2 etc) —
   these match Tailwind's default scale exactly:
     Space/px  → alias spacing/px   (1px)
     Space/0   → alias spacing/0    (0px)
     Space/1   → alias spacing/1    (4px)
     Space/2   → alias spacing/2    (8px)
     Space/3   → alias spacing/3    (12px)
     Space/4   → alias spacing/4    (16px)
     Space/5   → alias spacing/5    (20px)
     Space/6   → alias spacing/6    (24px)
     Space/7   → alias spacing/7    (28px)
     Space/8   → alias spacing/8    (32px)
     Space/10  → alias spacing/10   (40px)
     Space/12  → alias spacing/12   (48px)
     Space/16  → alias spacing/16   (64px)
     Space/20  → alias spacing/20   (80px)

   — Mobile layout (no Tailwind alias — hardcode, non-multiple-of-4 values) —
   Safe-top    → 59px   (3.6875rem — status bar + notch)
   Safe-bottom → 34px   (2.125rem — home indicator)
   Nav         → 56px   (3.5rem — nav bar)
   Tab-bar     → 83px   (5.1875rem — tab bar)

8. Create all 10 text styles via create_text_style MCP tool.
   This project has no responsive breakpoints — one value per style.
   Bind font family to the Typography variables — do not hardcode font names.
   Color/fill is NOT part of the text style — bind fill separately to the
   matching Semantic color variable when applying the style to a layer.

   t-display  — Font/Sans, weight 300, 32px, line-height 40px   → fill: Content-primary
   t-h2       — Font/Sans, weight 300, 28px, line-height 35px   → fill: Content-primary
   t-h3       — Font/Sans, weight 600, 24px, line-height 33px   → fill: Content-primary
   t-body-lg  — Font/Sans, weight 300, 20px, line-height 30px   → fill: Content-secondary
   t-body     — Font/Sans, weight 400, 16px, line-height 24px   → fill: Content-primary
   t-caption  — Font/Sans, weight 400, 13px, line-height 19.5px → fill: Content-muted
   t-label    — Font/Sans, weight 500, 13px, line-height 19.5px → fill: Content-secondary
   t-cta      — Font/Sans, weight 600, 16px, line-height 24px   → fill: Content-inverse
   t-number   — Font/Mono, weight 400, 16px, line-height Auto   → fill: Content-primary; enable tabular figures
   t-link     — Font/Sans, weight 600, 13px, line-height 19.5px → fill: Brand

9. Report: list every collection and every text style created.
   If any step failed, say which one and why.

---

## Direction C — Audit only
Use when: you want to check if Figma and code are in sync without changing anything.

Steps:
1. Read Figma variables from Design System file via MCP
2. Read @theme + @layer components blocks in globals.css
3. Output a table: Token | Figma value | Code value | Status (✓ / ✗ drift)
4. Do not change anything

---

## Critical rules
- NEVER touch globals.css outside the @theme and @layer components blocks
- NEVER reformat existing CSS — patch only the changed values
- If a Figma variable has no matching token, flag it — do not invent a new token
- Semantic tokens in @theme use CSS variable references (var(--color-gray-50)) —
  preserve this pattern when patching
- This project has no dark mode — never introduce a Dark mode to the
  Semantic collection
- Cinnabar values are oklch() in code — enter as OKLCH in Figma, do not
  silently convert to hex (causes rounding drift on re-sync)
- t-number uses font-mono + tabular-nums — when creating/checking this
  text style, confirm tabular figures are enabled in Figma, not just the
  font family
- Mobile layout spacing tokens (safe-top, safe-bottom, nav, tab-bar) are
  hardcoded — no Tailwind alias exists for them
- Semantic variables must alias source variables, never hardcode hex —
  exception: Cinnabar palette values themselves

---

## Spacing map (Tailwind class → Figma variable)
gap-1 / p-1 / m-1  → Space/1   (4px)
gap-2 / p-2 / m-2  → Space/2   (8px)
gap-3 / p-3 / m-3  → Space/3   (12px)
gap-4 / p-4 / m-4  → Space/4   (16px)
gap-6 / p-6 / m-6  → Space/6   (24px)
gap-8 / p-8 / m-8  → Space/8   (32px)
pt-(--spacing-safe-top)    → Safe-top    (59px)
pb-(--spacing-safe-bottom) → Safe-bottom (34px)
h-(--spacing-nav)          → Nav         (56px)
h-(--spacing-tab-bar)      → Tab-bar     (83px)

---

## Text style map (code class → Figma text style name)
Since this project's t-* classes are already named identically to their
Figma style names, this map is a 1:1 identity — listed for completeness:

t-display  → t-display
t-h2       → t-h2
t-h3       → t-h3
t-body-lg  → t-body-lg
t-body     → t-body
t-caption  → t-caption
t-label    → t-label
t-cta      → t-cta
t-number   → t-number
t-link     → t-link

---

## How to use in Claude Code

Direction A:
Read @.claude/token-sync.md — run direction A.
Figma file: [https://www.figma.com/design/YI7OSQaMjHEvf7KkU3OBsJ/Techcombank-Quang-Anh?node-id=0-1&t=QFyngNovcg5uWs4G-1]
Compare Figma variables and text styles to src/app/globals.css.
Report all drift found.

Direction B:
Read @.claude/token-sync.md — run direction B.
Figma file: [https://www.figma.com/design/YI7OSQaMjHEvf7KkU3OBsJ/Techcombank-Quang-Anh?node-id=0-1&t=QFyngNovcg5uWs4G-1]
TailwindCSS library: [https://www.figma.com/design/GKh419EgaedMrupXqJ63Ol/TailwindCSS-v4.2.4-Design-System--Community---Copy-]
Read src/app/globals.css and create matching Figma variables in the Design System file, aliasing from TailwindCSS library wherever possible.

Direction C:
Read @.claude/token-sync.md — run direction C.
Figma file: [https://www.figma.com/design/YI7OSQaMjHEvf7KkU3OBsJ/Techcombank-Quang-Anh?node-id=0-1&t=QFyngNovcg5uWs4G-1]
Audit: are my Figma variables and globals.css currently in sync?
