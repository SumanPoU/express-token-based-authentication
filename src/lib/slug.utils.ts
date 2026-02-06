import { AppError } from '@/lib/AppError';
import httpStatus from 'http-status';

type PrismaModelDelegate = {
  findFirst: (args: any) => Promise<any>;
};

export class SlugUtils {
  /**
   * Convert text to URL-friendly slug
   */
  public static slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Generate unique slug
   * Usage: generateSlug(title, db.page)
   */
  public static async generateSlug(title: string, model: PrismaModelDelegate): Promise<string> {
    const baseSlug = SlugUtils.slugify(title);
    let slug = baseSlug;
    let counter = 1;

    while (
      await model.findFirst({
        where: { slug },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  /**
   * Validate provided slug uniqueness
   */
  public static async validateSlugUniqueness(
    slug: string,
    model: PrismaModelDelegate,
    excludeId?: string,
  ): Promise<void> {
    const existing = await model.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (existing) {
      throw new AppError('Slug already exists', httpStatus.BAD_REQUEST);
    }
  }
}
