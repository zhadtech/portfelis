import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Four collections, two schemas.
 *
 * `blog` and `projects` point at the git submodule mounts, which are empty on a
 * fresh clone. `blogSample` and `projectSample` point at committed placeholders.
 * `src/lib/content.ts` picks between them — pages never touch these names directly.
 */

// README.md is excluded because the private content repos have one at their root,
// and it would otherwise become an entry. `_`-prefixed files are working drafts.
const MARKDOWN = ['**/*.md', '!**/README.md', '!**/_*'];

export const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
});

export const projectSchema = ({ image }: SchemaContext) =>
  z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tech: z.array(z.string()).default([]),
    repo: z.url().optional(),
    demo: z.url().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    // Co-located with the Markdown so it goes through Astro's image pipeline.
    cover: image().optional(),
  });

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: MARKDOWN, base: './src/content/blog' }),
    schema: blogSchema,
  }),
  blogSample: defineCollection({
    loader: glob({ pattern: MARKDOWN, base: './src/content/samples/blog' }),
    schema: blogSchema,
  }),
  projects: defineCollection({
    loader: glob({ pattern: MARKDOWN, base: './src/content/projects' }),
    schema: projectSchema,
  }),
  projectSample: defineCollection({
    loader: glob({ pattern: MARKDOWN, base: './src/content/samples/projects' }),
    schema: projectSchema,
  }),
};
