# Progress

## Status

Build complete. All seven phases done and the acceptance checklist passes. The repository
is not yet under version control — see Open questions.

## Done

- [x] **Phase 0 — Docs skeleton.** `INDEX.md`, `PROGRESS.md`, root `AGENTS.md`,
      `scripts/check-docs.mjs`, per-folder `AGENTS.md`.
- [x] **Phase 1 — Foundation.** Dependencies, `astro.config.mjs` with `site`/`base` from
      env, `src/styles/global.css` hue system, `src/config/site.ts`, `src/lib/paths.ts`,
      `.env.example`, npm scripts, Prettier config.
- [x] **Phase 2 — Content layer.** `src/content.config.ts`, six sample entries,
      `src/lib/content.ts`. Build verified with both mounts empty.
- [x] **Phase 3 — Shell.** `BaseLayout`, `ProseLayout`, `Header`, `Footer`, skip link,
      active nav state.
- [x] **Phase 4 — Pages.** Home, projects index and detail, blog index and detail, tag
      pages, 404.
- [x] **Phase 5 — Contact + RSS.** `ContactForm.astro`, `contact.astro`, `rss.xml.ts`.
- [x] **Phase 6 — Deploy.** `.github/workflows/deploy.yml`, `.gitmodules` template,
      `README.md`.
- [x] **Phase 7 — Verify.** Full checklist below.

### Acceptance checklist

- [x] `npm run build` succeeds with both mounts empty; samples render on every page.
- [x] `npm run build` with content in the mounts: real content fully replaces the samples
      (verified with temporary files, since removed).
- [x] `npm run preview` — all 13 routes reachable under `/portfelis`, no broken assets;
      `/`, `/projects`, a project, `/blog`, a post, a tag page, `/contact`, a bad URL.
- [x] Drafts render in `dev` (`/blog/measuring-what-the-reader-waits-for`,
      `/projects/atlas`) and appear nowhere in the production output.
- [x] `npm run check` clean.
- [x] `npm run format:check` clean.
- [x] `npm run docs:check` clean.
- [x] `--hue-brand` at 30 and 280 reskins everything — all nine theme tokens read back at
      the new hue in the browser, and no color literal exists outside `global.css` except
      the documented favicon.
- [x] Privacy sweep of all 59 committed files: no email, phone, address, real name, or
      non-placeholder URL.
- [x] No JavaScript ships beyond the contact form handler — 901 bytes, inlined, on
      `/contact` only. Every other page emits zero script tags.
- [x] Keyboard pass: skip link appears on first Tab, every control reachable, focus ring
      visible throughout.
- [x] Contact form submit handler tested against stubbed `fetch` — success, server
      rejection, network failure, and honeypot paths all behave.
- [x] `INDEX.md` routes to every file that exists, and each row's named symbol is
      actually present in the file it points at.

## Next

Nothing is outstanding in the build itself. To take it live:

1. Run the `git init` and `git submodule add` commands in `README.md` → "First-time
   setup". They were deliberately not run; see Open questions.
2. In the GitHub repository: Pages → Source: GitHub Actions; add the `CONTENT_PAT`
   secret; add the `PUBLIC_*` repository variables.
3. Copy `.env.example` to `.env` and fill in local values.
4. Replace `public/favicon.svg` — its fill is the one hardcoded color in the repo.

## Decisions

Append-only. Date, decision, one-line rationale.

- **2026-08-20** — Astro 7, static output, no UI framework islands. A portfolio that
  claims to respect attention should not ship a runtime.
- **2026-08-20** — Deploy as a GitHub Pages _project_ site; `base = /portfelis`. Every
  internal link goes through `href()` so the base prefix is applied in exactly one place.
- **2026-08-20** — Real content lives in private git submodules mounted at
  `src/content/blog` and `src/content/projects`; samples in `src/content/samples/`
  render when the mounts are empty. Keeps the public repo free of real content while
  the live site still shows it.
- **2026-08-20** — Content lives under `src/` (not a top-level `content/`) so images
  co-located in the private repos can go through Astro's image pipeline.
- **2026-08-20** — Tailwind v4 via `@tailwindcss/vite`, no `tailwind.config.js`.
  v4's CSS-first config keeps the palette and the theme in the same file.
- **2026-08-20** — Single `--hue-brand` knob in OKLCH drives the entire palette;
  neutrals carry chroma 0.002–0.024 of that hue. OKLCH keeps lightness perceptually
  even when the hue changes, so a reskin stays coherent. Verified that `var()` resolves
  inside Tailwind's `@theme`, so no `:root` indirection was needed.
- **2026-08-20** — Light theme only. No dark mode, no toggle.
- **2026-08-20** — Plain Markdown, no MDX. Nothing in the content needs components.
- **2026-08-20** — Contact via Web3Forms + honeypot. Static-friendly; the access key is
  designed to be public.
- **2026-08-20** — One CI workflow (build + deploy). No separate PR-check workflow.
- **2026-08-20** — Missing `CONTENT_PAT` **fails** the deploy rather than falling back to
  samples. A silent placeholder deploy to a live site is the worst available outcome.
- **2026-08-20** — Deliberately out of scope: dark mode, OG/Twitter cards, sitemap,
  search, comments, analytics. Per-page `<title>`/`<meta description>` are in, as
  baseline correctness. `src/layouts/AGENTS.md` says how to add the first two later.
- **2026-08-20** — Dependencies added: `@tailwindcss/vite`, `tailwindcss`,
  `@astrojs/rss` (runtime); `@astrojs/check`, `typescript`, `prettier`,
  `prettier-plugin-astro`, `prettier-plugin-tailwindcss`, `@types/node` (dev);
  `@bruits/satteri-darwin-arm64` pinned to `0.10.3` (optional — see Known issues).
- **2026-08-20** — `docs:check` coverage rule: a folder holding files must be covered
  by its own `AGENTS.md` _or_ by the nearest ancestor's, which lists the file with a
  relative path. This lets `src/pages/_AGENTS.md` document every route in one table
  instead of scattering four near-empty files across the route tree.
- **2026-08-20** — The routes doc is `src/pages/_AGENTS.md`, not `AGENTS.md`. Astro's
  file-based routing publishes any `.md` under `src/pages`, and a plain `AGENTS.md`
  there shipped the internal documentation to the live site as `/AGENTS`. The `_` prefix
  is Astro's own "not a route" marker; mutating routes from the `astro:routes:resolved`
  integration hook was tried first and has no effect.
- **2026-08-20** — `astro.config.mjs` reads env through Vite's `loadEnv` rather than
  `process.env` directly, so a local `.env` applies to `site`/`base` too and dev matches
  production. CI values arrive through `process.env` either way.
- **2026-08-20** — The content glob excludes `README.md` and `_`-prefixed files. The
  private content repos have a README at their root, which would otherwise be published
  as a post.
- **2026-08-20** — Inline code in prose is tinted with a hairline border rather than
  wrapped in literal backtick pseudo-elements. The backticks read as a Markdown parsing
  bug rather than as a deliberate style.
- **2026-08-20** — `import { z } from 'astro/zod'`, not from `astro:content`, which is
  deprecated in Astro 7. That re-export is zod v4, so schemas use `z.url()`.

## Open questions

- **Git repository not initialised.** The build prompt asks for `git init` and an initial
  commit in Phase 0 (§10) but also states the repo must not be created and that the
  `git init` / submodule commands belong in `README.md` for the user to run (§9). The
  more specific instruction was followed: nothing was initialised, and the exact commands
  are in `README.md` under "First-time setup". Say the word and they can be run.

## Known issues

- **`@bruits/satteri-darwin-arm64` is pinned to `0.10.3` in `optionalDependencies`.**
  Astro 7's Markdown engine `satteri@0.10.4` declares an optional dependency on its own
  native binding at `0.10.4`, but that binding was never published for `darwin-arm64` —
  only up to `0.10.3`. Without the pin, `npm install` on Apple Silicon completes and every
  build then fails with `Cannot find native binding`. The pin is os/cpu-gated, so `npm ci`
  on Linux CI skips it and uses `satteri-linux-x64-gnu` from the lockfile. Remove the pin
  once upstream publishes a matching `darwin-arm64` build.
- **Two `The collection "…" does not exist or is empty` lines on every build** with the
  mounts empty. Expected, not a failure — it is Astro reporting the fresh-clone state.
  Queries are memoised so it stays at one line per mount.
- **Deleting content from a mount leaves stale entries** in
  `node_modules/.astro/data-store.json`; the loader warns that no files matched but keeps
  serving the cached entries. `rm -f node_modules/.astro/data-store.json` clears it.
  Documented in `src/lib/AGENTS.md`. CI and fresh clones are unaffected.
- **Content files must be flat.** Entry ids come from the file path, so a Markdown file in
  a subdirectory of a mount would put a slash in the slug, which `[slug].astro` cannot
  represent. If the private repos ever nest content, both detail routes become
  `[...slug].astro`.
- **`public/favicon.svg` holds the only hardcoded color** in the repository. A static SVG
  cannot read `--hue-brand`; change it by hand if you change the hue.
