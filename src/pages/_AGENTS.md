# src/pages — the routes

One file per URL. This table covers the whole route tree, including the nested folders.

**Why the underscore in this file's name.** Astro publishes any `.md` under `src/pages`
as a page — a plain `AGENTS.md` here ships to the live site as `/AGENTS`. The `_` prefix
is Astro's own "not a route" marker. This folder is the only place the documentation file
is spelled `_AGENTS.md`; `npm run docs:check` accepts either name.

| File                    | What it does                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.astro`           | Home. Tagline as `h1`, then the three highest-priority projects (featured first), the three newest posts, and a line pointing at contact. Content-led on purpose: the first screen shows work, not an introduction. |
| `contact.astro`         | Contact. Renders `ContactForm` when a form key is configured and an explanatory line when not, followed by the configured social links. Adds a dev-only hint about `PUBLIC_CONTACT_FORM_KEY`.                       |
| `404.astro`             | Not-found page. Links home and to every nav destination.                                                                                                                                                            |
| `rss.xml.ts`            | The feed. `GET` returns `@astrojs/rss` output from `getPosts()`, with the base path folded into the channel link so items resolve under the project subpath.                                                        |
| `projects/index.astro`  | The project grid, featured first then newest.                                                                                                                                                                       |
| `projects/[slug].astro` | One project. `getStaticPaths` maps every entry from `getProjects()`; renders metadata, links, an optional optimised `cover` image, and the Markdown body in `ProseLayout`.                                          |
| `blog/index.astro`      | Post list with a tag directory showing counts.                                                                                                                                                                      |
| `blog/[slug].astro`     | One post. Same shape as the project detail page, with tags instead of tech.                                                                                                                                         |
| `blog/tags/[tag].astro` | Posts for one tag. `getStaticPaths` comes from `getAllTags()`, so a tag page exists only when a visible post carries it.                                                                                            |

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

## Don't

- Don't add `<script>` to a page. The contact form's handler is the whole JS budget.
- Don't use `Astro.glob` or `getCollection` directly — see the first rule.
- Don't hardcode a route string. Nav lives in `src/config/site.ts`; URLs go through
  `href()`.
