/**
 * Pagination belongs to Application/Infrastructure. Never Domain.
 */

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  count: number;
}

export function normalizePaginationParams(
  page?: number,
  limit?: number,
): PaginationParams {
  const p = Math.max(1, page ?? DEFAULT_PAGE);
  const l = Math.min(MAX_LIMIT, Math.max(1, limit ?? DEFAULT_LIMIT));
  return { page: p, limit: l };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
  count: number,
): {
  total: number;
  count: number;
  limit: number;
  totalPages: number;
  currentPage: number;
} {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    total,
    count,
    limit,
    totalPages,
    currentPage: page,
  };
}
