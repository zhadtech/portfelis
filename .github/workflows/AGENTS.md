# .github/workflows — continuous deployment

| File         | What it does                                                                                                                                                                                                                                                                                                |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deploy.yml` | The only workflow. On push to `main` (and on manual dispatch) it refuses to run without `secrets.CONTENT_PAT`, checks out the private content submodules with that PAT, builds with the `PUBLIC_*` values from repository variables, and publishes `dist/` to GitHub Pages. Two jobs: `build` and `deploy`. |

## Rules

- **`CONTENT_PAT` is required.** A classic PAT with `repo` scope, able to read the
  private content repositories. The default `GITHUB_TOKEN` cannot read _other_ private
  repos, so submodule checkout fails without it.
- `.gitmodules` must use **HTTPS** URLs. The PAT is applied to HTTPS, not SSH.
- Missing PAT **fails the build**. Deploying placeholder content to a live site is worse
  than deploying nothing, so this is deliberate and loud.
- Every value the site reads at build time comes from `vars.*`, except the contact form
  key which comes from `secrets.*`. Adding an env var means editing three places:
  `.env.example`, `src/config/site.ts`, and the build step here.
- Pages needs `permissions: contents: read, pages: write, id-token: write` and the
  `concurrency: pages` group. Do not remove them.

## Don't

- Don't add a PR-check workflow. Checks run locally: `npm run check`,
  `npm run format:check`, `npm run docs:check`.
- Don't set `cancel-in-progress: true`. A cancelled Pages deploy can leave the site
  mid-swap.
- Don't put real identity values in this file. They belong in repository variables.
