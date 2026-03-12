import { defineCollection, z } from 'astro:content';

const geoPointSchema = z.object({
	name: z.string(),
	lat: z.number().min(-90).max(90),
	lng: z.number().min(-180).max(180),
});

const postGeoSchema = z.object({
	type: z.enum(['country', 'region', 'multi-country', 'global']),
	countries: z.array(z.string()).optional(),
	region: z.string().optional(),
	points: z.array(geoPointSchema).optional(),
});

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			draft: z.boolean().default(false),
			tags: z.array(z.string()).default([]),
			canonical: z.string().url().optional(),
			heroImage: image().optional(),
			geo: postGeoSchema.optional(),
		}),
});

export const collections = { blog };
