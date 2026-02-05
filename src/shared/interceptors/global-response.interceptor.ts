import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { BaseResponse, PaginationMeta } from '../application/response/BaseResponse';
import { ResponseBuilder } from '../application/response/ResponseBuilder';

/**
 * Wraps all successful responses in the Global Response Contract.
 * Handlers may return:
 * - raw data → wrapped as { status: 'success', message: 'OK', data }
 * - { data, pagination } (from list handlers) → wrapped with pagination
 */
@Injectable()
export class GlobalResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<BaseResponse<unknown>> {
    return next.handle().pipe(
      map((value: unknown): BaseResponse<unknown> => {
        if (value != null && typeof value === 'object' && 'data' in value && 'pagination' in value) {
          const { data, pagination } = value as {
            data: unknown[];
            pagination: PaginationMeta;
          };
          return ResponseBuilder.successPaginated(
            data,
            pagination,
            'OK',
          );
        }
        return ResponseBuilder.success(value, 'OK');
      }),
    );
  }
}
