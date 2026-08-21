# portfelis — agent instructions

## Start here

1. Read `PROGRESS.md` — what is done, what is next, what was already decided.
2. Read `INDEX.md` — the task-to-file jump table.
3. Open the target folder's `AGENTS.md` **before** editing anything in it.

Do not read the codebase to build context. If `INDEX.md` cannot route you to the
right file, that is a bug in `INDEX.md` — fix the docs, then do the work.

One naming exception: the routes are documented in `src/pages/_AGENTS.md`. Astro would
publish a plain `AGENTS.md` in that folder as a page, and `_` is its "not a route" marker.

## Hard rules

- **No personal information in committed files.** Every identity value is read from
  `import.meta.env` in `src/config/site.ts` with a placeholder default. Real values
  live in `.env` (gitignored) and in CI repository variables.
- **All internal links go through `href()`** from `src/lib/paths.ts`. Never write
  `href="/blog"`. The site deploys under a base path and literal roots 404 in
  production. This applies to assets in `public/` too.
- **Never write content into `src/content/blog` or `src/content/projects`.** Those are
  git submodule mounts owned by private repositories. Sample content goes in
  `src/content/samples/`. Mount them with `npm run content:on`, unmount with
  `npm run content:off`; both are safe to run at any time and neither touches this
  repository's history.
- **One hue.** `--hue-brand` in `src/styles/global.css` drives every color. Never
  introduce a literal color anywhere else.
- **No new runtime JavaScript.** The only script that ships is the contact form's
  submit handler.
- **New dependencies must be logged** in `PROGRESS.md` under Decisions.

## When you add, remove, or rename a file

1. Update that folder's `AGENTS.md` table in the same change.
2. Update `INDEX.md` if a routing entry changed.
3. Run `npm run docs:check`.

## When you finish a session

Update `PROGRESS.md`: Status, Done, Next, and append any new Decisions with the date
and a one-line rationale. The Decisions log is append-only — it is what stops the next
session relitigating a settled question.

## `public/` — files published verbatim

Everything in `public/` is copied to the site root untouched, which is why this folder's
documentation lives here rather than in a `public/AGENTS.md` — that file would be
published too.

| File                 | What it does                                                                                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `public/favicon.svg` | The tab icon. Three left-aligned bars on a solid tile. Its fill is the **only** hardcoded color in the repository: a static SVG cannot read `--hue-brand`, so update it by hand if you change the hue. |

Reference these files as `href('/favicon.svg')`, never `/favicon.svg`. Nothing here is
processed, hashed, or optimised — images that should go through Astro's image pipeline
belong under `src/`.

## Verification

```
npm run check        # astro check — types and templates
npm run format:check # prettier
npm run docs:check   # the docs system above
npm run build        # must succeed with the submodule mounts empty
```

The last one is the easy check to skip and the expensive one to get wrong: a fresh clone
and every fork start with the mounts empty. Verify it for real rather than assuming —

```
npm run content:off && npm run build && npm run content:on
```

— or, without unmounting anything, `CONTENT_SOURCE=samples npm run build`.

`npm run dev` is forgiving about the base path; `npm run build && npm run preview` is
not. Verify routing with `preview`.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
