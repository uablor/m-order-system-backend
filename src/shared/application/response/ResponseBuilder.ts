import type { BaseResponse, PaginationMeta } from './BaseResponse';

export class ResponseBuilder {
  static success<T>(data: T, message = 'OK'): BaseResponse<T> {
    return {
      status: 'success',
      message,
      data,
    };
  }

  static successPaginated<T>(
    data: T[],
    pagination: PaginationMeta,
    message = 'OK',
  ): BaseResponse<T[]> {
    return {
      status: 'success',
      message,
      data,
      pagination,
    };
  }

  static error(
    message: string,
    code: string,
    details?: unknown,
  ): BaseResponse<null> {
    return {
      status: 'error',
      message,
      data: null,
      error: { code, details },
    };
  }
}
