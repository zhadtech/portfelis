# Progress

## Status

Live. The site has deployed from `main` since 2026-08-23, rendering the two private
content repositories; the samples still stand in when they are unmounted. A push to a
content repo reaches the site on its own: each content repo dispatches to
`.github/workflows/content-sync.yml`, which moves the submodule pointers and starts the
deploy. The one open item is a clean end-to-end run of that chain — see Next.

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
- [x] **Phase 8 — Private content mounts.** `zhadtech/portfelis-blog` and
      `zhadtech/portfelis-projects` created private and seeded with a schema README and
      one starter entry each; both added as submodules; `content:on` / `content:off` /
      `content:status` scripts; `CONTENT_SOURCE` build switch.
- [x] **Phase 9 — Content sync.** `.github/workflows/content-sync.yml` moves the
      submodule pointers on a `content-updated` dispatch, pushes with `GITHUB_TOKEN`, and
      starts the deploy. Each content repo carries the sender,
      `.github/workflows/notify-site.yml` (source in `README.md` → "Updating content"),
      and a `SITE_DISPATCH_TOKEN` secret.

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
- [x] Mounts populated: the build emits `/blog/starter-post` and `/projects/starter-project`
      and no sample slug appears anywhere in `dist/`.
- [x] `npm run content:off` → build renders the samples; `npm run content:on` → build
      renders the private content again. Round trip is offline and leaves the working
      tree clean.
- [x] `CONTENT_SOURCE=samples` forces the samples with the mounts still checked out, set
      either in the environment or in `.env`. `CONTENT_SOURCE` appears nowhere in `dist/`.

## Next

### Prove the content sync once

Both content repos carry `.github/workflows/notify-site.yml` and a `SITE_DISPATCH_TOKEN`
secret, installed 2026-10-07. What is left is one clean end-to-end run: a sender run, a
**Sync content** run here that commits `chore: sync private content`, and the **Deploy**
run it starts.

When a run fails, the step that failed says where to look:

- **The sender's run fails** with `Bad credentials` or `Resource not accessible` — its
  `SITE_DISPATCH_TOKEN` is missing, expired, or cannot write to `portfelis` (a
  fine-grained token needs Contents: Read and write there). A stored secret cannot be
  read back; set a new value.
- **The sender succeeds but no Sync content run appears** — the event type in the sender
  and in `content-sync.yml` differ, `content-sync.yml` is not on `main` (a repository
  dispatch only runs workflows from the default branch), or the site repo is not named
  `portfelis`.
- **Sync content fails at "Move each pointer"** — `CONTENT_PAT` cannot read a content
  repo (expired, or a fine-grained token missing that repo), or a `.gitmodules` entry
  has no `branch`.
- **Sync content pushed but no Deploy followed** — see Known issues.
- **Sync content says "Nothing to deploy"** — the pointers were already current, e.g.
  because a previous sync picked the commit up. Not a failure.

**Actions → Sync content → Run workflow** does the whole job by hand at any time.

### First-deploy configuration — done, kept for reference

The steps below were completed before the first deploy on 2026-08-23. They stay here as
the reference for replacing an expired token or setting up a fork.

**Three repositories are involved.** This one — `portfelis`, public — holds the code and
the workflow. Two private ones hold the writing and are mounted as the submodules listed
in `.gitmodules`. The deploy runs in `portfelis` and has to reach into the other two.
That reach is the only thing `CONTENT_PAT` exists for.

### 1. Create the token

`CONTENT_PAT` is a **personal access token**: a credential that belongs to your GitHub
account, not to any repository. It does not exist anywhere yet — nothing in this repo or
in the content repos contains it, and nothing generated it. You create it once in your
account settings, then paste it into this repository's settings in step 2. The name
`CONTENT_PAT` is just the label this project stores it under; GitHub does not care what
it is called, but `.github/workflows/deploy.yml` looks up that exact spelling.

A token is needed at all because Actions' built-in `GITHUB_TOKEN` is scoped to the
repository the workflow runs in. It can read `portfelis` and nothing else, so it cannot
check out two private repositories owned by you but stored elsewhere.

1. Open **https://github.com/settings/tokens** (your avatar → Settings → Developer
   settings → Personal access tokens → Tokens (classic)).
2. **Generate new token → Generate new token (classic).**
3. **Note:** anything you will recognise later, e.g. `portfelis content`. It is a label
   for you; nothing reads it.
4. **Expiration:** your call. When it expires the deploy starts failing at the checkout
   step — the fix is to generate a new token and repeat step 2.
5. **Scopes:** tick **`repo`**, and nothing else. That is the whole grant.
6. **Generate token**, then copy the value (`ghp_…`) immediately. GitHub displays it
   exactly once. If you lose it, generate a new one; there is no way to read it back.

If you prefer a fine-grained token, give it **Contents: Read-only** on **all three**
repositories — including `portfelis` itself, because `deploy.yml` checks this repository
out with the same token it uses for the submodules. Read-only is deliberate; see the
2026-10-07 decisions before widening it.

### 2. Store the token in this repository

Do this in **`portfelis`** — the public repo you are reading now. Not in the content
repos, and not in your account settings.

1. This repository → **Settings → Secrets and variables → Actions →** the **Secrets**
   tab (not Variables).
2. **New repository secret.**
3. **Name:** `CONTENT_PAT`, exactly — see `.github/workflows/deploy.yml:26`.
4. **Secret:** paste the `ghp_…` value from step 1.
5. **Add secret.** From here it is write-only: you can replace it, never read it back.

Optionally add `PUBLIC_CONTACT_FORM_KEY` on the same tab — the Web3Forms access key.
It is public by design and only lives in Secrets to keep it out of the repo; leave it
unset and the contact page renders social links instead of a form.

### 3. Add the repository variables

Same screen, the **Variables** tab. **New repository variable**, once per row:

| Name                     | Value                                              |
| ------------------------ | -------------------------------------------------- |
| `PUBLIC_SITE_URL`        | `https://<your-user>.github.io` — no trailing path |
| `PUBLIC_BASE_PATH`       | `/portfelis` — must match the repository name      |
| `PUBLIC_SITE_NAME`       | Header, footer and page titles                     |
| `PUBLIC_SITE_TAGLINE`    | Subtitle under the site name                       |
| `PUBLIC_AUTHOR_HANDLE`   | Shown in the footer and the feed                   |
| `PUBLIC_SOCIAL_GITHUB`   | Full URL, or omit the variable                     |
| `PUBLIC_SOCIAL_LINKEDIN` | Full URL, or omit the variable                     |
| `PUBLIC_SOCIAL_X`        | Full URL, or omit the variable                     |

These are not secrets — they are baked into the published HTML. `.env.example` carries
the same list with fuller comments. Every one is optional; unset values fall back to the
placeholders in `src/config/site.ts`.

### 4. Turn Pages on

**Settings → Pages → Build and deployment → Source: GitHub Actions.** Not "Deploy from a
branch" — the workflow uploads the artifact itself.

### 5. Deploy and read the first run

Push to `main`, or **Actions → Deploy → Run workflow**. If it fails, the step that failed
says which of the above is missing:

- **"Require the content PAT" fails** — the secret is absent or misspelled. Step 2.
- **`actions/checkout` fails** with `could not read Username` or a 403 on a submodule —
  the token cannot reach the content repos: wrong scope, expired, or a fine-grained token
  missing one of the three repositories. Step 1.
- **Build succeeds, the site 404s or loads unstyled** — `PUBLIC_BASE_PATH` does not match
  the repository name. Step 3.

The build deliberately fails rather than falling back to the samples when the PAT is
missing; publishing placeholder content to a live site is the worst outcome available.

### 6. Local setup and content

1. `cp .env.example .env` and fill in the same values as step 3. `.env` is gitignored.
2. `npm run content:on` to check the private mounts out.
3. Replace the two starter entries with real writing. Until you do, they are the entire
   contents of the blog index, the projects grid and the feed. Each private repo's own
   `README.md` documents its frontmatter schema. Commit and push there; the content sync
   moves the pointer here and redeploys, once the senders above are installed.
4. Replace `public/favicon.svg`; its fill is the one hardcoded color in the repository.

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
  `@bruits/satteri-darwin-arm64` pinned to `0.10.3` (optional — pin since removed,
  see 2026-08-23).
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

- **2026-08-20** — Two private content repositories, not one. The two mounts are separate
  glob bases with different schemas; one repository would have to be mounted twice and
  each mount would then see the other collection's files.
- **2026-08-20** — The private repos carry their own `README.md` documenting their
  frontmatter schema. The content glob already excludes `README.md`, so the documentation
  sits with the thing it documents and cannot be published by accident.
- **2026-08-20** — Seeded each private repo with one non-draft starter entry. A repo with
  no commits cannot be added as a submodule at all, and a draft-only mount counts as
  populated — the real collection wins over the samples and production then renders an
  empty index. One real entry keeps the first deploy honest.
- **2026-08-20** — Two off switches, deliberately. `npm run content:off` (`git submodule
deinit`) reproduces the fresh-clone state exactly and is the honest test;
  `CONTENT_SOURCE=samples` forces the fallback without touching git, for when unmounting
  your own working copy is too blunt. They compose; neither replaces the other.
- **2026-08-20** — `content:on` / `content:off` also delete
  `node_modules/.astro/data-store.json`. Without it Astro keeps serving the entries it
  cached before the switch, which reads as "the fallback is broken". That cache clear is
  the entire reason these are npm scripts and not bare git commands in the README.
- **2026-08-20** — `CONTENT_SOURCE` is not `PUBLIC_`-prefixed and is not passed through in
  `deploy.yml`. It decides what the build reads, which the browser has no business
  knowing, and a deploy must always use real content. Verified it resolves in a static
  build from both the process environment and `.env`, and that the string appears nowhere
  in `dist/`.
- **2026-08-20** — Its type lives in `src/env.d.ts`, not in `src/config/site.ts`. That
  file is documented as holding identity values only; a build-behaviour flag is not one.

- **2026-08-23** — `package-lock.json` was regenerated from scratch. The committed lockfile
  had no top-level `@emnapi/core` / `@emnapi/runtime` entries, which `@img/sharp-wasm32`
  and `@tailwindcss/oxide-wasm32-wasi` both require. Those resolve only on platforms that
  reach the wasm32 optionals, so `npm install` on darwin-arm64 reports "up to date" and
  never repairs the gap, while `npm ci` on Linux CI fails with `Missing: @emnapi/runtime`.
  Deleting the lockfile and reinstalling is the only thing that rebuilds the full ideal
  tree — `npm install --package-lock-only`, even with `--os=linux --cpu=x64`, short-circuits.
  If a lockfile-out-of-sync error ever reappears in CI, regenerate rather than patch.
- **2026-08-23** — The `@bruits/satteri-darwin-arm64` pin in `optionalDependencies` was
  removed and the Known issue closed. Upstream published `0.10.5` for `darwin-arm64`
  (skipping `0.10.4` entirely), and the regenerated lockfile moves `satteri` to `0.10.5`,
  so the engine and its native binding match on their own. Keeping the `0.10.3` pin against
  a `0.10.5` engine would have reintroduced the mismatch the pin existed to prevent.
- **2026-08-23** — `actions/checkout` and `actions/setup-node` bumped `v4` → `v5`. GitHub
  now force-runs the v4 majors on Node 24 and warns on every run; the v5 majors target it
  natively. This was only a warning, never the cause of a failed build.
- **2026-08-24** — The contact page lead greeting interpolates `site.name` in a template
  literal rather than naming anyone in the source. Commit `0103346` wrote the name as a
  plain literal inside a single-quoted string, which both broke the build (the apostrophe
  in "I'm" closed the string early — `CompilerError: Expected ':' but found 'Identifier'`)
  and put a real name in a committed file. Prose is not exempt from the identity rule: any
  greeting that names the author reads it from `src/config/site.ts`.

- **2026-10-07** — A push to a content repo reaches the site by a `content-updated`
  repository dispatch to `content-sync.yml`, which commits the moved submodule pointers
  and pushes; that push runs the deploy. Rejected: building with
  `git submodule update --remote` inside `deploy.yml`. It needs no commits, but the
  pointer recorded here would drift from what is live, and `npm run content:on` would stop
  reproducing production.
- **2026-10-07** — This supersedes "One CI workflow (build + deploy)" of 2026-08-20; there
  are now two. The sync needs its own concurrency group, because in the shared `pages`
  group a queued sync replaces a pending deploy and the site misses it. The ban on a
  PR-check workflow stands.
- **2026-10-07** — The sync pushes with `CONTENT_PAT`, not `GITHUB_TOKEN`. A push made
  with `GITHUB_TOKEN` does not trigger other workflows, so the deploy would never run.
  The cost: a fine-grained `CONTENT_PAT` now needs write on `portfelis`; a classic one
  with `repo` scope already has it.
- **2026-10-07** — The sync's commit message is fixed text. This repo is public, and the
  obvious richer message (`git diff --submodule=log`) would copy private commit messages
  into its history.
- **2026-10-07** — The sender lives in each content repo, and its source is kept in
  `README.md` rather than as a file here. Any workflow file in this repo's
  `.github/workflows/` would run here, and the sender has nothing to do in this repo.
  It targets `${{ github.repository_owner }}/portfelis`, so the copy holds no account name.
- **2026-10-07** — Supersedes the entry above on pushing with `CONTENT_PAT`. The first live
  sync failed at `git push` with a 403, because `CONTENT_PAT` is read-only on `portfelis`,
  and it stays that way: `deploy.yml` leaves it in `.git/config` while `npm ci` runs
  third-party install scripts, so a writable token would let any compromised dependency
  push to this public repo. The sync now pushes with `GITHUB_TOKEN` (`contents: write`)
  and starts the deploy with `gh workflow run` (`actions: write`). A push made with
  `GITHUB_TOKEN` triggers no workflow, but a dispatch it sends does.
- **2026-10-07** — The sync reads each content repo's tip through the API and writes the
  gitlink with `git update-index`, instead of checking the submodules out. Commit ids are
  all it needs, and the private content never enters that job.

## Open questions

None outstanding.

## Known issues

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
- **`git submodule add` refuses when `.gitmodules` is missing from the working tree but
  still present in HEAD**, with `fatal: please make sure that the .gitmodules file is in
the working tree`. Deleting the placeholder file first — with `rm` or `git rm` — causes
  exactly that state. Create an empty (or comment-only) `.gitmodules` before running
  `git submodule add`; it appends to whatever is there.
- **Submodules added from a linked git worktree** store their object database under
  `.git/worktrees/<name>/modules/…`, not the shared `.git/modules/…`. The mounts work
  normally in that worktree, but the main worktree re-clones on its first
  `npm run content:on` after the change lands on `main`. Harmless, just not instant.
- **`public/favicon.svg` holds the only hardcoded color** in the repository. A static SVG
  cannot read `--hue-brand`; change it by hand if you change the hue.
- **The content sync commits to `main`.** After any content push, local `main` is behind;
  `git pull` before pushing local work, or the push is rejected as non-fast-forward. The
  sync itself can lose the same race if you push here in the seconds between its checkout
  and its push. It fails loudly, and re-running it fixes it.
- **Nothing retries a deploy the sync failed to start.** If its push lands but
  `gh workflow run` fails, the next sync finds the pointers current and stops. Run
  **Actions → Deploy → Run workflow**.
