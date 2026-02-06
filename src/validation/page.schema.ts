import { z } from 'zod';
import { safeString } from './authSchema';

export const PageIdentifierParamSchema = z
  .object({
    id: z.string().uuid('Invalid page ID').optional(),
    slug: safeString('Slug', 1, 255).optional(),
  })
  .refine((data) => (data.id && !data.slug) || (!data.id && data.slug), {
    message: 'Provide either page id or slug, not both',
  });

// Create Page
export const CreatePageSchema = z.object({
  title: safeString('Title', 3, 100),
  slug: safeString('Slug', 3, 100).optional(),
  staticText: safeString('Static Text', 0, 255).optional(),
});

// Edit Page
export const UpdatePageSchema = z.object({
  title: safeString('Title', 3, 100).optional(),
  slug: safeString('Slug', 3, 100).optional(),
  staticText: safeString('Static Text', 0, 255).optional(),
});

export const PageFilterSchema = z.object({
  search: safeString('search').optional(),
});

export type PageFilterInput = z.infer<typeof PageFilterSchema>;
export type CreatePageInput = z.infer<typeof CreatePageSchema>;
export type UpdatePageInput = z.infer<typeof UpdatePageSchema>;
export type PageIdentifierInput = z.infer<typeof PageIdentifierParamSchema>;
