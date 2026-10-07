# .github/workflows — continuous deployment

| File               | What it does                                                                                                                                                                                                                                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deploy.yml`       | On push to `main` (and on manual dispatch) it refuses to run without `secrets.CONTENT_PAT`, checks out the private content submodules with that PAT, builds with the `PUBLIC_*` values from repository variables, and publishes `dist/` to GitHub Pages. Two jobs: `build` and `deploy`.                                                           |
| `content-sync.yml` | On a `content-updated` repository dispatch from a content repo (and on manual dispatch) it moves both submodule pointers to the tip of their `main`, commits, and pushes to `main` with `CONTENT_PAT`. That push is what runs `deploy.yml`. Does nothing when the pointers are already current. The sender lives in each content repo — see below. |

## Rules

- **`CONTENT_PAT` is required by both workflows.** A classic PAT with `repo` scope. It
  reads the private content repositories — the default `GITHUB_TOKEN` cannot read
  _other_ private repos — and `content-sync.yml` pushes to this one with it. A
  fine-grained token needs Contents: Read-only on the two content repos and Read and
  write on `portfelis`.
- **The sync must push with the PAT, never `GITHUB_TOKEN`.** A push made with
  `GITHUB_TOKEN` does not trigger other workflows, so the pointers would move and
  nothing would deploy. Checkout persists the PAT, which is why the job never configures
  a credential itself.
- **The sync's commit message stays fixed.** This repository is public. Never put
  `git diff --submodule=log`, `git log`, or any other content-repo output into the commit
  message or the job log; it would copy private commit messages into public history.
- **The sender lives in each content repo**, at `.github/workflows/notify-site.yml`, with
  a `SITE_DISPATCH_TOKEN` secret that can write to `portfelis`. Its source is in
  `README.md` → "Updating content". Change the event type there and in
  `content-sync.yml` together, or the dispatch arrives and nothing listens.
- `.gitmodules` must use **HTTPS** URLs, and its `branch = main` lines are what
  `git submodule update --remote` follows. The PAT is applied to HTTPS, not SSH.
- Missing PAT **fails the build**. Deploying placeholder content to a live site is worse
  than deploying nothing, so this is deliberate and loud.
- Every value the site reads at build time comes from `vars.*`, except the contact form
  key which comes from `secrets.*`. Adding an env var means editing three places:
  `.env.example`, `src/config/site.ts`, and the build step in `deploy.yml`.
- Pages needs `permissions: contents: read, pages: write, id-token: write` and the
  `concurrency: pages` group. Do not remove them.
- `content-sync.yml` keeps its own `concurrency: content-sync` group. In `pages`, a queued
  sync would replace a pending deploy and the site would miss it.

## Don't

- Don't add a PR-check workflow. Checks run locally: `npm run check`,
  `npm run format:check`, `npm run docs:check`.
- Don't set `cancel-in-progress: true` in either workflow. A cancelled Pages deploy can
  leave the site mid-swap; a cancelled sync can die between commit and push.
- Don't make the build fetch `--remote` content instead of syncing. The pointer recorded
  here must stay equal to what is live, or `npm run content:on` stops reproducing
  production.
- Don't put real identity values in these files. They belong in repository variables.
