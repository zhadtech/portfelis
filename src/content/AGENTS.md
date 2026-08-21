# src/content — content, real and placeholder

`blog/` and `projects/` are **git submodule mounts** owned by the private repositories
zhadtech/portfelis-blog and zhadtech/portfelis-projects. Nothing in them is committed to
this repository — only a pointer to a commit in theirs. They are empty until
`npm run content:on` checks them out, and empty again after `npm run content:off`.
Everything below is the committed fallback that renders when they are empty.

Their contents are documented in their own READMEs, not here, and `scripts/check-docs.mjs`
skips both directories for the same reason.

| File                                                                                   | What it does                                                                                                                |
| -------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `samples/blog/reading-the-build-output.md`                                             | Short title, one tag, a fenced code block and an inline link.                                                               |
| `samples/blog/why-static-is-usually-the-right-default-for-a-small-personal-project.md` | Deliberately long title, four tags, and the blockquote / list / table paths.                                                |
| `samples/blog/measuring-what-the-reader-waits-for.md`                                  | `draft: true`. Visible in `astro dev`, absent from a production build — this is the draft-filtering test.                   |
| `samples/projects/ledger.md`                                                           | `featured: true`, with both `repo` and `demo`, four `tech` entries and a code block. Exercises the featured-first ordering. |
| `samples/projects/field-notes.md`                                                      | Neither `repo` nor `demo`, one `tech` entry. Proves the card and detail page look deliberate without links.                 |
| `samples/projects/atlas.md`                                                            | `draft: true`, `repo` only, with a table. The project-side draft test.                                                      |

## Rules

- Sample copy is generic and obviously placeholder. No real names, no real URLs — use
  `example.com` — and nothing that reads as a claim about the site owner.
- Between them the samples must keep covering every rendering path: long and short
  titles, one tag and several, code, blockquote, list, table, inline link, both link
  fields, neither, featured, and draft. Deleting one leaves a path untested.
- Files must be flat. Entry ids come from the file name and become the URL slug; a
  subdirectory would put a slash in it. Frontmatter fields are defined in
  `src/content.config.ts`.
- Images belong beside their Markdown, referenced from the `cover` field, so Astro
  optimises them. The samples ship none — nothing here needs a binary in git history.

## Don't

- **Don't write anything into `blog/` or `projects/`.** They belong to other
  repositories. Committing into a mount point breaks the submodule. To publish, commit and
  push in the content repository, then move this repository's pointer:
  `git submodule update --remote && git add src/content/blog src/content/projects`.
- Don't add a sample that mirrors a real entry. Samples exist to exercise rendering paths,
  not to preview content — a stale copy of a real post is worse than an obvious placeholder.
- Don't reformat those two directories either — they are in `.prettierignore`.
- Don't name a sample file `README.md`. The content glob excludes that name, because the
  private repos have one at their root.
