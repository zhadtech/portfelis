import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';

/**
 * The mount-or-sample resolver.
 *
 * Real content lives in private git submodules mounted at `src/content/blog` and
 * `src/content/projects`. Those directories are empty on a fresh clone, in a fork,
 * and in any PR build. When a mounted collection has no entries, the committed
 * samples stand in. Every rule about drafts and ordering lives here, once, so no
 * page has to remember them.
 */

export type Post = CollectionEntry<'blog' | 'blogSample'>;
export type Project = CollectionEntry<'projects' | 'projectSample'>;

export interface Tag {
  /** The label as written in frontmatter. */
  tag: string;
  /** URL-safe form used by `/blog/tags/[tag]`. */
  slug: string;
  count: number;
}

const cache = new Map<string, Promise<unknown[]>>();

/**
 * `getCollection` returns `[]` for an empty directory, which is the normal
 * uninitialised-submodule case, and logs "collection does not exist or is empty"
 * as it does — expected output on a fresh clone, not a failure. It throws only if
 * the directory is missing altogether, which happens when someone deletes a mount
 * instead of leaving it empty. Treat both as "no content here".
 *
 * Memoised so each collection is asked once per build, which also keeps that
 * warning to one line per empty mount.
 */
function safely<C extends CollectionKey>(collection: C) {
  const cached = cache.get(collection);
  if (cached) return cached as Promise<Awaited<ReturnType<typeof getCollection<C>>>>;

  const pending = getCollection(collection).catch(() => []);
  cache.set(collection, pending as Promise<unknown[]>);
  return pending;
}

/** Mounted content if there is any, otherwise the samples. */
async function resolve<M extends CollectionKey, S extends CollectionKey>(mounted: M, sample: S) {
  const real = await safely(mounted);
  return real.length > 0 ? real : await safely(sample);
}

/** Drafts are visible while writing and absent from production builds. */
function visible<T extends { data: { draft: boolean } }>(entries: T[]): T[] {
  return import.meta.env.PROD ? entries.filter((entry) => !entry.data.draft) : entries;
}

function byNewest(a: { data: { date: Date } }, b: { data: { date: Date } }): number {
  return b.data.date.valueOf() - a.data.date.valueOf();
}

export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function getPosts(): Promise<Post[]> {
  const posts = (await resolve('blog', 'blogSample')) as Post[];
  return visible(posts).sort(byNewest);
}

export async function getProjects(): Promise<Project[]> {
  const projects = (await resolve('projects', 'projectSample')) as Project[];
  return visible(projects).sort(byNewest);
}

/** Featured first, then newest. Used by the home page and the projects grid. */
export async function getProjectsByPriority(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.sort(
    (a, b) => Number(b.data.featured) - Number(a.data.featured) || byNewest(a, b),
  );
}

/** Tag counts, computed once here rather than in every page that shows a tag. */
export async function getAllTags(): Promise<Tag[]> {
  const posts = await getPosts();
  const counts = new Map<string, Tag>();
  for (const post of posts) {
    for (const label of post.data.tags) {
      const slug = tagSlug(label);
      if (!slug) continue;
      const existing = counts.get(slug);
      // First spelling seen wins, so `Tooling` and `tooling` do not split the page.
      if (existing) existing.count += 1;
      else counts.set(slug, { tag: label, slug, count: 1 });
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export async function getPostsByTag(slug: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((post) => post.data.tags.some((label) => tagSlug(label) === slug));
}

/**
 * True when either mount is empty and placeholders are standing in.
 * The UI may only surface this in dev — never build a production page around it.
 */
export async function usingSamples(): Promise<boolean> {
  const [posts, projects] = await Promise.all([safely('blog'), safely('projects')]);
  return posts.length === 0 || projects.length === 0;
}
