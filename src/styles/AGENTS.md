# src/styles — the whole visual system, in one file

| File         | What it does                                                                                                                                                                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `global.css` | Imports Tailwind v4, defines `--hue-brand` (the one knob), derives the entire palette from it in OKLCH inside `@theme`, sets the type scale and the two layout widths, adds base element styles (focus ring, reduced motion, text wrapping, tabular numerals), and hand-writes the `.prose` rules for rendered Markdown. |

## The knob

```css
:root {
  --hue-brand: 212;
}
```

Every color on the site is `oklch(<lightness> <chroma> var(--hue-brand))`. Change that
one number and the whole palette moves together — try `30` (amber), `150` (green), `280`
(violet). OKLCH is used because lightness stays perceptually even as the hue rotates, so
the relationships between surfaces, text and accent survive the change.

Neutrals are not grey: they carry chroma 0.002–0.024 of the brand hue. That is what stops
the page looking assembled from parts.

## Rules

- **No literal colors anywhere else in the repo.** Use the theme names: `page`,
  `surface`, `line`, `muted`, `body`, `ink`, `accent`, `accent-strong`, `accent-wash`.
  (`public/favicon.svg` is the one documented exception — a static file cannot read a
  custom property.)
- One type scale, ratio 1.2, anchored at 1rem. Line height and letter spacing are baked
  into each step, so components never set them ad hoc. Don't use `text-xs` for body copy.
- Two widths only: `max-w-shell` (the page) and `max-w-measure` (68ch of reading text).
- Structure comes from whitespace and hairline `border-line` rules. No shadows, no
  gradients, no decorative radii.
- Motion only on interactive affordances: `transition-colors duration-150`. The
  `prefers-reduced-motion` block in `@layer base` neutralises it for anyone who asks.
- Focus rings are load-bearing. Never remove the `:focus-visible` outline.

## Don't

- Don't add `tailwind.config.js`. Tailwind v4 is configured here, in CSS.
- Don't install `@tailwindcss/typography`. `.prose` is hand-written because the rules
  below it are the complete set of things our Markdown can produce.
- Don't add a web font without a reason. `--font-sans` and `--font-mono` are the single
  swap point if one is ever justified; the default costs zero requests.
