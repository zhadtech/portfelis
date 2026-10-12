# src/layouts — page shells

| File                | What it does                                                                                                                                                                                                                                                                                                                                                           |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BaseLayout.astro`  | The document. Takes `title` and `description`; composes the title as `<title> · <site name>` (home uses the site name alone), emits the canonical link, favicon, a preload for the heading font's Latin file, and RSS autodiscovery, then renders the skip link, `Header`, `<main id="main">`, and `Footer`. Also renders the placeholder-content notice, in dev only. |
| `ProseLayout.astro` | `BaseLayout` plus the centred article column used by posts and project detail pages. Three slots: `header` (centred title and metadata, above a dotted rule), the default slot (rendered Markdown, inside `.prose`), and an optional `footer` — whose rule only appears if something fills the slot.                                                                   |
| `PostLayout.astro`  | `ProseLayout` filled in for one post: draft marker, title, description, date and reading time, tags, the rendered body, and a pill back to the section index. Takes `post` and `back`. Shared by `blog/[slug]` and `writing/[slug]`, so the two sections cannot drift apart.                                                                                           |

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
  gated on `import.meta.env.DEV`. (`PostLayout` calls `render()` on the entry it is
  handed; that renders, it does not query a collection.)
- Don't drop the font preload in `BaseLayout`. It imports the same file the stylesheet
  references, so Vite emits one asset under one hashed URL; without it, titles render in
  the fallback face and then reflow.
