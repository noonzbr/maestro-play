# Web Design: A PhD-Level Knowledge Base

**Purpose:** This document serves as both the knowledge corpus for a Claude-powered design critic agent and the intellectual foundation for MaestroPlay's web design educational module. It is written for deployment in an AI system prompt and for use as reference material in scenario-based learning. Every principle here is teachable, measurable, and critiqueable.

---

## 1. Visual Hierarchy

Visual hierarchy is the intentional organization of elements so the eye moves through them in a designer-determined order. It is the first law of communication design: if everything is equally important, nothing is important.

### The Gestalt Principles

The Gestalt school of psychology (1920s Germany) identified perceptual laws that describe how humans group and interpret visual information:

- **Proximity**: Elements close together are perceived as a group. When items are 8px apart versus 24px apart, the tighter cluster reads as one unit. Navigation menus exploit this constantly.
- **Similarity**: Elements that share visual properties (color, shape, size, texture) are perceived as related. This is how zebra-striped table rows work — alternating background colors create two perceptual sets.
- **Continuity**: The eye follows smooth paths, curves, and implied lines even when they are interrupted. Alignment along an axis creates a perceived flow.
- **Closure**: The mind completes incomplete shapes. Circular progress indicators, speech bubbles, and icons with negative space gaps all rely on closure.
- **Figure-Ground**: One element is perceived as the subject (figure) and everything else as background (ground). Modal overlays exploit this by dimming the ground to force the figure into focus.
- **Common Fate**: Elements moving in the same direction are perceived as a group. Relevant in animation and microinteractions.
- **Symmetry**: Symmetrical arrangements are perceived as stable and complete. Asymmetry creates tension and energy.

### The 7 Elements of Visual Weight

Visual weight describes how much a given element attracts the eye. These seven attributes each contribute to it:

1. **Size**: Larger elements have more visual weight. A 48px heading outweighs a 16px paragraph unconditionally.
2. **Color**: Warm, saturated, high-contrast colors carry more weight than cool, desaturated, low-contrast ones. A red button on a white page dominates.
3. **Contrast**: The ratio between an element and its background. High contrast (black on white) pulls the eye; low contrast recedes.
4. **Position**: Upper-left receives the most attention in left-to-right reading cultures (F-pattern). Bottom-right receives the least. Position above the fold carries inherent weight.
5. **Whitespace**: Isolating an element with whitespace paradoxically increases its weight by creating separation. Apple product pages are the canonical example.
6. **Texture**: Textured surfaces appear heavier than flat ones. Gradients read as heavier than solid fills.
7. **Shape**: Irregular, complex, or novel shapes attract more attention than familiar, simple ones. An unfamiliar icon takes longer to parse and thus holds the eye longer.

### Eye-Movement Patterns

**F-Pattern (Jakob Nielsen, 2006)**: In content-heavy pages (articles, search results, product listings), users read horizontally across the top, then down the left edge, with decreasing horizontal exploration. The result looks like the letter F. Implication: the most critical information belongs in the first two paragraphs and on the left margin.

**Z-Pattern**: On pages with sparse text and dominant visuals (landing pages, ads), the eye moves from top-left to top-right (horizontal scan), diagonally to bottom-left, then across to bottom-right. The terminal point — bottom-right — is where calls-to-action land in conversion-optimized designs.

**Layer-Cake Pattern**: In content with clear headings, users scan the headings (horizontal bands) while ignoring the body text between them. This is why heading hierarchy matters more than paragraph quality for scannability.

### Common Mistakes

- Giving every element equal size and weight (no hierarchy at all)
- Using bold, italic, underline, and color simultaneously on the same text
- Centering all text on a multi-paragraph page (destroys left-edge alignment that guides the eye down)
- Forgetting that whitespace is an active tool, not an accident of empty space

---

## 2. Typography

Typography is not decoration. It is the primary mechanism of meaning transmission on the web. Poor typography is not just ugly — it is cognitively expensive.

### The Modular Type Scale

A type scale is a geometric sequence of font sizes created by multiplying a base size by a consistent ratio. The ratios in common use:

| Ratio | Name | Use Case |
|-------|------|----------|
| 1.067 | Minor Second | Dense UI, data-heavy interfaces |
| 1.125 | Major Second | Small screens, compact UIs |
| 1.250 | Major Third | Standard web content |
| 1.333 | Perfect Fourth | Editorial, blog, reading-heavy |
| 1.414 | Augmented Fourth | High contrast typographic hierarchy |
| 1.500 | Perfect Fifth | Display-heavy landing pages |
| 1.618 | Golden Ratio | Dramatic editorial, marketing |

Starting from a 16px base with a 1.333 ratio: 16, 21, 28, 37, 50, 67px. These sizes feel harmonically related because they are — the same way a musical scale feels unified.

### Body Text Rules

- **Minimum size**: 16px on screen. 14px is readable but cognitively fatiguing at scale. Never go below 14px for body copy. Mobile body text should be 16-18px.
- **Line height**: 1.5 to 1.7 × the font size for body text. A 16px font needs 24-27px of line height. Tighter than 1.4 is cramped; looser than 1.9 is disconnected.
- **Line length (measure)**: 45-75 characters per line for optimal readability. The sweet spot is 65-66 characters. Under 45 characters causes too many line breaks that interrupt reading rhythm. Over 75 characters causes the eye to lose its return path to the next line.
- **Paragraph spacing**: Should be 0.75–1× the line height. Not zero (walls of text), not excessive (loses the sense of connected paragraphs).

### Display Text Rules

Display type (headings above ~32px) operates differently:
- **Tracking (letter-spacing)**: Display text benefits from slightly tighter letter-spacing (-0.01em to -0.03em). Body text should remain at 0em or very slightly positive.
- **Line height**: Tighter for display — 1.1 to 1.3. A 64px heading with 1.6 line height looks like a list, not a headline.
- **Weight contrast**: Display and body typefaces should differ in weight by at least 200 on the weight scale (e.g., 700 heading, 400 body).

### Font Pairing

The rule is **maximum 2 typefaces per design**. Three is a very rare exception with clear rationale. Four is always wrong.

Principles of pairing:
- **Contrast in personality, harmony in proportion**: A geometric sans-serif (Futura, Geist) with a humanist serif (Georgia, Lora) works because they feel different but share proportional DNA.
- **Same family, different weight/style**: The safest pairing — a variable font used in two weights. No risk of discord.
- **Avoid pairing similar typefaces**: Two humanist sans-serifs (e.g., Gill Sans + Frutiger) look like a mistake, not a choice.

### Web Font Performance

- **System fonts**: Zero network cost. The system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`) loads instantly and feels native. Best choice for apps where speed > brand expression.
- **Google Fonts**: Hosted on Google's CDN, free, but each font file is a network request. A typical Google Fonts request adds 100-300ms on a cold cache. Mitigate with `<link rel="preconnect" href="https://fonts.googleapis.com">`.
- **Variable fonts**: One file contains the entire family across weight, width, and other axes. A variable font replacing 4 static weights typically reduces file size by 30-50% while enabling fine-grained typographic control via CSS `font-variation-settings`.
- **Self-hosted**: Best performance control. Use `font-display: swap` to prevent invisible text during loading (FOIT — Flash of Invisible Text), accepting a brief flash of fallback font (FOUT — Flash of Unstyled Text) instead.

### Readability vs. Legibility

**Legibility** is whether individual characters can be distinguished at a glance — a property of the typeface itself. Highly legible typefaces have clear differentiation between similar characters (I, l, 1; O, 0; rn vs m).

**Readability** is whether text can be read comfortably over extended time — a property of how type is used (size, spacing, contrast, line length, color). A highly legible typeface can have poor readability if set at 11px with 1.2 line height in light gray on white.

### OpenType Features

Modern fonts include optional typographic features accessible via CSS `font-feature-settings` or `font-variant-*` properties:
- `liga` — Standard ligatures (fi, fl combinations). On by default in most browsers.
- `onum` — Old-style numerals (lowercase-style numbers that sit on the baseline). Better for running text.
- `tnum` — Tabular numerals (fixed-width numbers). Essential in data tables for alignment.
- `smcp` — Small caps. Proper small caps, not shrunken capitals.
- `frac` — Diagonal fractions (1/2 instead of 1/2).

### Common Mistakes

- Using a 14px body font because it "looks cleaner" (it costs users cognitive effort)
- Setting line-height at exactly 1.0 or 1 (lines touch or overlap on descenders)
- Pairing two fonts that are too similar (looks like an error, not a choice)
- Using `font-weight: bold` on already-bold display type (creates no hierarchy)
- Forgetting to set `font-display: swap` on custom web fonts

---

## 3. Color Theory

Color is never neutral. Every color choice makes a claim about meaning, mood, and relationship.

### The HSL Color Model

HSL (Hue, Saturation, Lightness) is the designer's mental model for color:
- **Hue**: The pure color, expressed as a degree on the color wheel (0° = red, 120° = green, 240° = blue, 360° = red again).
- **Saturation**: The intensity of the color. 100% is fully saturated (vivid). 0% is gray.
- **Lightness**: The brightness. 0% is black, 100% is white, 50% is the "pure" hue.

HSL is superior to hex or RGB for design work because adjustments are intuitive: to make a color lighter, increase L; to make it less vivid, decrease S.

### The 60-30-10 Rule

The fundamental color proportion rule for UI and interior design:
- **60%**: Dominant color (backgrounds, large surfaces). Usually neutral or very desaturated.
- **30%**: Secondary color (cards, sidebars, supporting elements). Creates visual variety.
- **10%**: Accent color (CTAs, interactive elements, emphasis). High saturation, high contrast.

Breaking this rule is how you create visual noise. Using an accent color at 40% dilutes its ability to draw attention.

### Color Harmonies

- **Complementary**: Two colors opposite on the wheel (e.g., blue + orange). Maximum contrast, vibrating energy when placed adjacent. Useful for CTAs against background.
- **Analogous**: Three colors adjacent on the wheel (e.g., blue, blue-green, green). Harmonious and natural. Common in nature-inspired or calm designs.
- **Triadic**: Three colors equidistant on the wheel (e.g., red, blue, yellow). Vibrant but balanced. Requires one to dominate.
- **Split-complementary**: A base color plus the two colors adjacent to its complement. Less tension than complementary, more interest than analogous.
- **Tetradic (Rectangle)**: Four colors forming two complementary pairs. Richest palette, hardest to balance. One color must clearly dominate.

### Color Psychology

These are culturally modulated, not universal. Western-centric defaults:
- **Red**: Urgency, danger, passion, appetite. Used in error states, sales banners, food brands.
- **Blue**: Trust, stability, calm, professionalism. Dominant in finance, healthcare, tech.
- **Green**: Growth, nature, permission, success. Used in success states, sustainability, finance.
- **Yellow**: Optimism, caution, attention. High visibility but fatiguing at large areas.
- **Orange**: Energy, friendliness, affordability. Used in conversion-optimized CTAs (Amazon, Duolingo).
- **Purple**: Luxury, creativity, mystery. Premium brands, creative tools.
- **Black**: Sophistication, authority, luxury. Premium positioning.
- **White**: Cleanliness, simplicity, space. Dominant in minimalist design.

**Cultural variation**: White means mourning in many East Asian cultures. Green has religious significance in Islam. Red means luck in China, danger in Western contexts. A global product must conduct color research per target market.

### WCAG 2.1 Contrast Requirements

The Web Content Accessibility Guidelines define minimum contrast ratios using the relative luminance formula:

- **Normal text (below 18pt / 14pt bold)**: 4.5:1 contrast ratio required for AA compliance.
- **Large text (18pt+ / 14pt+ bold)**: 3:1 contrast ratio required for AA compliance.
- **UI components and graphical objects**: 3:1 against adjacent colors for AA compliance (Success Criterion 1.4.11).
- **AAA enhanced**: 7:1 for normal text, 4.5:1 for large text.

Contrast ratio is calculated as (L1 + 0.05) / (L2 + 0.05) where L1 is the lighter luminance and L2 is the darker. A ratio of 1:1 is identical colors; 21:1 is black on white.

Common failures: light gray text on white (#999 on #fff is 2.85:1, fails AA), blue links on blue backgrounds, yellow text on white backgrounds.

### Color Blindness

- **Deuteranopia** (red-green, missing green): Most common, affecting approximately 6% of males and 0.4% of females. Cannot distinguish red from green.
- **Protanopia** (red-green, missing red): ~1% of males.
- **Tritanopia** (blue-yellow): Rare, ~0.001% of population.
- Total: approximately 8% of males and 0.5% of females have some form of color vision deficiency.

Testing tools: Figma's accessibility plugins, Chrome DevTools (Rendering tab > Emulate Vision Deficiencies), Stark plugin, color-blindness simulators like Coblis.

**The fundamental rule**: Never use color as the only means of conveying information. A red error state must also have an error icon and error text. A green success must have a checkmark. A form with required fields marked only in red fails WCAG 1.4.1.

### Common Mistakes

- Using pure #000000 black and #ffffff white (too harsh; use near-blacks like #1a1a1a and near-whites like #f8f8f8)
- Relying on color alone to communicate error/success/warning states
- Choosing an accent color that fails contrast against both light and dark backgrounds
- Building a palette from the "Primary / Secondary / Accent" mental model without testing it in context

---

## 4. Layout & Grid Systems

A grid is a system of invisible lines that give a layout its structure. Without a grid, designs feel arbitrary. With a grid, even simple designs feel considered.

### The 12-Column Grid

The 12-column grid is dominant in web design because 12 is divisible by 1, 2, 3, 4, 6, and 12 — giving maximum layout flexibility. Components can span 1 col (8.3%), 2 cols (16.6%), 3 cols (25%), 4 cols (33.3%), 6 cols (50%), or 12 cols (100%).

**Anatomy of a grid:**
- **Columns**: The vertical divisions. Typically 12 on desktop, 8 on tablet, 4 on mobile.
- **Gutters**: The space between columns. Standard values: 16px (mobile), 24px (tablet), 32px (desktop).
- **Margins**: The space between the grid and the viewport edge. Standard: 16px (mobile), 32px (tablet), auto (desktop, creating a max-width container).
- **Column width**: ((container width) - (gutters × 11) - (margins × 2)) / 12.

### The 8pt / 4pt Grid

Every spacing value in the design is a multiple of 8px. This creates visual rhythm and makes designer-developer handoff unambiguous. The scale: 4, 8, 16, 24, 32, 40, 48, 64, 80, 96, 128px. (4pt is used when 8pt increments feel too coarse for dense UIs.)

Benefits: Aligns with most device pixel ratios (mdpi: 1×, hdpi: 1.5×, xhdpi: 2×), creates a consistent rhythm, and eliminates the "is this 14px or 15px?" debates in design review.

### CSS Grid vs. Flexbox

These are complementary tools, not alternatives:

| Decision | Use CSS Grid | Use Flexbox |
|----------|-------------|-------------|
| Layout dimension | Two-dimensional (rows + columns) | One-dimensional (row OR column) |
| Component type | Page-level layouts, card grids | Nav bars, button groups, single rows |
| Content-first vs. layout-first | Layout-first (grid defines spaces) | Content-first (content defines sizes) |
| Gap control | `gap` property, explicit | `gap` property, flexible |
| Browser support | Excellent (all modern) | Excellent (all modern) |

### Golden Ratio and Rule of Thirds

**Golden ratio (φ = 1.618)**: A proportion where the ratio of the whole to the larger part equals the ratio of the larger part to the smaller. Used to size containers, sidebar widths, image proportions, and type scale ratios. A layout with a main column at 61.8% and a sidebar at 38.2% follows golden ratio proportions.

**Rule of thirds**: Divide a composition into a 3×3 grid. Focal points placed at the four intersections (the "power points") are more dynamic than centered compositions. Applied to hero images, photography crops, and content placement.

### Alignment Types

- **Left alignment**: Default for body text in LTR languages. Creates a strong left edge for the eye to follow down the page.
- **Center alignment**: Appropriate for short text (headlines, captions, button labels), invitations, and ceremonial layouts. Destroys readability in body copy because the ragged left edge gives the eye no anchor.
- **Right alignment**: Use sparingly, for supporting text aligned to a right-heavy layout element (e.g., numbers in a table, captions for left-bleed images).
- **Justified**: Creates uniform edges on both sides. Can create "rivers" of whitespace running vertically through paragraphs. Use only with proper hyphenation; avoid in narrow columns.

### Common Mistakes

- Ignoring the grid for "just this one element" (once broken, the system breaks)
- Using spacing values not in the 8pt system (e.g., 13px, 22px, 37px)
- Applying CSS Grid when Flexbox is simpler and more appropriate
- Centering multi-paragraph body text

---

## 5. Spacing & Whitespace

Whitespace is not empty. It is the oxygen of a layout. Removing it suffocates the design.

### The 8pt Spacing Scale

4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.

The scale is not linear — it is progressive. Small values for tight intra-component spacing, large values for inter-component and section spacing. Using only values from this scale ensures proportional consistency.

### Intra-Component vs. Inter-Component Spacing

**Intra-component** (spacing within a component): Padding inside a button (8px-16px vertical, 16px-24px horizontal). Gap between icon and label (8px). Spacing between form label and input field (4-8px). These are tight values — 4, 8, 12, 16px.

**Inter-component** (spacing between components): The gap between a card and the next card (16-24px). The margin between a section heading and its content (24-32px). The space between two page sections (64-96px). These are generous values — 24, 32, 48, 64, 96, 128px.

A common mistake is using the same spacing value at every level, making the layout feel flat and undifferentiated.

### The Law of Proximity (Applied to Spacing)

Elements belong to the group they are closest to. A label that is 12px above an input and 24px below the previous element clearly belongs to that input. If the spacing is equal in both directions (12px above, 12px below), the label appears to float, unowned.

Rule: The spacing between elements in the same group should be **half or less** the spacing between different groups.

### Breathing Room Psychology

Dense layouts communicate urgency, volume, and overwhelm (Amazon product pages, news sites). Spacious layouts communicate calm, quality, and focus (Apple, luxury fashion, editorial). Neither is inherently better — the choice must align with brand intent and user task.

The mistake is unintentional density: a designer who wanted to feel premium but packed elements too tightly, accidentally communicating stress.

### Padding Rules

- Padding should be consistent on opposite axes. A card with 24px top/bottom and 16px left/right is a deliberate choice (wider than tall). A card with 24px top, 18px bottom, 16px left, 22px right is a mistake.
- Buttons: Vertical padding should be roughly half the horizontal padding for the standard "pill feel." A 12px × 24px button padding ratio reads as natural. Equal padding on all sides makes buttons feel square and heavy.

### Common Mistakes

- Adding `margin: 0 auto` everywhere instead of intentional spacing
- Using spacing values outside the 8pt scale (aesthetically arbitrary)
- Equal spacing between groups that should be clearly separated
- Removing whitespace to "fit more content" (trading comprehension for density)

---

## 6. Accessibility (WCAG 2.1)

Accessibility is not a feature. It is a quality dimension. A design that excludes users with disabilities is an incomplete design.

### The Three Levels

- **Level A** (minimum): Removing absolute barriers. Violations make content inaccessible to some users entirely.
- **Level AA** (standard target): The legal threshold in most jurisdictions (ADA, EN 301 549, AODA). The expected baseline for all public-facing websites.
- **Level AAA** (enhanced): Best-effort aspirational standard. Not required to achieve for entire sites.

### Key Success Criteria

**1.1.1 Non-text Content (A)**: Every image, icon, chart, and media element must have a text alternative. `alt=""` is correct for decorative images. `alt="Chart showing Q3 revenue of $2.4M, up 18% YoY"` is correct for informative charts.

**1.3.1 Info and Relationships (A)**: Structure conveyed visually must be conveyed in code. A bold heading that visually acts like an H2 must be an `<h2>` element, not a styled `<p>`. A data table with row headers must use `<th scope="row">`.

**1.4.3 Contrast (AA)**: 4.5:1 for normal text, 3:1 for large text. Tested with tools like WebAIM Contrast Checker or axe DevTools.

**1.4.11 Non-text Contrast (AA)**: UI components (button borders, form input borders, focus indicators) and informational graphics must have 3:1 contrast against adjacent colors. A light gray form field border on white background typically fails this.

**2.1.1 Keyboard (A)**: All functionality available via mouse must be available via keyboard alone. Dropdown menus, modals, date pickers, custom components — all must be keyboard-operable.

**2.4.3 Focus Order (A)**: The keyboard focus order must follow a logical reading order. Tab → Tab → Tab should traverse the page in a sequence that makes semantic sense.

**2.4.7 Focus Visible (AA)**: The keyboard focus indicator must be visible. `outline: none` on all focusable elements is a common and serious failure.

**3.3.2 Labels or Instructions (A)**: Every form field must have a visible, persistent label. Placeholder text is not a label — it disappears when the user starts typing.

**4.1.2 Name, Role, Value (A)**: Custom UI components must expose their name, role, and state to assistive technology. A custom toggle built from a `<div>` must have `role="switch"`, `aria-checked`, and an accessible name.

### ARIA Landmark Roles

Semantic HTML elements provide most landmarks automatically:
- `<header>` → `role="banner"`
- `<nav>` → `role="navigation"`
- `<main>` → `role="main"`
- `<aside>` → `role="complementary"`
- `<footer>` → `role="contentinfo"`
- `<form>` → `role="form"` (when labeled)
- `<section aria-labelledby="...">` → `role="region"`

Screen reader users (VoiceOver, NVDA, JAWS) navigate by landmarks as their primary navigation method on unfamiliar pages. A page with no landmark structure is a labyrinth.

### Screen Reader Behavior

Screen readers linearize the DOM. Visual layout is irrelevant. A visually two-column layout reads as the source-order sequence of elements. This means:
- Decorative images need `alt=""` so they are skipped entirely
- Off-screen content (mobile menus, hidden tabs) can still be read if not properly hidden with `display:none`, `visibility:hidden`, or `aria-hidden="true"`
- Dynamic content updates need `aria-live` regions to announce changes

### Common Mistakes

- `outline: none` on focus states (destroys keyboard navigation)
- Using `<div>` and `<span>` for interactive elements (not keyboard-accessible by default)
- Placeholder text as label substitute
- Color-only error indication
- Auto-playing media with no pause control
- Missing `lang` attribute on `<html>` element (screen readers use the wrong voice/pronunciation)

---

## 7. Responsive Design & Mobile-First

In 2024, approximately 63% of global web traffic originates from mobile devices. Designing desktop-first and then "fixing for mobile" produces inferior mobile experiences and forces compromises at both ends.

### Mobile-First Methodology

Write CSS for the smallest screen first, then use `min-width` media queries to add complexity for larger screens. This forces priority decisions: what is essential? What can wait until there is more space?

```css
/* Mobile first: base styles */
.nav { display: none; }

/* Tablet and above */
@media (min-width: 768px) {
  .nav { display: flex; }
}
```

Desktop-first inverts this, using `max-width` queries to remove complexity, which is cognitively harder and produces more code.

### Standard Breakpoints

These are common reference points, not rigid rules. Design for content, not for specific device models:
- **320px**: Small phones (iPhone SE, older Android). The minimum viable mobile viewport.
- **375-430px**: Modern phones (iPhone 14/15, Pixel 7/8 range).
- **768px**: Tablets in portrait (iPad, 10" Android tablets).
- **1024px**: Tablets in landscape, small laptops.
- **1280px**: Standard laptop screens.
- **1440px**: Large desktop monitors, the standard design canvas.
- **1920px**: Wide monitors, where max-width containers become important.

### Fluid Typography with clamp()

`clamp(minimum, preferred, maximum)` creates fluid sizing that scales between a minimum and maximum based on viewport width:

```css
font-size: clamp(1rem, 2.5vw, 2rem);
```

This eliminates the need for separate typography rules at each breakpoint. The `preferred` value is typically a viewport unit (`vw`) expression.

### Touch Target Sizes

- **Apple HIG**: Minimum touch target 44×44 points (pixels on 1× displays).
- **WCAG 2.5.5 (AAA)**: Minimum 44×44 CSS pixels.
- **WCAG 2.5.8 (AA, WCAG 2.2)**: Minimum 24×24 CSS pixels target size, or adequate spacing.
- **Google Material Design**: Minimum 48×48dp.

A 16px icon link with no padding has a touch target of 16×16px — roughly one-tenth the minimum recommended area. On mobile, this is a guaranteed misclick source.

### Viewport Units and CSS Logical Properties

- `100dvh` (dynamic viewport height) instead of `100vh` — accounts for the address bar on mobile browsers, which collapses and expands.
- **CSS logical properties** (`margin-inline-start` instead of `margin-left`, `padding-block-end` instead of `padding-bottom`) are direction-agnostic, supporting RTL languages (Arabic, Hebrew, Persian) without extra CSS overrides.

### Container Queries

CSS Container Queries (`@container`) allow components to respond to the size of their container, not the viewport. A card component that must work both in a sidebar (narrow) and a main content area (wide) can adapt based on its container — something viewport media queries cannot express. Container queries represent the future of component-level responsive design.

### Common Mistakes

- Designing at 1440px first and "making it responsive" at the end
- Touch targets under 44px on interactive elements
- Using `100vh` on mobile (causes layout shift when address bar scrolls away)
- Treating breakpoints as mandatory (content should dictate breakpoints)
- Ignoring landscape orientation on mobile

---

## 8. Core Web Vitals & Performance

Performance is a design problem. Slow pages have higher bounce rates, lower conversion rates, and lower search rankings. Google uses Core Web Vitals as ranking signals.

### The Three Core Web Vitals

**Largest Contentful Paint (LCP)**: Measures loading performance. Marks the point when the largest content element in the viewport (hero image, large heading, video poster) has finished rendering.
- Good: < 2.5 seconds
- Needs improvement: 2.5 – 4.0 seconds
- Poor: > 4.0 seconds

**Interaction to Next Paint (INP)**: Replaced First Input Delay (FID) in March 2024. Measures responsiveness — the latency from user interaction to the next visual update. Assesses all interactions during a page visit.
- Good: < 200ms
- Needs improvement: 200 – 500ms
- Poor: > 500ms

**Cumulative Layout Shift (CLS)**: Measures visual stability. Quantifies how much page elements shift unexpectedly during loading (when an image loads and pushes content down, or an ad injects above existing content).
- Good: < 0.1
- Needs improvement: 0.1 – 0.25
- Poor: > 0.25

### Causes and Fixes

**LCP Causes and Fixes:**
- Slow server response → use CDN, optimize TTFB
- Unoptimized hero images → convert to WebP/AVIF, compress, use `<img fetchpriority="high">`
- Render-blocking resources → defer non-critical JS, preload critical fonts
- Slow fonts → use `font-display: swap`, preconnect to font CDN

**CLS Causes and Fixes:**
- Images without dimensions → always set `width` and `height` attributes on `<img>` (or use `aspect-ratio` in CSS)
- Dynamically injected content above existing content → reserve space with min-height
- Web fonts causing FOUT text reflow → use `font-display: optional` for text that reflows significantly, or use `size-adjust` to match fallback metrics

**INP Causes and Fixes:**
- Large JavaScript bundles blocking the main thread → code-split, defer non-critical scripts
- Heavy event handlers → debounce input events, move work to Web Workers
- Forced synchronous layouts → avoid reading layout properties (offsetHeight, scrollTop) immediately after DOM mutations

### Image Optimization

- **WebP**: 25-35% smaller than JPEG/PNG at equivalent quality. Near-universal browser support.
- **AVIF**: 20-50% smaller than WebP. Growing browser support (Chrome, Firefox, Safari 16+).
- **Lazy loading**: `<img loading="lazy">` defers off-screen image loads. Never use on above-the-fold images — they need to load immediately.
- **srcset**: Serves different image sizes based on device pixel ratio and viewport: `<img srcset="img-320.webp 320w, img-640.webp 640w" sizes="(max-width: 600px) 320px, 640px">`.
- **Responsive images as a CLS fix**: `aspect-ratio: 16/9` on an image container prevents layout shift before the image loads.

### The 3G/4G Test

Always test Core Web Vitals on simulated 3G (Chrome DevTools → Network → Slow 3G) before shipping. A design that performs well on a development machine's gigabit connection will fail for 30-40% of global users. Pages over 3MB total page weight are a design failure, not just a technical one.

### Common Mistakes

- Using hero images without explicit dimensions (guaranteed CLS)
- `loading="lazy"` on the LCP image (delays the most important image)
- Not using WebP/AVIF (50% page weight savings left on the table)
- JavaScript animations that cause style recalculations (use `transform` and `opacity` only — they run on the compositor thread)

---

## 9. UX Principles & Laws

These are empirically supported principles from cognitive psychology, human factors research, and HCI. They are not opinions.

### Fitts's Law

The time required to move to a target is a function of the distance to the target and its size: `T = a + b × log₂(1 + D/W)`. Practically: make interactive targets large and close to where the user's cursor or finger already is.

Implications:
- Screen edges and corners have effectively infinite width (the cursor cannot overshoot them), making them ideal for frequently-used targets. The Apple Dock and Windows Start button exploit this.
- The minimum viable button width is not a subjective aesthetic choice — it is a measurable performance factor.
- Dropdown menus that require precise cursor movement to submenus violate Fitts's Law (the "diagonal of death" problem, solved by cursor movement triangles in Amazon's navigation).

### Hick's Law

Decision time increases logarithmically with the number of choices: `T = b × log₂(n + 1)`. More options = slower decisions.

Implications:
- Navigation should have 5-7 primary items, not 12.
- Onboarding flows that present all features simultaneously cause decision paralysis.
- Progressive disclosure — revealing complexity incrementally as users demonstrate need — is Hick's Law applied to UI design.

### Miller's Law

Working memory can hold approximately 7 ± 2 chunks of information simultaneously (George Miller, 1956). Updated research suggests 4 ± 1 is more accurate for unrelated items.

Implication: Chunking information (grouping related items, using visual separators, breaking long forms into steps) reduces cognitive load by treating multiple items as a single chunk.

### Jakob's Law

Users spend most of their time on other websites. They expect your site to work the way those other sites work. (Jakob Nielsen, 2000.)

Implication: Innovation in interaction patterns carries a learning tax. Using a hamburger menu icon is not "generic" — it is respecting a convention that users have already learned. Inventing a new navigation metaphor requires overwhelming evidence that users will understand it without instruction.

### Aesthetic-Usability Effect

Users perceive aesthetically pleasing designs as more usable, even when they are not. Beautiful interfaces receive more patience, more forgiveness, and higher satisfaction ratings — regardless of actual task completion time.

This cuts both ways: it means good aesthetics improve user trust, and it means users will underreport usability problems on beautiful but broken designs.

### Peak-End Rule

People judge an experience primarily by how they felt at the most intense moment (peak) and at the end, rather than by the average of every moment. A payment flow that is tedious throughout but ends with a delightful order confirmation animation scores higher than one that was smooth throughout but ended on a cold "Transaction Complete" screen.

Design implication: Invest disproportionately in peak moments (first-use delight, success states, error recovery) and ending moments (completion screens, farewell experiences).

### The Fold Myth

"Below the fold" (the point requiring scroll) is not a death zone. Users scroll — extensively — if the page gives them a reason to. The myth that nothing below the fold gets seen leads to cramped above-fold designs. Studies consistently show that users who engage with content above the fold scroll 80%+ of the time.

The actual rule: create a reason to scroll. A hero section that looks like a complete, closed unit will not be scrolled. One that implies more content invites scrolling.

### Error Prevention vs. Error Recovery

The best error message is one that never appears. Design systems should prevent errors through:
- Constraints (disabling the submit button until required fields are complete)
- Defaults (pre-filling known values)
- Clear affordances (form field labels that explain what format is expected)

When errors must be shown, they must be: immediate (not on submit), specific (not "invalid input"), localized (shown next to the field, not in a banner), and instructive (explaining how to fix the error).

### Common Mistakes

- Navigation with 12+ items (Hick's Law violation)
- Icon-only buttons with no label (violates affordance clarity)
- Inventing novel interaction patterns that require instructions
- Showing all features to new users immediately (overwhelming working memory)
- Error messages that blame the user ("You entered an invalid value")

---

## 10. Design Systems & Tokens

A design system is not a component library. It is a shared language. It answers the question: "How do we make decisions together, at scale, without chaos?"

### Atomic Design (Brad Frost, 2013)

Five levels of abstraction, from smallest to largest:
1. **Atoms**: The smallest indivisible UI units — a button, a text input, a color swatch, a typographic style. They have no context.
2. **Molecules**: Combinations of atoms that form a functional unit — a search bar (input + button), a form field (label + input + error text).
3. **Organisms**: Complex components assembled from molecules and atoms — a navigation bar (logo atom + nav links molecule + CTA button atom), a product card (image + text molecule + price atom + CTA atom).
4. **Templates**: Page-level component arrangements without real content. They define structure and layout.
5. **Pages**: Templates filled with real content. The deliverable.

### Design Tokens

Design tokens are the named variables that store the raw values of a design system: colors, spacing, typography, border radius, shadow, animation duration. They are the single source of truth.

```json
{
  "color.brand.primary": "#3B82F6",
  "color.feedback.error": "#EF4444",
  "spacing.scale.04": "16px",
  "typography.body.size": "1rem",
  "border.radius.md": "8px"
}
```

Tokens are consumed by design tools (Figma variables) and code (CSS custom properties, JS constants) from the same source. When the brand primary color changes from `#3B82F6` to `#2563EB`, it changes in one place and propagates everywhere.

**Token taxonomy**: Primitive tokens (raw values) → Semantic tokens (role-based, e.g., `color.action.default` references `color.brand.primary`) → Component tokens (component-specific, e.g., `button.background.default` references `color.action.default`). This indirection allows component behavior to change with semantic meaning, not just value changes.

### Component API Design

A well-designed component API:
- Has the fewest necessary props (not "just in case" props)
- Uses composition over configuration for structural variations
- Has clear, consistent prop naming conventions
- Documents every prop with type, default, and usage note
- Follows a predictable pattern across all components (if `variant` means "visual style" in one component, it means that in all components)

### Design-Dev Handoff Best Practices

- Design tokens are in both Figma and code, named identically
- Components in Figma match components in code — same names, same props/variants
- Spacing is documented in the 8pt system so developers don't have to measure
- Interactive states (hover, focus, active, disabled, loading, error) are designed for every component before handoff
- Motion and animation specs include duration, easing curve, and trigger

### When to Build vs. Buy

Build a design system when: team is > 5 engineers, multiple products share brand language, tech debt from inconsistency is measurable, or company has dedicated design/engineering capacity to maintain it.

Buy (or adopt an open system like Radix, shadcn/ui, Chakra) when: team is small, speed matters more than brand differentiation, or the system can be customized to brand specifications.

The worst outcome: building a bespoke system with no resources to maintain it, resulting in a "component library" that diverges from both design and code within six months.

### Common Mistakes

- Creating a component library without design tokens (components cannot be themed)
- Building organisms before atoms are stable (garbage in, garbage out)
- Treating the design system as the design team's job alone (must be cross-functional)
- Versioning design system updates without a migration guide

---

## 11. AI Design Tools — Expert Assessment

AI is the fastest-growing category in design tooling. It is also the most overhyped. An expert's assessment requires clear-eyed evaluation of what each tool actually does, not what its marketing claims.

### Figma AI

**What it does**: Generates component variants from a selection, auto-renames layers using AI interpretation, suggests auto-layout applications, can rewrite text content, and generates prototype connections.

**Strengths**: Dramatically accelerates exploration of component variations. Layer renaming fixes a chronic problem in design handoff. Auto-layout suggestions reduce manual layout work. Most useful for experienced designers who know what they want and use AI to execute faster.

**Weaknesses**: The generated output is competent but generic — it produces the median expectation, not the optimal solution. It has no design reasoning: it cannot tell you *why* a particular component variant is better. It cannot audit your work for accessibility, hierarchy, or spacing consistency. Output requires expert review on every use.

### v0.dev by Vercel

**What it does**: Generates React components (with Tailwind CSS and shadcn/ui) from text prompts and screenshots. Produces production-ready code, not mockups.

**Strengths**: The gap between prompt and production code is genuinely small. Components are accessible (shadcn/ui has strong a11y defaults), responsive, and professionally structured. Excellent for rapid prototyping and for translating design concepts into code.

**Weaknesses**: Strong aesthetic sameness across outputs — everything looks like the same shadcn/ui template. Produces components that work, but requires a designer's eye to make them feel distinctive. Cannot make strategic decisions about what to build.

### Framer AI

**What it does**: Generates complete, published websites from text prompts. Includes real interactions, CMS, and hosting.

**Strengths**: The fastest path from "I need a landing page" to "there is a real URL I can share." The interaction model (real CSS transitions, scroll effects, CMS) is production-quality. Useful for rapid MVP validation and stakeholder communication.

**Weaknesses**: Heavily locked into the Framer ecosystem. Custom code integration is possible but complex. The aesthetic ceiling is lower than a custom-built design. Not appropriate for complex web applications or designs that require deep customization.

### GitHub Copilot for CSS

**What it does**: Autocompletes CSS properties, generates style rules from comments, completes component styling patterns.

**Strengths**: Eliminates boilerplate — generates flex centering patterns, responsive utilities, animation keyframes. Knows common CSS patterns and can produce them on demand.

**Weaknesses**: Has absolutely no visual judgment. Cannot tell you whether the color you are writing passes contrast requirements. Will happily autocomplete `color: #aaa` on a white background. Produces no accessibility warnings. Requires the developer to supply all design judgment.

### Midjourney for Design Concepts

**What it does**: Generates photorealistic or illustrated images from text prompts. Used by designers to explore visual directions.

**Strengths**: Exceptional for mood board creation, stakeholder alignment on visual direction, and concept exploration before committing to production assets. Can generate scenes, product mockups, and hero imagery at a concept level faster than any traditional method.

**Weaknesses**: Output is never a production asset — it requires redrawing, photography direction, or illustration based on the concept. Typography in Midjourney output is notoriously unreliable (text is generated pixel by pixel, not as real letterforms). Image rights and training data provenance remain contested.

### The Fundamental Truth

Every AI design tool generates options. No AI design tool makes decisions. The irreplaceable human contribution is the ability to say: "This is right because it creates a clear hierarchy and the contrast passes WCAG AA" or "This is wrong because the line length at 120 characters destroys readability." AI output without human expert judgment is noise that looks like signal.

The designer who fears AI replacement is the one who produces output without reasoning. The designer who thrives is the one who can critique AI output faster and more rigorously than anyone else.

### Common Mistakes with AI Tools

- Shipping AI-generated UI without accessibility audit
- Using AI tools to avoid developing design judgment (using them to bypass learning rather than to accelerate skilled work)
- Treating prompt engineering as a substitute for design research
- Accepting the first AI output without iteration

---

## 12. Design Critique Framework

Critique is the professional mechanism for improving design quality. Bad critique destroys design culture. Good critique accelerates it.

### The Four-Stage Critique Method

1. **Describe**: State what you literally observe, without interpretation. "The heading is set in a bold sans-serif, centered, in a large point size. Below it is a subheading in the same weight, smaller. Below that is body text in a lighter weight." This stage requires no judgment — only observation. Its purpose is to ensure both parties are looking at the same thing.

2. **Interpret**: State what the design communicates, based on what you observed. "The centered layout feels formal and stable. The weight hierarchy suggests the heading is the primary entry point. The color palette reads as corporate and conservative."

3. **Evaluate**: Apply design principles and goals to assess whether the design succeeds. "The line length at approximately 100 characters per line exceeds the 75-character maximum for readability. The contrast ratio of the body text appears to be around 3.2:1, which does not meet WCAG AA. The center-aligned body text will create fatigue on mobile."

4. **Theorize**: Propose directions for improvement, framed as hypotheses rather than mandates. "Shifting to left-aligned body text and a 650px max-width for the content column would improve readability. Increasing the text color saturation would likely resolve the contrast issue."

### The 6-Dimension Critique Rubric

| Dimension | What to Assess |
|-----------|---------------|
| **Hierarchy** | Can I identify the primary, secondary, and tertiary elements without guessing? Does size, weight, and color create a clear reading order? |
| **Readability** | Is the font size adequate? Are line height and line length within optimal ranges? Is text legible against its background? |
| **Color** | Does the palette follow a coherent system? Do all text/background combinations meet WCAG contrast requirements? Is color used as the only differentiator anywhere? |
| **Spacing** | Does spacing feel intentional and consistent? Are spacings from the 8pt system? Is there clear distinction between intra- and inter-component spacing? |
| **Accessibility** | Are touch targets adequate? Is there a visible focus state? Are form fields labeled? Are interactive elements keyboard-operable? |
| **Intent Alignment** | Does the design achieve its stated goal? Does it match the intended brand voice? Would the target user understand what to do next? |

### How to Receive Critique

The fundamental cognitive practice: separate your identity from your work. The critique is about the artifact, not about you as a person or as a designer. When this feels difficult, use the question: "What problem are you observing that you believe this change would solve?" This moves the conversation from "I don't like it" to "I notice it causes this problem."

Critique is information. The professional with the highest critique tolerance accelerates fastest.

### Red Flags in Bad Critique

These phrases indicate that the critic is substituting personal preference for design reasoning. They are not actionable and should be gently interrogated:

- **"Make it pop"**: This means nothing. Ask: "What do you want the user to notice first? What specific element feels insufficiently prominent?"
- **"More modern"**: This means nothing. Ask: "Which specific elements feel dated to you? Are you thinking of a particular reference site?"
- **"Make it look like Apple"**: This is a direction, not a critique. Ask: "What qualities of Apple's design aesthetic are most relevant to our brand? Minimal whitespace? System typography? Restrained color?"
- **"I just don't like it"**: Valid as a personal reaction, but not critique. Ask: "Which specific element is creating that reaction?"
- **"It needs more energy"**: Ask: "What user task is this screen serving? What would 'energy' look like in a way that serves that task?"

### Structured Critique in Practice

For a design critic agent or review process, the structured output format should be:

1. A brief description of what the design appears to be and its apparent goal
2. Scores or qualitative assessments across each of the 6 rubric dimensions
3. Specific issues, each linked to a principle or criterion (not preference)
4. Specific, testable improvement suggestions for each issue
5. A summary of what the design does well (critique is not exclusively negative)

### Common Mistakes

- Critique that uses "I feel" instead of "I observe" (makes critique subjective and unresolvable)
- Critique that identifies problems without proposing directions
- Critique culture that makes designers defensive (violates psychological safety)
- No critique at all (the most dangerous design culture)

---

## Design Critic Checklist

A 30-point checklist across all 6 critique dimensions. Use this as the evaluation framework for any design artifact.

### Hierarchy (5 points)
- [ ] **H1** — I can identify the primary focal point within 3 seconds without searching.
- [ ] **H2** — There are at least 3 clearly distinguishable visual weight levels (primary, secondary, tertiary).
- [ ] **H3** — The reading order follows the natural eye path (F-pattern or Z-pattern, as appropriate).
- [ ] **H4** — No two elements that should be different feel equal in visual weight.
- [ ] **H5** — The call to action is the highest-weight interactive element on the screen.

### Readability (5 points)
- [ ] **R1** — Body text is at least 16px on desktop, 16-18px on mobile.
- [ ] **R2** — Line height is between 1.5 and 1.7 for body text.
- [ ] **R3** — Line length (measure) is between 45 and 75 characters.
- [ ] **R4** — No more than 2 typefaces are used.
- [ ] **R5** — Display text has tighter line height (1.1–1.3) and appropriate tracking.

### Color (5 points)
- [ ] **C1** — All body text meets WCAG AA contrast ratio (4.5:1 minimum).
- [ ] **C2** — All large text meets WCAG AA contrast ratio (3:1 minimum).
- [ ] **C3** — All UI components (button borders, input borders, icons) meet 3:1 against adjacent colors.
- [ ] **C4** — Color is never the only means of conveying information (error states, status indicators, required fields).
- [ ] **C5** — The color palette follows the 60-30-10 distribution principle.

### Spacing (5 points)
- [ ] **S1** — All spacing values are multiples of 4 or 8px.
- [ ] **S2** — Intra-component spacing is clearly tighter than inter-component spacing.
- [ ] **S3** — Elements belonging to the same group are closer to each other than to adjacent groups.
- [ ] **S4** — Padding inside components is consistent on opposite axes.
- [ ] **S5** — Sections have adequate breathing room (minimum 48px between distinct page sections).

### Accessibility (5 points)
- [ ] **A1** — All interactive elements have visible focus states (not `outline: none`).
- [ ] **A2** — All touch targets are at least 44×44px.
- [ ] **A3** — All form fields have visible, persistent labels (not just placeholders).
- [ ] **A4** — All images have appropriate alt text (descriptive for informative, empty for decorative).
- [ ] **A5** — All custom interactive components (toggles, accordions, dropdowns) have ARIA roles and states.

### Intent Alignment (5 points)
- [ ] **I1** — The primary user task on this screen is obvious — a user could complete it without instruction.
- [ ] **I2** — The visual language matches the intended brand personality (not generic, not inconsistent).
- [ ] **I3** — Error states, empty states, and loading states are designed (not afterthoughts).
- [ ] **I4** — The design is tested at mobile viewport (375px) and does not break.
- [ ] **I5** — The design achieves its stated goal without requiring the user to read instructions to understand it.

---

## The Expert's Lens

Ten principles that synthesize all twelve domains into a unified design philosophy. These are not rules — they are lenses through which experts perceive design problems.

### 1. Clarity Is the First Obligation

A design that is aesthetically extraordinary but communicationally ambiguous has failed. The expert asks: "What is this screen telling the user to do? Can they answer that in 3 seconds?" Clarity precedes beauty. When forced to choose, choose clarity.

### 2. Every Decision Is a Claim

There is no neutral choice in design. A 14px body font is a claim: "legibility is less important than aesthetics." #999 gray text on white is a claim: "some users cannot read this, and I accept that." Using `outline: none` is a claim: "keyboard users do not matter here." The expert makes conscious claims, not accidental ones.

### 3. Constraints Are Liberating

The 8pt grid, the WCAG contrast ratios, the 45-75 character measure, the 44px touch target — these constraints are not limitations on creativity. They are the rules of a game that produces better outcomes. Picasso mastered representation before Cubism. The designer who understands and respects constraints produces better work than the designer who ignores them in the name of freedom.

### 4. The User's Context Is Not Yours

You are designing on a high-res 27" monitor with a fiber connection in a quiet room. Your user is on a 5-year-old Android phone, on 4G LTE at 60% signal, in a noisy environment, with one hand. The expert designs for the actual context of use, not the ideal context of creation. Test on slow connections. Test on small screens. Test with a keyboard. Test with a screen reader.

### 5. Visual Hierarchy Is Logical Hierarchy

Every visual distinction should correspond to a meaningful distinction in content or function. Size, weight, color, and position should map to importance, not to decorative whim. A bold label next to a normal label should mean "this is more important." If it doesn't, the bold is a lie.

### 6. Systems Beat Styles

A beautiful one-off screen is a style. A system of tokens, components, and patterns that produces beautiful screens consistently is design at scale. The expert invests in systems. The amateur invests in individual executions. Systems compound; styles decay.

### 7. Accessibility Is Not a Compliance Exercise

It is an empathy exercise. The 4.5:1 contrast ratio exists because a specific percentage of humans cannot read lower-contrast text. The 44px touch target exists because a specific percentage of users have motor impairments. When the expert designs accessibly, they are designing for real human beings, not checking legal compliance boxes.

### 8. Performance Is a Design Decision

Choosing a 600KB hero image is a design decision. Choosing four decorative web fonts is a design decision. Choosing a JavaScript-heavy animation library is a design decision. Each of these decisions has a measurable effect on the experience of users with slow connections — and that population is larger and more economically important than most designers assume. The expert considers performance as a first-class design constraint.

### 9. AI Generates Quantity; Humans Determine Quality

The expert relationship with AI tools is: let AI produce options at speed, apply human judgment to select, critique, and refine. AI cannot tell you whether a design achieves its goal. It cannot evaluate whether the hierarchy is clear or the color is accessible. It cannot understand the user's context or the brand's intent. The expert's irreplaceable contribution is judgment — the ability to evaluate options against criteria that matter.

### 10. Critique Is How Design Gets Better

The expert actively seeks critique, not validation. They can hear "this fails the contrast check" as useful information, not personal attack. They can give critique that is specific, principled, and constructive — not vague preferences dressed up as expertise. The expert knows that "make it pop" is not feedback. "The primary CTA button has a 2.8:1 contrast ratio and is 36px tall on mobile — both fail accessibility standards and likely reduce conversion" is feedback. The expert generates the second kind and transforms the first kind into the second by asking the right questions.

---

*This document is a living reference. Every principle here is traceable to empirical research, established standards (WCAG, Core Web Vitals, Gestalt psychology), or industry consensus accumulated over decades of practice. The design critic agent powered by this corpus should cite principles by name, cite specific numbers and ratios, and always distinguish between "this fails a standard" and "this is a matter of preference."*
