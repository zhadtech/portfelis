/**
 * The only file that holds identity values. Everything is read from the
 * environment with a neutral placeholder default, so nothing personal is ever
 * committed. Real values live in `.env` locally and in repository variables in CI.
 * See `.env.example` for the full list.
 */

import type { IconName } from '../components/icons';

/** Trimmed env value, or the fallback when unset or blank. */
function value(raw: string | undefined, fallback = ''): string {
  const trimmed = raw?.trim();
  return trimmed ? trimmed : fallback;
}

export interface NavItem {
  label: string;
  /** App-relative. Always passed through `href()` at render time. */
  path: string;
  icon: IconName;
}

export interface SocialLink {
  label: string;
  url: string;
  icon: IconName;
}

export const site = {
  name: value(import.meta.env.PUBLIC_SITE_NAME, 'Portfolio'),
  /** One or two plain sentences: the profile card on the home page, and the meta description. */
  tagline: value(import.meta.env.PUBLIC_SITE_TAGLINE, 'Selected work and writing'),
  handle: value(import.meta.env.PUBLIC_AUTHOR_HANDLE, '@handle'),
  url: value(import.meta.env.PUBLIC_SITE_URL, 'https://example.github.io'),
  /** Web3Forms access key. Public by design. Empty ⇒ the contact page shows links instead. */
  contactFormKey: value(import.meta.env.PUBLIC_CONTACT_FORM_KEY),
} as const;

/**
 * The header tabs, in order. Home is hidden on phones, where the logo does its job.
 * Writing is curated long-form (`kind: research`); Blog is everything else.
 */
export const nav: readonly NavItem[] = [
  { label: 'Home', path: '/', icon: 'house' },
  { label: 'Work', path: '/projects', icon: 'briefcase' },
  { label: 'Writing', path: '/writing', icon: 'notebook-pen' },
  { label: 'Blog', path: '/blog', icon: 'newspaper' },
  { label: 'Contact', path: '/contact', icon: 'mail' },
];

/** Only links with a configured URL survive — no empty icons, no dead links. */
export const socials: readonly SocialLink[] = (
  [
    { label: 'GitHub', url: value(import.meta.env.PUBLIC_SOCIAL_GITHUB), icon: 'github' },
    { label: 'LinkedIn', url: value(import.meta.env.PUBLIC_SOCIAL_LINKEDIN), icon: 'linkedin' },
    { label: 'X', url: value(import.meta.env.PUBLIC_SOCIAL_X), icon: 'x' },
  ] satisfies SocialLink[]
).filter((link) => link.url !== '');
