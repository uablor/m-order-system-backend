import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../../infrastructure/persistence/pagination';

export interface PaginationQueryParams {
  page: number;
  limit: number;
}

/**
 * @PaginationQuery() — parse page & limit from query string.
 * Usage: @Query(PaginationQuery()) pagination: PaginationQueryParams
 */
export const PaginationQuery = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): PaginationQueryParams => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query ?? {};
    const page = Math.max(1, parseInt(String(query.page), 10) || DEFAULT_PAGE);
    const limit = Math.min(
      MAX_LIMIT,
      Math.max(1, parseInt(String(query.limit), 10) || DEFAULT_LIMIT),
    );
    return { page, limit };
  },
);
