import type { BaseResponse, PaginationMeta } from './BaseResponse';

export interface PaginatedResponse<T = unknown> extends BaseResponse<T[]> {
  data: T[];
  pagination: PaginationMeta;
}
