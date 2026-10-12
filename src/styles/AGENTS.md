# src/styles — the whole visual system, in one file

| File         | What it does                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `global.css` | Imports Tailwind v4 and the Outfit display face, defines `--hue-brand` (the one knob), derives the entire palette, both shadows and both radii from it in OKLCH inside `@theme`, sets the type scale, the three widths and the `split` breakpoint, adds base element styles, and hand-writes three component classes: `.sidebar-layout`, `.scallop`, and the `.prose` rules for rendered Markdown. |

## The knob

```css
:root {
  --hue-brand: 256;
}
```

Every color on the site is `oklch(<lightness> <chroma> var(--hue-brand))`. Change that
one number and the whole palette moves together — try `30` (amber), `150` (green), `280`
(violet). OKLCH is used because lightness stays perceptually even as the hue rotates, so
the relationships between surfaces, text and accent survive the change.

Neutrals are not grey: they carry chroma 0.002–0.03 of the brand hue. That is what stops
the page looking assembled from parts.

## The tokens

| Group      | Names                                                                 | Used for                                                                   |
| ---------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Neutrals   | `page`, `surface`, `line`, `muted`, `body`, `ink`                     | Backgrounds, hairlines, text from quietest to loudest.                     |
| Accent     | `accent`, `accent-strong`, `accent-deep`, `accent-wash`               | Tiles and badges; the header bar, titles and links; text on tints; washes. |
| Tints      | `tint`, `tint-soft`                                                   | The profile card and rules; pills, card heads and section rules.           |
| On accent  | `on-accent`, `on-accent-muted`                                        | Text on an accent fill — the header bar, badges, tiles.                    |
| Depth      | `shadow-card`, `shadow-pill`, `rounded-card`, `rounded-chip`          | The complete set. Pills use `rounded-full`.                                |
| Type       | `font-sans` (body, system stack), `font-display` (headings, Outfit)   | Base styles put every `h1`–`h6` in `font-display`.                         |
| Widths     | `max-w-shell`, `max-w-measure`, `max-w-sidebar` (via `--container-*`) | The page; 68ch of reading text; the sidebar column.                        |
| Breakpoint | `split:` (56rem)                                                      | Where `.sidebar-layout` puts the sidebar beside the main column.           |

Every text-on-background pairing in use clears WCAG AA (4.5:1). If you move a lightness
value, re-check the pairs in the table above — `muted` on `surface` is the tightest.

## Rules

- **No literal colors anywhere else in the repo.** Use the token names above.
  (`public/favicon.svg` is the one documented exception — a static file cannot read a
  custom property.)
- **The root is 17px** (`html { font-size: 106.25% }`), so `1rem` is 17px and the whole
  type scale, spacing and widths scale with it. It is a percentage, so a reader's own font
  size setting still applies. Media queries are unaffected — they measure rem against the
  browser default.
- One type scale, ratio 1.2, anchored at 1rem. Line height and letter spacing are baked
  into each step, so components never set them ad hoc. Don't use `text-xs` for body copy;
  it is for labels, badges and metadata.
- Depth comes from the two shadows and two radii defined here, and only those. No other
  shadow, no gradients as decoration. (`.scallop` uses a radial gradient as a _mask_; it
  draws nothing itself.)
- Motion only on interactive affordances, at `duration-150`: color changes, the logo's
  small tilt, an arrow nudging right. The `prefers-reduced-motion` block in `@layer base`
  neutralises all of it for anyone who asks.
- Focus rings are load-bearing. Never remove the `:focus-visible` outline. On an accent
  fill, switch its color with `focus-visible:outline-on-accent` (see `Header.astro`).

## The component classes

- **`.sidebar-layout`** — a grid with three areas. Children take `.lead`, `.main` and
  `.side`. Below `split` they stack lead → main → side; from `split` up, main is the left
  column and lead sits above side on the right. The home page uses lead for the profile
  card, so a phone opens on the introduction.
- **`.scallop`** — the wavy bottom edge on a card header (`Card.astro`). Put it on an
  element with a background; the edge inherits it.

## Don't

- Don't add `tailwind.config.js`. Tailwind v4 is configured here, in CSS.
- Don't install `@tailwindcss/typography`. `.prose` is hand-written because the rules
  below it are the complete set of things our Markdown can produce.
- Don't add a second web font. Body text stays on the system stack on purpose: it costs
  no request, and only headings carry the brand. `--font-display` is the single swap
  point for the heading face; its preload lives in `BaseLayout.astro`.
- Don't reintroduce a dark mode piecemeal. Light only is a recorded decision; see
  `PROGRESS.md`.
