import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { site } from '../config/site';
import { getPosts } from '../lib/content';
import { href } from '../lib/paths';

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: site.name,
    description: site.tagline,
    // Include the base path so the channel link points at the site, not the domain
    // root. Item links are absolute paths already, so they resolve correctly either way.
    site: new URL(import.meta.env.BASE_URL, context.site ?? site.url),
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: href(`/blog/${post.id}`),
      categories: [...post.data.tags],
    })),
  });
}
