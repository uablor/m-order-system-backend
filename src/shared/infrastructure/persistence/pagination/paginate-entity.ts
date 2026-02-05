import type { FindOptionsOrder, ObjectLiteral, Repository } from 'typeorm';
import {
  normalizePaginationParams,
  buildPaginationMeta,
  type PaginationResult,
} from './base-pagination';

export interface PaginateEntityOptions<Entity> {
  where?: object;
  order?: FindOptionsOrder<Entity>;
}

/**
 * Paginate a TypeORM repository (entity). Returns domain-friendly result with meta.
 */
export async function paginateEntity<Entity extends ObjectLiteral>(
  repo: Repository<Entity>,
  params: { page?: number; limit?: number },
  options: PaginateEntityOptions<Entity> = {},
): Promise<PaginationResult<Entity>> {
  const { page, limit } = normalizePaginationParams(params.page, params.limit);
  const skip = (page - 1) * limit;

  const [data, total] = await repo.findAndCount({
    where: options.where,
    order: options.order,
    skip,
    take: limit,
  });

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

/**
 * Build pagination meta from raw total and count (e.g. when mapping entities to DTOs).
 */
export function toPaginationMeta(
  total: number,
  page: number,
  limit: number,
  count: number,
) {
  return buildPaginationMeta(total, page, limit, count);
}

