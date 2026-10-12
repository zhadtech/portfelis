# src/config — the settings file

| File      | What it does                                                                                                                                                                                                                                                                                                                                          |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.ts` | The single source of truth for identity. Exports `site` (name, tagline, handle, url, contact form key), `nav` (the header tabs, in order, each with an icon — Home first), and `socials` (each with an icon; only the links with a configured URL survive the filter). Every value is read from `import.meta.env` with a neutral placeholder default. |

## Rules

- **This is the only file allowed to hold identity values**, and it must read every one
  of them from the environment. Placeholder defaults are what gets committed.
- `nav` paths are app-relative (`/blog`). They are passed through `href()` at render
  time — never store a base-prefixed path here.
- A social link with an empty URL is dropped, not rendered greyed out. No dead links.
- `tagline` is the bio on the home page's profile card, and the site's meta and feed
  description. One or two plain sentences; it is read from `PUBLIC_SITE_TAGLINE`.
- Icon names come from `src/components/icons.ts`; a typo is a type error.
- `nav` starts with Home. `Header.astro` hides that tab on phones, and `404.astro` lists
  every entry, so don't add a second Home link in either.

## Don't

- Don't hardcode a name, email, handle, or URL here, "just for now". That is the one
  thing this file exists to prevent.
- Don't read `import.meta.env` from anywhere else. Import from here instead, so there is
  one list of what the site knows about its owner.
- Don't alias `import.meta.env` to a local variable before reading a key — Vite replaces
  `import.meta.env.KEY` textually, and the alias defeats it in client bundles.
