# src/pages — the routes

One file per URL. This table covers the whole route tree, including the nested folders.

**Why the underscore in this file's name.** Astro publishes any `.md` under `src/pages`
as a page — a plain `AGENTS.md` here ships to the live site as `/AGENTS`. The `_` prefix
is Astro's own "not a route" marker. This folder is the only place the documentation file
is spelled `_AGENTS.md`; `npm run docs:check` accepts either name.

| File                    | What it does                                                                                                                                                                                                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.astro`           | Home, in `.sidebar-layout`. Main column, strongest material first: up to three projects (featured first), up to three Writing pieces, then the four newest Blog posts as compact rows — each section only when it has entries. Sidebar: `ProfileCard` (the page's `h1`) and a Links card. |
| `contact.astro`         | Contact. `ContactForm` when a form key is configured; an Elsewhere card with the social links beside it. The lead line never mentions configuration — that is for the owner, not a visitor. Adds a dev-only hint about `PUBLIC_CONTACT_FORM_KEY`.                                         |
| `404.astro`             | Not-found page. One pill per `nav` entry; Home is the first of them.                                                                                                                                                                                                                      |
| `rss.xml.ts`            | The feed. `GET` returns `@astrojs/rss` output from `getPosts()` — Blog and Writing together — linking each item through `postPath()`, with the base path folded into the channel link so items resolve under the project subpath.                                                         |
| `projects/index.astro`  | The project list, featured first then newest, at reading width.                                                                                                                                                                                                                           |
| `projects/[slug].astro` | One project. `getStaticPaths` maps every entry from `getProjects()`; renders a centred header (letter tile, title, date, tech badges, link pills), an optional optimised `cover` image, and the Markdown body in `ProseLayout`.                                                           |
| `writing/index.astro`   | Writing: curated long-form, from `getResearch()`, as full `PostCard` entries with tags. Has its own empty state pointing at the Blog.                                                                                                                                                     |
| `writing/[slug].astro`  | One Writing piece, from `getResearch()`, in `PostLayout`.                                                                                                                                                                                                                                 |
| `blog/index.astro`      | Blog: everything that is not research, from `getNews()`, grouped by year as `PostRow`s, with a Topics card of all tags beside it.                                                                                                                                                         |
| `blog/[slug].astro`     | One Blog post, from `getNews()`, in `PostLayout`.                                                                                                                                                                                                                                         |
| `blog/tags/[tag].astro` | Posts for one tag, from both sections — rows say when a post is from Writing. `getStaticPaths` comes from `getAllTags()`, so a tag page exists only when a visible post carries it.                                                                                                       |

## Rules

- Pages fetch data **only** through `src/lib/content.ts`. Draft filtering, sample
  fallback and sort order are settled there; repeating them here is how they drift.
- Every `getStaticPaths` slug is the bare entry id. Astro adds the base path — including
  it here produces `/portfelis/portfelis/...`.
- **Content files must stay flat.** Entry ids come from the file path, so a post in a
  subdirectory puts a slash in the slug, which `[slug]` cannot represent. If nested
  content is ever needed, these become `[...slug].astro`.
- A page that lists nothing must still look finished. Each index has an empty state.
- Drafts get no page in production because `getPosts()` and `getProjects()` filter them
  before `getStaticPaths` sees them. The detail pages show a "Draft" marker in dev.
- **A post has exactly one URL.** `blog/[slug]` builds only `getNews()` and
  `writing/[slug]` only `getResearch()`, and every link goes through `postPath()`. Never
  hand-write `/blog/<id>` — a research post linked that way 404s.

## Don't

- Don't add `<script>` to a page. The contact form's handler is the whole JS budget.
- Don't use `Astro.glob` or `getCollection` directly — see the first rule.
- Don't hardcode a route string. Nav lives in `src/config/site.ts`; URLs go through
  `href()`.
