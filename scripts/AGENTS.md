# scripts — repository tooling

| File             | What it does                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `check-docs.mjs` | Validates the agent documentation system: every folder under `src/`, `scripts/`, `public/` or `.github/` that holds files is covered by an `AGENTS.md` table listing exactly those files, every backtick-quoted repo path in `INDEX.md` resolves on disk, and `PROGRESS.md` has all six required section headings. Exits non-zero with one `path — problem` line per failure. Run via `npm run docs:check`. |

## Rules

- Zero dependencies. Plain Node ESM, standard library only. It runs in CI-less
  environments and on a fresh clone before `npm ci` if need be.
- Coverage is satisfied by the **nearest ancestor** `AGENTS.md`. A nested folder without
  its own file must have its contents listed in the ancestor's table with a relative
  path (`blog/index.astro`). This is why `src/pages/AGENTS.md` documents every route.
- `src/content/blog` and `src/content/projects` are skipped — they are submodule mounts
  owned by other repositories.
- A backtick span in `INDEX.md` is treated as a path only if it is made of safe path
  characters _and_ contains a `/` or ends in a known extension. Bare symbol names
  (`--hue-brand`, `href()`) are ignored by construction. If you add a path-shaped string
  to `INDEX.md` that is not a path, the check will fail — rephrase it.

## Don't

- Don't add an npm dependency here to make the parsing prettier.
- Don't loosen a rule to make a failure go away. The failures are the point: fix the
  `AGENTS.md` table or the `INDEX.md` reference instead.
