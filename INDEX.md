# INDEX — where to go for what

This file routes. It does not explain. Read `PROGRESS.md` first, find your task below,
open that file, then read that folder's `AGENTS.md`.

## I want to…

| I want to…                                            | Go to                                                                                         |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Change the site's color                               | `src/styles/global.css` → `--hue-brand`                                                       |
| Adjust a specific shade (borders, muted text, accent) | `src/styles/global.css` → `@theme` block                                                      |
| Change fonts                                          | `src/styles/global.css` → `--font-sans` / `--font-display` / `--font-mono`                    |
| Change the heading font's preload                     | `src/layouts/BaseLayout.astro`                                                                |
| Adjust shadows or corner radii                        | `src/styles/global.css` → `@theme` (`--shadow-*`, `--radius-*`)                               |
| Change the sidebar layout or where it splits          | `src/styles/global.css` → `.sidebar-layout`, `--breakpoint-split`                             |
| Change the wavy edge on card headers                  | `src/styles/global.css` → `.scallop`                                                          |
| Change how rendered Markdown looks                    | `src/styles/global.css` → `.prose`                                                            |
| Change the site name, bio (tagline), or handle        | `src/config/site.ts` → `site`, set via `PUBLIC_*` in `.env` / repo variables                  |
| Add or rename a nav tab, or change its icon           | `src/config/site.ts` → `nav`                                                                  |
| Add or remove a social link                           | `src/config/site.ts` → `socials`, and `.env.example`                                          |
| Change the contact form endpoint or key               | `src/config/site.ts` → `contactFormKey`, and `.env.example`                                   |
| Add a new environment variable                        | `src/config/site.ts` + `.env.example` + `.github/workflows/deploy.yml`                        |
| Add a build-behaviour env variable (not identity)     | `src/env.d.ts` + `.env.example` + the file that reads it                                      |
| Fix a link that 404s on GitHub Pages                  | `src/lib/paths.ts` → `href()`                                                                 |
| Change what shows when private content is missing     | `src/lib/content.ts` → `getPosts` / `getProjects`                                             |
| Turn private content on or off                        | `package.json` → `content:on` / `content:off`, or `.env` → `CONTENT_SOURCE`                   |
| Change what the on/off switch does                    | `src/lib/content.ts` → `forceSamples`, and `package.json` scripts                             |
| Change how drafts are hidden in prod                  | `src/lib/content.ts` → `visible()`                                                            |
| Change post or project sort order                     | `src/lib/content.ts` → `byNewest()`                                                           |
| Change what counts as Blog vs Writing                 | `src/lib/content.ts` → `getNews()` / `getResearch()` / `postPath()`                           |
| Move one post between Blog and Writing                | `kind:` in that post's frontmatter, in the private blog repo                                  |
| Change the reading-time estimate                      | `src/lib/content.ts` → `readingMinutes()`                                                     |
| Change how tag counts are computed                    | `src/lib/content.ts` → `getAllTags()`                                                         |
| Add a field to blog frontmatter                       | `src/content.config.ts` → `blogSchema`                                                        |
| Add a field to project frontmatter                    | `src/content.config.ts` → `projectSchema`                                                     |
| Point a collection at a different folder              | `src/content.config.ts` → `collections`                                                       |
| Edit or add placeholder content                       | `src/content/samples/blog/`, `src/content/samples/projects/`                                  |
| Change the header bar, nav tabs, or logo mark         | `src/components/Header.astro`                                                                 |
| Change the skip link                                  | `src/layouts/BaseLayout.astro`                                                                |
| Add or change an icon                                 | `src/components/icons.ts`, rendered by `src/components/Icon.astro`                            |
| Change the pill buttons                               | `src/components/PillLink.astro` (and the submit button in `src/components/ContactForm.astro`) |
| Change an index page's title block                    | `src/components/PageHeader.astro`                                                             |
| Change the home page's section headings               | `src/components/SectionHeading.astro`                                                         |
| Change the sidebar cards                              | `src/components/Card.astro`                                                                   |
| Change the profile card or the monogram               | `src/components/ProfileCard.astro`                                                            |
| Change the footer                                     | `src/components/Footer.astro`                                                                 |
| Change the project card layout                        | `src/components/ProjectCard.astro`                                                            |
| Change the full post entry (Writing, home)            | `src/components/PostCard.astro`                                                               |
| Change the post row (Blog archive, tag pages, home)   | `src/components/PostRow.astro`                                                                |
| Change how tags are rendered                          | `src/components/TagList.astro`                                                                |
| Change date formatting                                | `src/components/FormattedDate.astro`                                                          |
| Change the contact form fields or submit behaviour    | `src/components/ContactForm.astro`                                                            |
| Change `<head>`, meta tags, or page chrome            | `src/layouts/BaseLayout.astro`                                                                |
| Change the article wrapper for Markdown pages         | `src/layouts/ProseLayout.astro`                                                               |
| Change the post page (Blog and Writing alike)         | `src/layouts/PostLayout.astro`                                                                |
| Edit the landing page                                 | `src/pages/index.astro`                                                                       |
| Edit the projects grid page                           | `src/pages/projects/index.astro`                                                              |
| Edit a project detail page                            | `src/pages/projects/[slug].astro`                                                             |
| Edit the Writing index                                | `src/pages/writing/index.astro`                                                               |
| Change which posts get a Writing page                 | `src/pages/writing/[slug].astro`                                                              |
| Edit the Blog index                                   | `src/pages/blog/index.astro`                                                                  |
| Change which posts get a Blog page                    | `src/pages/blog/[slug].astro`                                                                 |
| Edit a tag page                                       | `src/pages/blog/tags/[tag].astro`                                                             |
| Edit the contact page                                 | `src/pages/contact.astro`                                                                     |
| Edit the 404 page                                     | `src/pages/404.astro`                                                                         |
| Change the RSS feed                                   | `src/pages/rss.xml.ts`                                                                        |
| Change the site URL or base path                      | `astro.config.mjs` + `.env.example`                                                           |
| Change deploy behaviour or submodule checkout         | `.github/workflows/deploy.yml`                                                                |
| Change how a content-repo push reaches the live site  | `.github/workflows/content-sync.yml`, and `README.md` → "Updating content"                    |
| Point the submodules at different private repos       | `.gitmodules`, then `README.md` → "Private content"                                           |
| Change what `npm run docs:check` enforces             | `scripts/check-docs.mjs`                                                                      |
| Add a favicon or static asset                         | `public/`                                                                                     |

## Directory map

| Folder               | What's in it                                                                                  | Open it when                                                  |
| -------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `src/config/`        | Every identity value and the nav list, read from env.                                         | Changing anything a human would call "settings".              |
| `src/lib/`           | Two helpers: base-path links, and the content resolver.                                       | Changing link behaviour, draft filtering, or sample fallback. |
| `src/styles/`        | One stylesheet: the hue system, depth, type scale, layout, prose rules.                       | Changing any color, shadow, spacing, or typography.           |
| `src/layouts/`       | Page shells. `BaseLayout` for everything, `ProseLayout` for articles, `PostLayout` for posts. | Changing `<head>`, meta tags, or article width.               |
| `src/components/`    | Presentational pieces and the icon set. No data fetching except the contact form.             | Changing how a card, tag, date, icon, or form looks.          |
| `src/pages/`         | Routes. One file per URL; dynamic routes use `getStaticPaths`.                                | Adding or editing a page.                                     |
| `src/content/`       | Submodule mounts (`blog/`, `projects/`) plus `samples/`.                                      | Editing placeholder content. Never the mounts.                |
| `scripts/`           | `scripts/check-docs.mjs` — validates this documentation system.                               | Changing what the docs rules enforce.                         |
| `public/`            | Files copied verbatim to the site root.                                                       | Adding a favicon or static asset.                             |
| `.github/workflows/` | Two workflows: build and deploy to Pages; sync the content pointers.                          | Changing CI, submodule checkout, env passthrough, or sync.    |

## Invariants

Break one of these and the build, the deploy, or the privacy guarantee breaks.

1. **Base path.** No `href="/..."` literals. Every internal link and asset URL goes
   through `href()` in `src/lib/paths.ts`. Links work in dev but 404 on Pages →
   `src/lib/paths.ts`.
2. **No personal data committed.** Identity values come from env via `src/config/site.ts`.
   `.env.example` holds placeholders only.
3. **Never commit into the submodule mounts.** `src/content/blog` and
   `src/content/projects` belong to the private repositories zhadtech/portfelis-blog and
   zhadtech/portfelis-projects. Write there, push there;
   `.github/workflows/content-sync.yml` moves the pointer here.
4. **The build must succeed with the mounts empty.** That is the state of a fresh clone.
5. **One hue.** Every color derives from `--hue-brand`. No literal colors elsewhere.
6. **Drafts are dev-only.** `draft: true` never reaches a production build.
7. **No JavaScript ships** beyond the contact form's submit handler.
8. **Docs stay in sync.** Add or rename a file → update that folder's `AGENTS.md`, then
   `INDEX.md` if routing changed, then run `npm run docs:check`.
