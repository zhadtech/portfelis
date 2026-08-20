# src/components — presentational pieces

| File                  | What it does                                                                                                                                                                                                                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Header.astro`        | Site name linking home, plus the tabs from `nav` in `src/config/site.ts`. Marks the current tab with `aria-current="page"` and an accent underline, using `isActive()` so a post keeps "Writing" lit.                                                                                                     |
| `Footer.astro`        | Copyright line with the site name and handle, plus the configured social links and the RSS link. Renders no social list item for an unset variable.                                                                                                                                                       |
| `ProjectCard.astro`   | One project as a card: title linking to `/projects/<id>`, description, the `tech` list joined by hairline dots, and repository/demo links for whichever of the two exist. Takes `project` and an optional `headingLevel` so it can sit under an `h2` on the home page and be an `h2` itself on the index. |
| `PostCard.astro`      | One post as a row: date in a fixed left column (tabular figures, so dates align down the page), title, description, and tag chips. `showTags={false}` on pages where the tags would be redundant.                                                                                                         |
| `TagList.astro`       | Tag chips linking to `/blog/tags/<slug>`. Accepts raw frontmatter labels or resolved `Tag` objects; `showCounts` adds the post count, `activeSlug` marks the current tag.                                                                                                                                 |
| `FormattedDate.astro` | A `<time>` element with a machine-readable `datetime` and a long human date. Formats in UTC deliberately — frontmatter dates are calendar days, and the build machine's timezone would shift half of them by one.                                                                                         |
| `ContactForm.astro`   | The Web3Forms contact form: labelled name/email/message fields, a hidden `botcheck` honeypot, and the site's only client-side script — a `fetch` submit handler with inline status, an `aria-live` region, and a button disabled while in flight. Renders nothing at all when no form key is configured.  |

## Rules

- Components render; they do not decide what content exists. Data comes from
  `src/lib/content.ts`, in the page.
- Every internal URL goes through `href()`. Every external link gets `rel="noopener"`.
- Interactive elements need a visible hover **and** a visible focus state. The focus ring
  comes from `:focus-visible` in `global.css` — don't suppress it locally.

## About the contact form key

`PUBLIC_CONTACT_FORM_KEY` ships in the HTML, and that is correct. A Web3Forms access key
identifies the form, not the account, and is designed to be public — there is no server
here to hide it behind. Do not "fix" this by moving it out of the bundle. The honeypot
and Web3Forms' own filtering are what stop abuse.

## Don't

- Don't add a component that fetches its own content. That splits the draft and fallback
  rules across files, which is exactly what `src/lib/content.ts` exists to prevent.
- Don't add a second client-side script. The form handler is the entire JavaScript budget.
- Don't render the form when `site.contactFormKey` is empty — a fresh clone must look
  intentional, not broken. The page shows contact links instead.
