import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared fields across all content types
const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  hero_image: z.string().optional(),
  thumbnail: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

// Integration data for a single filter channel
const integrationChannel = z.object({
  frames: z.number(),
  exposure: z.number(),
  total_hours: z.number(),
});

// Astrophotography has rich metadata for capture logs
const astrophotography = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/astrophotography' }),
  schema: baseSchema.extend({
    target: z.string(),
    catalogue: z.array(z.string()).default([]),
    constellation: z.string(),
    filters: z.array(z.string()),
    integration: z.record(z.string(), integrationChannel),
    total_integration_hours: z.number(),
    camera: z.string(),
    telescope: z.string(),
    mount: z.string(),
    palette: z.string(),
    bortle: z.number().optional(),
    location: z.string().optional(),
  }),
});

// Project showcases with status and tech stack
const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: baseSchema.extend({
    status: z.enum(['active', 'complete', 'archived', 'planned']),
    tech: z.array(z.string()).default([]),
    repo: z.string().optional(),
  }),
});

// Claude's first-person column
const claudesCorner = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/claudes-corner' }),
  schema: baseSchema,
});

// Technical deep-dives
const workshop = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/workshop' }),
  schema: baseSchema.extend({
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    tech: z.array(z.string()).default([]),
  }),
});

// Short-form posts
const fieldNotes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/field-notes' }),
  schema: baseSchema,
});

export const collections = {
  astrophotography,
  projects,
  'claudes-corner': claudesCorner,
  workshop,
  'field-notes': fieldNotes,
};
