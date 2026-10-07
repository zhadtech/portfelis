# portfelis

A static portfolio site — home, work, writing, contact. Built with Astro, deployed to
GitHub Pages as a project site, with the real content kept in private repositories and
mounted as git submodules.

Nothing personally identifying is committed. Every identity value is read from the
environment at build time, with a neutral placeholder default.

## Run it

```bash
npm install
npm run dev
```

The site builds and runs without any configuration. With the content submodules absent —
the state of a fresh clone — placeholder content from `src/content/samples/` renders
instead, and a notice says so in dev.

| Command                                   | What it does                                                     |
| ----------------------------------------- | ---------------------------------------------------------------- |
| `npm run dev`                             | Dev server. Drafts are visible. Forgiving about the base path.   |
| `npm run build`                           | Production build into `dist/`. Drafts are excluded.              |
| `npm run preview`                         | Serve `dist/` **with the base path applied**. Verify links here. |
| `npm run check`                           | `astro check` — types and templates.                             |
| `npm run format` / `npm run format:check` | Prettier.                                                        |
| `npm run docs:check`                      | Validates the agent documentation system.                        |
| `npm run content:on` / `content:off`      | Mount or unmount the private content. See "Private content".     |

Links work in `dev` but 404 on Pages if any of them bypass `href()` in
`src/lib/paths.ts`. `preview` is the build that tells you the truth.

## Configuration

Copy `.env.example` to `.env` and fill in what you want. Everything is optional.

```bash
cp .env.example .env
```

`.env` is gitignored. In CI the same values come from GitHub repository variables, with
the contact form key from repository secrets. See `.github/workflows/deploy.yml`.

## Private content

The real posts and project write-ups live in two private repositories, mounted here as
git submodules:

| Mount                  | Repository                    |
| ---------------------- | ----------------------------- |
| `src/content/blog`     | `zhadtech/portfelis-blog`     |
| `src/content/projects` | `zhadtech/portfelis-projects` |

A fresh `git clone` leaves both directories empty, and the site builds fine that way —
the placeholders in `src/content/samples/` render instead. To fetch the real content:

```bash
npm run content:on
```

Each repository's own `README.md` documents the frontmatter schema for its collection.
Write there, commit and push there, and the site picks it up on its own (see "Updating
content" below). The URLs in `.gitmodules` are HTTPS, not SSH — CI applies
`secrets.CONTENT_PAT` to HTTPS only.

### Turning private content on and off

| Command                  | What it does                                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run content:on`     | Checks the submodules out. Instant and offline after the first time — `deinit` keeps the objects.                                         |
| `npm run content:off`    | Empties both mounts. The samples take over, exactly as on a fresh clone.                                                                  |
| `npm run content:status` | Shows both mounts. A leading `-` means not checked out; a leading `+` means the checkout is at a different commit than this repo records. |

Both scripts also delete `node_modules/.astro/data-store.json`. Without that, Astro keeps
serving the entries it cached before the switch and the change appears not to have taken.

There is a second, softer switch that does not touch git at all. In `.env`:

```
CONTENT_SOURCE=samples
```

That forces the placeholders even with the mounts checked out — useful for checking what
a fork or a fresh clone sees without unmounting your own work. Unset it to go back.
It is read at build time only and never reaches the browser, and CI never sets it, so a
deploy always uses real content.

### Updating content

This repo records a specific commit of each mount, and the deploy builds exactly what is
recorded, so a commit in a private repo does not reach the site by itself. Each content
repo closes that gap with a small workflow: every push to its `main` sends a
`content-updated` dispatch here, and `.github/workflows/content-sync.yml` answers it by
moving both pointers to the latest content, committing, pushing, and starting the deploy.
Push to a content repo and the site updates a couple of minutes later.

The sync commits to `main` here, so `git pull` before pushing your own work.

**One-time setup, in each content repo** (`portfelis-blog` and `portfelis-projects`):

1. **Settings → Secrets and variables → Actions → New repository secret:**
   `SITE_DISPATCH_TOKEN` — or `gh secret set SITE_DISPATCH_TOKEN --repo <owner>/<repo>`,
   which prompts for the value. Use a dedicated fine-grained token: **Only select
   repositories** → `portfelis`, **Contents: Read and write**. One token serves both
   content repos. Not `CONTENT_PAT`, which is read-only on `portfelis` by design.
2. Add `.github/workflows/notify-site.yml`:

   ```yaml
   name: Notify site

   # Tells the site repo to move its submodule pointer to this push and redeploy.
   on:
     push:
       branches: [main]
       # Changes the site never renders. The README is excluded from the content glob.
       paths-ignore: [README.md, '.github/**']
     workflow_dispatch:

   permissions: {}

   jobs:
     dispatch:
       runs-on: ubuntu-latest
       steps:
         - name: Dispatch content-updated
           env:
             GH_TOKEN: ${{ secrets.SITE_DISPATCH_TOKEN }}
             # Rename here if the site repo is not called portfelis.
             SITE_REPO: ${{ github.repository_owner }}/portfelis
           run: gh api "repos/$SITE_REPO/dispatches" -f event_type=content-updated
   ```

To sync by hand — a dispatch failed, or the senders are not set up yet — run **Actions →
Sync content → Run workflow** here. Or locally:

```bash
npm run content:on && git submodule update --remote
```

```bash
git add src/content/blog src/content/projects && git commit -m "Update content"
```

Push that, and the deploy picks the new content up.

## Deployment

Push to `main`. The workflow checks out the submodules with `secrets.CONTENT_PAT`,
builds, and publishes to GitHub Pages. A push to a content repo gets here through the
content sync (see "Updating content").

Before the first deploy:

1. **Settings → Pages → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions → Secrets:** add `CONTENT_PAT`, a
   personal access token that can read the private content repositories — classic with
   `repo` scope, or fine-grained with Contents: Read-only. The default `GITHUB_TOKEN`
   cannot read other private repos. Optionally add `PUBLIC_CONTACT_FORM_KEY`.
3. **…→ Variables:** add the `PUBLIC_*` values from `.env.example`. `PUBLIC_BASE_PATH`
   must match the repository name (`/portfelis`), or be `/` for a user or custom-domain
   site.

Without `CONTENT_PAT` the build **fails on purpose**. Publishing placeholder content to
a live site is worse than publishing nothing.

## What "private content" does and does not mean

The private submodules keep the _sources_ out of this repository's public git history —
no drafts, no unpublished notes, no revision trail. They do **not** hide anything that
reaches the live site. Everything the build renders is served publicly at the site URL.
Private repositories control what is in the public git history, not what is on the web.

## Working on this repo

`AGENTS.md` (root) is the entry point, `PROGRESS.md` has the state and the decision log,
`INDEX.md` routes a task to a file. Every folder has its own `AGENTS.md`.
Run `npm run docs:check` after adding, removing, or renaming a file.
