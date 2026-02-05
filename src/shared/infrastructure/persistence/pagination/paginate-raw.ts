import type { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import {
  normalizePaginationParams,
  type PaginationResult,
} from './base-pagination';

/**
 * Paginate a TypeORM QueryBuilder (raw/query). Returns rows + meta.
 */
export async function paginateRaw<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  params: { page?: number; limit?: number },
): Promise<PaginationResult<T>> {
  const { page, limit } = normalizePaginationParams(params.page, params.limit);
  const skip = (page - 1) * limit;

  const [data, total] = await qb.skip(skip).take(limit).getManyAndCount();
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    data,
    total,
    page,
    limit,
    totalPages,
    count: data.length,
  };
}
