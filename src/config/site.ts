/**
 * The only file that holds identity values. Everything is read from the
 * environment with a neutral placeholder default, so nothing personal is ever
 * committed. Real values live in `.env` locally and in repository variables in CI.
 * See `.env.example` for the full list.
 */

/** Trimmed env value, or the fallback when unset or blank. */
function value(raw: string | undefined, fallback = ''): string {
  const trimmed = raw?.trim();
  return trimmed ? trimmed : fallback;
}

export interface NavItem {
  label: string;
  /** App-relative. Always passed through `href()` at render time. */
  path: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export const site = {
  name: value(import.meta.env.PUBLIC_SITE_NAME, 'Portfolio'),
  tagline: value(import.meta.env.PUBLIC_SITE_TAGLINE, 'Selected work and writing'),
  handle: value(import.meta.env.PUBLIC_AUTHOR_HANDLE, '@handle'),
  url: value(import.meta.env.PUBLIC_SITE_URL, 'https://example.github.io'),
  /** Web3Forms access key. Public by design. Empty ⇒ the contact page shows links instead. */
  contactFormKey: value(import.meta.env.PUBLIC_CONTACT_FORM_KEY),
} as const;

export const nav: readonly NavItem[] = [
  { label: 'Work', path: '/projects' },
  { label: 'Writing', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];

/** Only links with a configured URL survive — no empty icons, no dead links. */
export const socials: readonly SocialLink[] = [
  { label: 'GitHub', url: value(import.meta.env.PUBLIC_SOCIAL_GITHUB) },
  { label: 'LinkedIn', url: value(import.meta.env.PUBLIC_SOCIAL_LINKEDIN) },
  { label: 'X', url: value(import.meta.env.PUBLIC_SOCIAL_X) },
].filter((link) => link.url !== '');
