# src/layouts — page shells

| File                | What it does                                                                                                                                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `BaseLayout.astro`  | The document. Takes `title` and `description`; composes the title as `<title> · <site name>` (home uses the site name alone), emits the canonical link, favicon and RSS autodiscovery, then renders the skip link, `Header`, `<main id="main">`, and `Footer`. Also renders the placeholder-content notice, in dev only. |
| `ProseLayout.astro` | `BaseLayout` plus the article wrapper used by blog posts and project detail pages. Three slots: `header` (title and metadata, above a hairline rule), the default slot (rendered Markdown, inside `.prose`), and an optional `footer` — whose rule only appears if something fills the slot.                             |

## Rules

- `title` is the page's own title. This layout appends the site name; a page that does it
  too gets it twice.
- `description` is required, on every page, because it is baseline correctness rather
  than an SEO feature.
- The skip link must stay the first focusable element in the body, and `<main>` must keep
  `id="main"` for it to target.
- Both layouts assume `href()` for every URL they emit, including the favicon.

## Adding social preview cards or a sitemap later

Deliberately out of scope, and each is a small addition here:

- **Open Graph / Twitter cards**: add optional `image` and `type` props to
  `BaseLayout.astro`, then emit `og:title`, `og:description`, `og:url`, `og:image` and
  `twitter:card` in the head. Absolute URLs — build them from `Astro.site`, not `href()`.
- **`sitemap.xml`**: `npx astro add sitemap`, which needs `site` set (it already is).
  The integration handles the base path itself.

## Don't

- Don't add a dark mode toggle. The site is light-only by decision; see `PROGRESS.md`.
- Don't put data fetching in a layout. `usingSamples()` is the one exception and it is
  gated on `import.meta.env.DEV`.
