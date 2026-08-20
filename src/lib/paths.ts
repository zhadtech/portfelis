/**
 * Base-path helpers.
 *
 * The site deploys under a subpath (`/portfelis` by default), so a literal
 * `href="/blog"` works in `astro dev` and 404s on GitHub Pages. Every internal
 * link and every asset URL goes through `href()` instead — one place to be right.
 */

const BASE = import.meta.env.BASE_URL;

/** Join the configured base path with an app-relative path. */
export function href(path: string): string {
  const base = BASE.replace(/\/+$/, '');
  const rest = path.replace(/^\/+/, '');
  return rest ? `${base}/${rest}` : `${base}/`;
}

/** Trailing-slash-insensitive form, so `/blog` and `/blog/` compare equal. */
function normalise(path: string): string {
  return path.replace(/\/+$/, '') || '/';
}

/**
 * Is `pathname` (as given by `Astro.url.pathname`, base included) inside `target`?
 * Home matches exactly; every other entry also matches its descendants, so a post
 * page keeps the "Writing" tab lit.
 */
export function isActive(pathname: string, target: string): boolean {
  const here = normalise(pathname);
  const link = normalise(href(target));
  const home = normalise(href('/'));
  if (link === home) return here === home;
  return here === link || here.startsWith(`${link}/`);
}
