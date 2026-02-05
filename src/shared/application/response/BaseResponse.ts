/**
 * Global response contract. All APIs MUST return this envelope (via interceptor or builder).
 */
export type ResponseStatus = 'success' | 'error';

export interface PaginationMeta {
  total: number;
  count: number;
  limit: number;
  totalPages: number;
  currentPage: number;
}

export interface ErrorDetail {
  code: string;
  details?: unknown;
}

export interface BaseResponse<T = unknown> {
  status: ResponseStatus;
  message: string;
  data: T;
  pagination?: PaginationMeta;
  error?: ErrorDetail;
}
