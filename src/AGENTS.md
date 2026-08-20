# src — everything the site is built from

| File                | What it does                                                                                                                                                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content.config.ts` | Defines four collections from two schemas: `blog` + `projects` load from the submodule mounts, `blogSample` + `projectSample` from the committed placeholders. Exports `blogSchema` and `projectSchema` so a frontmatter field is declared once for both. |
| `env.d.ts`          | Types the `PUBLIC_*` variables on `import.meta.env`. Merges with Astro's own declarations, so `BASE_URL`, `PROD` and `DEV` stay available.                                                                                                                |

## Rules

- Pages never import the four collection names directly. They go through
  `src/lib/content.ts`, which decides between mounted content and samples.
- Content lives under `src/` (not a top-level `content/`) so images co-located with the
  Markdown in the private repos go through Astro's image pipeline.
- Adding a `PUBLIC_*` variable means editing four files: `src/env.d.ts`,
  `src/config/site.ts`, `.env.example`, and `.github/workflows/deploy.yml`.

## Don't

- Don't `import { z } from 'astro:content'` — deprecated in Astro 7. Use `astro/zod`,
  which re-exports zod v4 (so `z.url()`, not `z.string().url()`).
- Don't widen the glob pattern in `content.config.ts`. It deliberately excludes
  `README.md`, because the private content repos have one at their root and it would
  otherwise become an entry.
