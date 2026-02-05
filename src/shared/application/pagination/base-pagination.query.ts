import { DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../../infrastructure/persistence/pagination';

/**
 * Base for list/paginated queries. Pagination belongs to Application layer.
 */
export abstract class BasePaginationQuery {
  readonly page: number;
  readonly limit: number;

  constructor(page?: number, limit?: number) {
    this.page = Math.max(1, page ?? DEFAULT_PAGE);
    this.limit = Math.min(MAX_LIMIT, Math.max(1, limit ?? DEFAULT_LIMIT));
  }
}
