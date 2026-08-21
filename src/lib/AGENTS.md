# src/lib — the two helpers everything else depends on

| File         | What it does                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `paths.ts`   | `href(path)` joins `import.meta.env.BASE_URL` with an app-relative path and normalises slashes — the only correct way to write an internal URL. `isActive(pathname, target)` decides whether a nav tab is current: home matches exactly, everything else also matches its descendants, so a post keeps "Writing" lit.                                                                                                   |
| `content.ts` | The mount-or-sample resolver. `getPosts()` / `getProjects()` return mounted content, or the samples when the mount is empty, with drafts stripped in production and newest first. `forceSamples` is the `CONTENT_SOURCE=samples` override. Also `getProjectsByPriority()` (featured first), `getAllTags()` (label, slug, count), `getPostsByTag(slug)`, `tagSlug(label)`, and `usingSamples()` for the dev-only notice. |

## Rules

- Every rule about drafts, ordering, and fallback lives in `content.ts`, once. If a page
  is filtering or sorting entries itself, the logic belongs here instead.
- `href()` takes a path with a leading slash and returns one with the base applied.
  `href('/')` returns the base itself.
- Tags are matched by slug, not by label, so `Static Sites` and `static-sites` reach the
  same page. The first spelling encountered is the one displayed.
- The fallback has exactly two inputs: whether the mounted collection has entries, and
  `forceSamples`. Both are read in `resolve()`. Nothing else may branch on content source.

## Notes on the empty-mount case

`getCollection` returns `[]` for an empty directory — the normal uninitialised-submodule
state — and logs `The collection "blog" does not exist or is empty`. **That warning is
expected on a fresh clone and is not a failure.** It throws only when the directory is
missing entirely, which happens if someone deletes a mount rather than leaving it empty;
`safely()` catches that and treats it the same way. Collection results are memoised, which
keeps the warning to one line per empty mount and avoids re-querying per page.

## The off switch

Two independent ways to get the placeholder rendering back, for two different reasons.

`npm run content:off` unmounts the submodules (`git submodule deinit`), leaving the mount
directories empty — byte for byte the fresh-clone state, which is what makes it the honest
test. `npm run content:on` restores them; it is offline and instant, because `deinit` keeps
the objects in the module store. Both scripts clear the Astro cache described below, which
is the whole reason they exist rather than being bare git commands in the README.

`CONTENT_SOURCE=samples` in `.env` forces the samples with the mounts still checked out.
Use it to see what a fork sees without disturbing your own working copy. It is read once,
at module load, into `forceSamples`. It is never passed through in CI — a deploy must
always use real content — and it never reaches the client, because nothing in this file
runs in the browser.

`usingSamples()` is true under either one, so the dev notice stays accurate.

## When unmounting content locally

Astro caches loaded entries in `node_modules/.astro/data-store.json`. If you remove or
unmount the submodules, the glob loader warns that it found no files but **keeps serving
the previously cached entries**, so the sample fallback appears not to work. Clear it:

```bash
rm -f node_modules/.astro/data-store.json
```

CI and fresh clones are unaffected — there is no cache to go stale.

## Don't

- Don't write `href="/blog"` anywhere, in any file. It works in `dev` and 404s on Pages.
- Don't probe the filesystem to detect whether the submodules are mounted. An empty
  collection already says so.
- Don't read `CONTENT_SOURCE` anywhere else, and don't add a `PUBLIC_` alias for it.
  It decides what the build reads, which is nothing the browser has any business knowing.
- Don't surface `usingSamples()` in a production page. It is a development affordance.
