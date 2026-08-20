# src/lib — the two helpers everything else depends on

| File         | What it does                                                                                                                                                                                                                                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `paths.ts`   | `href(path)` joins `import.meta.env.BASE_URL` with an app-relative path and normalises slashes — the only correct way to write an internal URL. `isActive(pathname, target)` decides whether a nav tab is current: home matches exactly, everything else also matches its descendants, so a post keeps "Writing" lit.                                          |
| `content.ts` | The mount-or-sample resolver. `getPosts()` / `getProjects()` return mounted content, or the samples when the mount is empty, with drafts stripped in production and newest first. Also `getProjectsByPriority()` (featured first), `getAllTags()` (label, slug, count), `getPostsByTag(slug)`, `tagSlug(label)`, and `usingSamples()` for the dev-only notice. |

## Rules

- Every rule about drafts, ordering, and fallback lives in `content.ts`, once. If a page
  is filtering or sorting entries itself, the logic belongs here instead.
- `href()` takes a path with a leading slash and returns one with the base applied.
  `href('/')` returns the base itself.
- Tags are matched by slug, not by label, so `Static Sites` and `static-sites` reach the
  same page. The first spelling encountered is the one displayed.

## Notes on the empty-mount case

`getCollection` returns `[]` for an empty directory — the normal uninitialised-submodule
state — and logs `The collection "blog" does not exist or is empty`. **That warning is
expected on a fresh clone and is not a failure.** It throws only when the directory is
missing entirely, which happens if someone deletes a mount rather than leaving it empty;
`safely()` catches that and treats it the same way. Collection results are memoised, which
keeps the warning to one line per empty mount and avoids re-querying per page.

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
- Don't surface `usingSamples()` in a production page. It is a development affordance.
