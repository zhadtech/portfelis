/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL?: string;
  readonly PUBLIC_BASE_PATH?: string;
  readonly PUBLIC_SITE_NAME?: string;
  readonly PUBLIC_SITE_TAGLINE?: string;
  readonly PUBLIC_AUTHOR_HANDLE?: string;
  readonly PUBLIC_CONTACT_FORM_KEY?: string;
  readonly PUBLIC_SOCIAL_GITHUB?: string;
  readonly PUBLIC_SOCIAL_LINKEDIN?: string;
  readonly PUBLIC_SOCIAL_X?: string;
  /** Build-time only, never shipped to the client. See src/lib/content.ts. */
  readonly CONTENT_SOURCE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
