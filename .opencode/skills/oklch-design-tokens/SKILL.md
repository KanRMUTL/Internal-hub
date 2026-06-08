---
name: oklch-design-tokens
description: 'When building or modernizing a design system, author tokens in OKLCH (not hex, not rgb, not HSL). The rules: brand color earns one moment per surface, neutrals are tinted toward the brand hue at low chroma, body text hits 4.5:1+, no warm-by-default.'
---

# OKLCH Design Tokens

How to author a modern design system's color tokens in OKLCH. This is the specific knowledge for "Direction 7" (Modern × Minimal × Playful) and similar restrained, single-accent systems.

## Why OKLCH (and not hex/rgb/HSL)

- **Perceptual uniformity**: equal numerical changes produce equal perceived changes. `L 0.6` looks the same "amount lighter" regardless of hue.
- **Predictable contrast**: building a 12% darker version is `L 0.72 → L 0.60`, no guessing.
- **Tinted neutrals**: tinting a grey toward a brand hue is a single chroma parameter (`oklch(50% 0.012 180)`). With hex, you hand-pick each grey.
- **Wide gamut**: P3 displays can show colors that don't exist in sRGB; OKLCH specifies the full range.
- **Tool support**: every modern color picker (Figma, etc.) supports OKLCH.

## Browser Support

OKLCH is supported in all modern browsers (Chrome 111+, Firefox 113+, Safari 15.4+). No polyfill needed.

## The Token Schema

Every modern design system has this structure:

```ts
// src/shared/styles/config/colors.ts
export const colors: Color = {
  // Brand
  primary: 'oklch(72% 0.156 178)', // e.g. refined teal
  secondary: 'oklch(68% 0.13 230)', // complementary

  // Semantic
  info: 'oklch(68% 0.13 230)',
  success: 'oklch(70% 0.16 150)',
  warning: 'oklch(80% 0.16 80)',
  danger: 'oklch(62% 0.22 25)',

  // Base
  white: 'oklch(100% 0 0)',
  black: 'oklch(18% 0.012 180)',

  // Neutrals — tinted toward the brand teal hue at low chroma
  grey: {
    50: 'oklch(98.5% 0.004 180)',
    100: 'oklch(96.5% 0.006 180)',
    200: 'oklch(92% 0.008 180)',
    300: 'oklch(85% 0.01 180)',
    400: 'oklch(70% 0.01 180)',
    500: 'oklch(50% 0.012 180)',
    600: 'oklch(42% 0.012 180)',
    700: 'oklch(32% 0.012 180)',
    800: 'oklch(24% 0.012 180)',
    900: 'oklch(18% 0.012 180)',
  },

  // Interactive states — derived from primary
  hover: 'oklch(72% 0.156 178 / 0.08)',
  focus: 'oklch(72% 0.156 178 / 0.12)',
  focusRing: 'oklch(72% 0.156 178 / 0.45)',
  active: 'oklch(72% 0.156 178 / 0.18)',
  disabled: 'oklch(80% 0.005 180 / 0.5)',

  // Accessibility
  focusVisible: 'oklch(48% 0.18 178)', // darker for higher contrast
  skipLink: 'oklch(48% 0.18 230)',
}
```

## The 5 Rules

### Rule 1: Brand color earns one moment per surface

Don't wash the page in the brand color. Use it for:

- The primary action button
- The active/featured state
- The "now" indicator (live dot, "Now Spinning" badge)
- Focus rings
- That's it.

Everything else: neutrals.

### Rule 2: Neutrals are tinted toward the brand hue, not toward warm

The 4th argument to OKLCH is the hue. For a teal-led system, all neutrals are at hue ~180° (teal). This is what makes the palette feel "branded" without being loud.

```
oklch(50% 0.012 180)   ← teal-tinted neutral (the 4th is teal hue)
oklch(50% 0.012 0)     ← pure red-tinted neutral (warm)
oklch(50% 0.012 240)   ← blue-tinted neutral (cool)
```

Chroma should be LOW (0.004 to 0.012) for neutrals. Anything higher reads as "colored", not "neutral".

### Rule 3: Body text hits 4.5:1 contrast

WCAG AA requires:

- Body text (under 18px): 4.5:1 contrast
- Large text (18px+, or 14px+ bold): 3:1 contrast
- UI components: 3:1 contrast

For OKLCH, contrast is roughly: `(|L1 - L2| * (something proportional))`. In practice, the formulas are:

- Body on surface: L diff > 50 (e.g. L=20 on L=98.5 gives ~12:1)
- Muted on surface: L diff > 35 (e.g. L=50 on L=98.5 gives ~4.7:1)

Verify with a tool (WebAIM Contrast Checker, Stark, etc.) — don't eyeball OKLCH.

### Rule 4: Surface and bg are subtly different

- `bg.primary` (page background) — slightly off-white in light, near-black in dark
- `bg.surface` (cards, panels) — pure white in light, one step lighter than primary in dark
- `bg.elevated` (modals, popovers) — one step brighter than surface

The deltas should be SUBTLE (L diff of 0.5-2%). If surface is too white against a tinted bg, cards look pasted on. If too close to bg, cards disappear.

### Rule 5: Shadows are low-opacity neutrals, not black

```ts
// BAD — pure black shadow
shadow: {
  md: '0 4px 6px rgba(0, 0, 0, 0.1)'
}

// GOOD — neutral-tinted, low-opacity
shadow: {
  md: '0 2px 4px oklch(20% 0.01 180 / 0.05), 0 1px 2px oklch(20% 0.01 180 / 0.04)'
}
```

The shadow color matches the brand hue. Low opacity. Multi-layer (one for tight proximity, one for ambient).

## Light vs Dark Mode

The same OKLCH value can be used in both modes, but with different **inverted lightness**:

| Token        | Light                    | Dark                   |
| ------------ | ------------------------ | ---------------------- |
| `primary`    | `oklch(72% 0.156 178)`   | `oklch(78% 0.14 178)`  |
| `bg.primary` | `oklch(98.5% 0.004 180)` | `oklch(12% 0.008 180)` |
| `bg.surface` | `oklch(100% 0 0)`        | `oklch(16% 0.008 180)` |
| `text`       | `oklch(20% 0.012 180)`   | `oklch(95% 0.005 180)` |

The brand color shifts up in lightness for dark mode (compensates for the lower surround contrast). The neutral scale inverts.

## The Anti-AI-Slop Trap

The most common AI default is the "warm cream" body background. It's `oklch(98% 0.02 80)` or similar — a slightly warm off-white. The whole warm-neutral band (OKLCH L 0.84-0.97, C < 0.06, hue 40-100) reads as cream/sand/paper/parchment regardless of what you call it.

**Don't default-tint toward warm.** Either:

- Use a saturated brand color as the body (terracotta, oxblood, deep ochre, near-black)
- Use a true off-white at chroma 0
- Use a darker mid-tone tinted neutral that's clearly the brand's own

"Warmth" in the brand is carried by accent + typography + imagery, not by body bg.

## Border Radius Scale

Modest, restrained:

```ts
borderRadius: {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '12px',     // ← most card surface
  xl: '20px',     // ← hero containers
  full: '50%',
}
```

Don't go above 20px for cards. Bigger than that, the card looks like a balloon.

## Type Scale

Modest, fixed (no clamp — product UI doesn't need fluid type):

```ts
fontSizes: {
  xs: '10px',      // tabular data, version stamps
  caption: '12px', // metadata, labels
  sm: '14px',      // secondary information
  base: '16px',    // body
  lg: '20px',      // section heading
  xl: '24px',      // subsection
  xxl: '28px',     // large text
  '2xl': '32px',   // section header
  '3xl': '40px',   // display
}
```

`base` is body. Anything smaller than `caption` is reserved for tabular data.

## Motion Tokens

```ts
motion: {
  duration: {
    fast: '120ms',   // hover, focus
    medium: '180ms', // state changes
    slow: '250ms',   // modals, layout
  },
  easing: {
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',     // most common
    easeIn: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    easeInOut: 'cubic-bezier(0.165, 0.84, 0.44, 1)',   // expo-out-quart
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // use sparingly
  },
  reducedMotion: {
    duration: '0ms',
    easing: 'linear',
  },
}
```

`prefers-reduced-motion` is non-negotiable. Every animated property has a no-motion fallback.

## The File Structure

```
src/shared/styles/config/
├── colors.ts      ← the Color interface + values
├── light.ts       ← light theme (extends Color)
├── dark.ts        ← dark theme (extends Color)
├── borderRadius.ts
├── borderWidth.ts
├── breakpoints.ts
├── fontSizes.ts
├── fontWeight.ts
├── motion.ts
├── spacing.ts
└── index.ts       ← barrel
```

The `Color` interface is the contract:

```ts
export interface Color {
  primary: string
  secondary: string
  info: string
  success: string
  warning: string
  danger: string
  white: string
  black: string
  grey: { 50; 100; 200; 300; 400; 500; 600; 700; 800; 900 }
  hover: string
  focus: string
  focusRing: string
  active: string
  disabled: string
  focusVisible: string
  skipLink: string
}
```

Both light and dark themes must satisfy this interface. Switching modes is a single theme swap — no other code changes.

## How to Migrate an Existing Token System

1. **Audit existing colors.** List every hex/rgb value used. Group by role (primary, success, grey-100, etc.).
2. **Convert each to OKLCH.** Use a tool (colorjs.io, oklch.com, Figma's color picker) to get the perceptual equivalent.
3. **Re-tint neutrals.** Adjust the hue to your brand's hue (e.g. 180° for teal). Adjust chroma to 0.004-0.012.
4. **Verify contrast.** Check body/muted/disabled against bg.
5. **Set up light + dark themes.** Same Color interface, different values.
6. **Test in production.** Visual regression + dark mode parity.
7. **Remove the old hex tokens.** Don't keep them as fallbacks — they fragment the design.

## The Self-Test: Is This OKLCH Done Right?

Run these checks:

- [ ] Body text on bg.primary hits 4.5:1+
- [ ] Brand color (primary) appears at most once per surface
- [ ] Neutrals have hue matching the brand (not pure 0° or 240°)
- [ ] Neutrals have chroma ≤ 0.012
- [ ] Light mode bg.primary is NOT warm-tinted (no cream/sand)
- [ ] Dark mode text is bright enough to read (≥ 90% L)
- [ ] Shadows are low-opacity neutrals, not pure black
- [ ] Border radius max ≤ 20px for cards
- [ ] Motion has a `prefers-reduced-motion` fallback

If all 9 pass, the system is ready.

## Related Skills

- `design-direction-explorer` — picks the aesthetic family first
- `preview-route-builder` — the safe way to experiment with new tokens
- `design-integration-strategy` — how to ship the new tokens to production
