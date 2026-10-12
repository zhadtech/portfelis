# src/components — presentational pieces

| File                   | What it does                                                                                                                                                                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Header.astro`         | The blue bar: logo mark (the favicon's three bars in `currentColor`) and site name linking home, plus the icon tabs from `nav` in `src/config/site.ts`. Marks the current tab with `aria-current="page"` and a darker fill, using `isActive()` so a post keeps its section lit. Hides the Home tab on phones, where the logo does that job. |
| `Footer.astro`         | Copyright line with the site name — and the handle, unless it only repeats the name — plus the configured social links and RSS, each with its icon. Renders no item for an unset variable.                                                                                                                                                  |
| `Icon.astro`           | One inline SVG from `icons.ts`, drawn in `currentColor`. 1em square unless a size class says otherwise. Decorative by default (`aria-hidden`); pass `label` when the icon carries meaning on its own, like the featured star.                                                                                                               |
| `icons.ts`             | The icon set: inner SVG markup keyed by name, and the `IconName` type that `site.ts` uses for nav and social icons. Lucide (ISC) and one Simple Icons mark (CC0); the licence notice lives in the file and must stay with it.                                                                                                               |
| `PillLink.astro`       | The rounded uppercase button-link. `solid` for the main action, `quiet` beside it; optional leading `icon` and trailing `iconEnd`; `external` adds `rel="noopener"`. The contact form's submit button copies the solid classes, because it is a `<button>`.                                                                                 |
| `PageHeader.astro`     | The title block of an index page: optional back link, the `h1` with its icon, a one-sentence lead, and a slot for extras such as a post count. Sits on a `tint-soft` rule.                                                                                                                                                                  |
| `SectionHeading.astro` | A home-page section heading: small uppercase `h2` with an icon, and an optional "see all" link with an arrow.                                                                                                                                                                                                                               |
| `Card.astro`           | A sidebar card: header strip with an icon, title and the `.scallop` wavy edge, then a slot. The title doubles as the section's accessible name.                                                                                                                                                                                             |
| `ProfileCard.astro`    | The home page introduction: monogram avatar overlapping the top edge, "Hi, I'm {name}." as the page's `h1`, `site.tagline` as the bio, and a Get in touch pill. A monogram rather than a photo, by decision.                                                                                                                                |
| `ProjectCard.astro`    | One project: letter tile (alternating shade down a list), title linking to `/projects/<id>` with a star when featured, date and `tech` badges, the description on a tinted rule, then Details / Repository / Live demo pills for whichever exist. `headingLevel` lets it sit under a section `h2` or be an `h2` itself.                     |
| `PostCard.astro`       | One post as a full entry: display-font title on a dotted rule, date and reading time, description, optional tag chips, and a Read pill. Links via `postPath()`, so it works for Blog and Writing alike. Used where posts are few and long — Writing, and the home page's Writing section.                                                   |
| `PostRow.astro`        | One post as an archive line: date in a fixed left column, title, description. Renders an `<li>` — the page supplies the list. `dateFormat="day"` under a year heading; `showKind` marks research posts where a list mixes both sections.                                                                                                    |
| `TagList.astro`        | Tag chips linking to `/blog/tags/<slug>`. Accepts raw frontmatter labels or resolved `Tag` objects; `showCounts` adds the post count in a small tinted box, `activeSlug` marks the current tag.                                                                                                                                             |
| `FormattedDate.astro`  | A `<time>` element with a machine-readable `datetime`. `format` is `long` (October 8, 2026), `short` (Oct 8, 2026) or `day` (Oct 8, for lists grouped by year). Formats in UTC deliberately — frontmatter dates are calendar days, and the build machine's timezone would shift half of them by one.                                        |
| `ContactForm.astro`    | The Web3Forms contact form: labelled name/email/message fields, a hidden `botcheck` honeypot, and the site's only client-side script — a `fetch` submit handler with inline status, an `aria-live` region, and a button disabled while in flight. Renders nothing at all when no form key is configured.                                    |

## Rules

- Components render; they do not decide what content exists. Data comes from
  `src/lib/content.ts`, in the page. (`PostCard`/`PostRow` call `postPath()` and
  `readingMinutes()` — pure functions of the entry they were handed, not queries.)
- Every internal URL goes through `href()`. Every external link gets `rel="noopener"`.
- Interactive elements need a visible hover **and** a visible focus state. The focus ring
  comes from `:focus-visible` in `global.css` — don't suppress it locally. On an accent
  fill, recolor it with `focus-visible:outline-on-accent` instead.
- Repeated link text ("Read", "Details") carries the title in an `sr-only` span, so a
  screen reader's link list is not ten identical entries.
- Icons are `Icon.astro`, never a pasted `<svg>`. The one exception is the logo mark in
  `Header.astro`, which is the favicon's drawing rather than an icon.

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
- Don't give `Icon.astro` a default size _class_. Its 1em default is in the width/height
  attributes so that any size utility a caller passes wins; two size classes would be
  decided by stylesheet order instead.
- Don't install an icon package. Add the paths to `icons.ts`.
