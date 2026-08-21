# INDEX — where to go for what

This file routes. It does not explain. Read `PROGRESS.md` first, find your task below,
open that file, then read that folder's `AGENTS.md`.

## I want to…

| I want to…                                            | Go to                                                                       |
| ----------------------------------------------------- | --------------------------------------------------------------------------- |
| Change the site's color                               | `src/styles/global.css` → `--hue-brand`                                     |
| Adjust a specific shade (borders, muted text, accent) | `src/styles/global.css` → `@theme` block                                    |
| Change fonts                                          | `src/styles/global.css` → `--font-sans` / `--font-mono`                     |
| Change how rendered Markdown looks                    | `src/styles/global.css` → `.prose`                                          |
| Change the site name, tagline, or handle              | `src/config/site.ts` → `site`                                               |
| Add or rename a nav tab                               | `src/config/site.ts` → `nav`                                                |
| Add or remove a social link                           | `src/config/site.ts` → `socials`, and `.env.example`                        |
| Change the contact form endpoint or key               | `src/config/site.ts` → `contactFormKey`, and `.env.example`                 |
| Add a new environment variable                        | `src/config/site.ts` + `.env.example` + `.github/workflows/deploy.yml`      |
| Add a build-behaviour env variable (not identity)     | `src/env.d.ts` + `.env.example` + the file that reads it                    |
| Fix a link that 404s on GitHub Pages                  | `src/lib/paths.ts` → `href()`                                               |
| Change what shows when private content is missing     | `src/lib/content.ts` → `getPosts` / `getProjects`                           |
| Turn private content on or off                        | `package.json` → `content:on` / `content:off`, or `.env` → `CONTENT_SOURCE` |
| Change what the on/off switch does                    | `src/lib/content.ts` → `forceSamples`, and `package.json` scripts           |
| Change how drafts are hidden in prod                  | `src/lib/content.ts` → `visible()`                                          |
| Change post or project sort order                     | `src/lib/content.ts` → `byNewest()`                                         |
| Change how tag counts are computed                    | `src/lib/content.ts` → `getAllTags()`                                       |
| Add a field to blog frontmatter                       | `src/content.config.ts` → `blogSchema`                                      |
| Add a field to project frontmatter                    | `src/content.config.ts` → `projectSchema`                                   |
| Point a collection at a different folder              | `src/content.config.ts` → `collections`                                     |
| Edit or add placeholder content                       | `src/content/samples/blog/`, `src/content/samples/projects/`                |
| Change the header, nav, or skip link                  | `src/components/Header.astro`                                               |
| Change the footer                                     | `src/components/Footer.astro`                                               |
| Change the project card layout                        | `src/components/ProjectCard.astro`                                          |
| Change the post row layout on the blog index          | `src/components/PostCard.astro`                                             |
| Change how tags are rendered                          | `src/components/TagList.astro`                                              |
| Change date formatting                                | `src/components/FormattedDate.astro`                                        |
| Change the contact form fields or submit behaviour    | `src/components/ContactForm.astro`                                          |
| Change `<head>`, meta tags, or page chrome            | `src/layouts/BaseLayout.astro`                                              |
| Change the article wrapper for Markdown pages         | `src/layouts/ProseLayout.astro`                                             |
| Edit the landing page                                 | `src/pages/index.astro`                                                     |
| Edit the projects grid page                           | `src/pages/projects/index.astro`                                            |
| Edit a project detail page                            | `src/pages/projects/[slug].astro`                                           |
| Edit the blog index                                   | `src/pages/blog/index.astro`                                                |
| Edit a blog post page                                 | `src/pages/blog/[slug].astro`                                               |
| Edit a tag page                                       | `src/pages/blog/tags/[tag].astro`                                           |
| Edit the contact page                                 | `src/pages/contact.astro`                                                   |
| Edit the 404 page                                     | `src/pages/404.astro`                                                       |
| Change the RSS feed                                   | `src/pages/rss.xml.ts`                                                      |
| Change the site URL or base path                      | `astro.config.mjs` + `.env.example`                                         |
| Change deploy behaviour or submodule checkout         | `.github/workflows/deploy.yml`                                              |
| Point the submodules at different private repos       | `.gitmodules`, then `README.md` → "Private content"                         |
| Change what `npm run docs:check` enforces             | `scripts/check-docs.mjs`                                                    |
| Add a favicon or static asset                         | `public/`                                                                   |

## Directory map

| Folder               | What's in it                                                          | Open it when                                                  |
| -------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------- |
| `src/config/`        | Every identity value and the nav list, read from env.                 | Changing anything a human would call "settings".              |
| `src/lib/`           | Two helpers: base-path links, and the content resolver.               | Changing link behaviour, draft filtering, or sample fallback. |
| `src/styles/`        | One stylesheet: the hue system, type scale, prose rules.              | Changing any color, spacing, or typography.                   |
| `src/layouts/`       | Page shells. `BaseLayout` for everything, `ProseLayout` for articles. | Changing `<head>`, meta tags, or article width.               |
| `src/components/`    | Presentational pieces. No data fetching except the contact form.      | Changing how a card, tag, date, or form looks.                |
| `src/pages/`         | Routes. One file per URL; dynamic routes use `getStaticPaths`.        | Adding or editing a page.                                     |
| `src/content/`       | Submodule mounts (`blog/`, `projects/`) plus `samples/`.              | Editing placeholder content. Never the mounts.                |
| `scripts/`           | `scripts/check-docs.mjs` — validates this documentation system.       | Changing what the docs rules enforce.                         |
| `public/`            | Files copied verbatim to the site root.                               | Adding a favicon or static asset.                             |
| `.github/workflows/` | One workflow: build and deploy to Pages.                              | Changing CI, submodule checkout, or env passthrough.          |

## Invariants

Break one of these and the build, the deploy, or the privacy guarantee breaks.

1. **Base path.** No `href="/..."` literals. Every internal link and asset URL goes
   through `href()` in `src/lib/paths.ts`. Links work in dev but 404 on Pages →
   `src/lib/paths.ts`.
2. **No personal data committed.** Identity values come from env via `src/config/site.ts`.
   `.env.example` holds placeholders only.
3. **Never commit into the submodule mounts.** `src/content/blog` and
   `src/content/projects` belong to the private repositories zhadtech/portfelis-blog and
   zhadtech/portfelis-projects. Write there, push there, then move the pointer here.
4. **The build must succeed with the mounts empty.** That is the state of a fresh clone.
5. **One hue.** Every color derives from `--hue-brand`. No literal colors elsewhere.
6. **Drafts are dev-only.** `draft: true` never reaches a production build.
7. **No JavaScript ships** beyond the contact form's submit handler.
8. **Docs stay in sync.** Add or rename a file → update that folder's `AGENTS.md`, then
   `INDEX.md` if routing changed, then run `npm run docs:check`.
