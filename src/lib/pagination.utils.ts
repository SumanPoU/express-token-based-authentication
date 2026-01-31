export interface PaginationParams {
  page?: number;
  limit?: number;
  filter?: Record<string, any>;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Generic pagination function
 */
export const paginate = async <T>(
  model: any,
  { page = 1, limit = 10, filter = {} }: PaginationParams,
  select?: any,
  include?: any,
): Promise<PaginatedResult<T>> => {
  const skip = (page - 1) * limit;

  const [total, data] = await Promise.all([
    model.count({ where: filter }),
    model.findMany({
      where: filter,
      skip,
      take: limit,
      select,
      include,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: { total, page, limit, totalPages },
  };
};
