import type { BaseResponse, ErrorDetail } from './BaseResponse';

export interface ErrorResponse<T = unknown> extends BaseResponse<T> {
  status: 'error';
  error: ErrorDetail;
}
