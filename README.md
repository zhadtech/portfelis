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

Links work in `dev` but 404 on Pages if any of them bypass `href()` in
`src/lib/paths.ts`. `preview` is the build that tells you the truth.

## Configuration

Copy `.env.example` to `.env` and fill in what you want. Everything is optional.

```bash
cp .env.example .env
```

`.env` is gitignored. In CI the same values come from GitHub repository variables, with
the contact form key from repository secrets. See `.github/workflows/deploy.yml`.

## First-time setup

This directory is not a git repository yet. To make it one and wire up private content:

```bash
git init -b main
git add . && git commit -m "Initial commit"
```

```bash
git remote add origin https://github.com/OWNER/portfelis.git
```

Then mount the private content repositories. Delete the placeholder `.gitmodules` first —
`git submodule add` writes its own:

```bash
rm .gitmodules
```

```bash
git submodule add https://github.com/OWNER/PRIVATE-BLOG-REPO.git src/content/blog
```

```bash
git submodule add https://github.com/OWNER/PRIVATE-PROJECTS-REPO.git src/content/projects
```

Use HTTPS URLs, not SSH: CI applies its token to HTTPS only.

## Deployment

Push to `main`. The workflow checks out the submodules with `secrets.CONTENT_PAT`,
builds, and publishes to GitHub Pages.

Before the first deploy:

1. **Settings → Pages → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions → Secrets:** add `CONTENT_PAT`, a
   personal access token with `repo` scope that can read the private content
   repositories. The default `GITHUB_TOKEN` cannot read other private repos. Optionally
   add `PUBLIC_CONTACT_FORM_KEY`.
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
